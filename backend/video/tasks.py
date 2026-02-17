import subprocess
import re
import os
import time  # Se lo usi per i test
from celery import shared_task  # <--- AGGIUNGI QUESTA RIGA
from django.conf import settings
from .models import Video


@shared_task(name="video.tasks.process_video_task")
def process_video_task(video_id):
    try:
        instance = Video.objects.get(id=video_id)
        instance.status = 'PROCESSING'
        instance.progress = 0  # Reset progresso
        instance.save()

        input_path = instance.video.path
        output_dir = os.path.join(settings.MEDIA_ROOT, 'video/watermarks')
        os.makedirs(output_dir, exist_ok=True)
        output_name = f"processed_{instance.id}.mp4"
        output_path = os.path.join(output_dir, output_name)

        # 1. Otteniamo la durata totale del video per calcolare la %
        probe_cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                     '-of', 'default=noprint_wrappers=1:nokey=1', input_path]
        duration = float(subprocess.check_output(probe_cmd).decode().strip())

        # Configurazione Logo/Filtri
        inputs = [input_path]
        filter_complex = ""
        logo_path = os.path.join(settings.BASE_DIR, 'static/img/logo.png')

        if instance.logo == 'LOGO' and os.path.exists(logo_path):
            inputs.append(logo_path)

            # Modifica il valore da 0.15 a 0.25 (per renderlo più grande)
            filter_complex = "[1:v][0:v]scale2ref=w=iw*0.20:h=ow/mdar[logo][main];[main][logo]overlay=W-w-(W*0.06):H*0.06"

        # Comando FFmpeg (aggiungiamo -progress pipe:1 per leggere i dati)
        cmd = ['ffmpeg', '-y']
        for inp in inputs:
            cmd.extend(['-i', inp])
        if filter_complex:
            cmd.extend(['-filter_complex', filter_complex])
        cmd.extend(['-c:v', 'libx264', '-preset', 'fast', '-c:a',
                   'copy', '-progress', 'pipe:1', output_path])

        # 2. Esecuzione con monitoraggio progresso
        process = subprocess.Popen(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)

        for line in process.stdout:
            # Cerchiamo il valore 'out_time_ms' (microsecondi elaborati)
            if 'out_time_ms=' in line:
                try:
                    time_ms = int(line.split('=')[1].strip())
                    current_progress = int(
                        (time_ms / 1000000) / duration * 100)

                    # Aggiorniamo il DB ogni 5% per non sovraccaricare Redis/DB
                    if current_progress > instance.progress and current_progress <= 100:
                        instance.progress = current_progress
                        instance.save(update_fields=['progress'])
                except:
                    continue

        process.wait()

        if process.returncode != 0:
            raise Exception("Errore durante la conversione FFmpeg")

        # 3. Aggiornamento finale
        instance.video_watermarks = f"video/watermarks/{output_name}"
        instance.status = 'SUCCESS'
        instance.progress = 100
        instance.save()

    except Video.DoesNotExist:
        pass
    except Exception as e:
        Video.objects.filter(id=video_id).update(
            status='ERROR', error_log=str(e), progress=0)
