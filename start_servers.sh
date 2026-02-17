#!/bin/bash
# Script per avviare Django e React in background

echo "Avvio Django..."
# Avvia Django e salva il PID (ID processo)
python3 manage.py runserver 0.0.0.0:8000 > django.log 2>&1 &

echo "Avvio React..."
# Entra nella cartella, avvia e salva il PID
cd frontend && npm run dev -- --host > ../react.log 2>&1 &

echo "Server avviati in background!"