# .ddev/web-build/Dockerfile
ARG BASE_IMAGE
FROM $BASE_IMAGE

# Installa supervisor e ffmpeg se non ci sono
#RUN apt-get update && apt-get install -y supervisor ffmpeg

# Copia la configurazione
COPY supervisor-vvf.conf /etc/supervisor/conf.d/supervisor-vvf.conf