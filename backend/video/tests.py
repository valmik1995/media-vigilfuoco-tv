from celery import Celery
import socket
import os

# Recuperiamo l'IP attuale per sicurezza
REDIS_IP = socket.gethostbyname('redis')

# Configurazione ultra-semplice
app = Celery('test_app', broker=f'redis://{REDIS_IP}:6379/0')


@app.task
def simple_add(x, y):
    return x + y


if __name__ == "__main__":
    print(f"Tentativo di invio task a Redis ({REDIS_IP})...")
    result = simple_add.delay(4, 4)
    print(f"Task inviato con successo! ID: {result.id}")