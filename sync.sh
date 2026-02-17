#!/bin/bash
# Eseguilo prima di cambiare postazione
ddev export-db > db_sync.sql
git add .
git commit -m "Sync: $(date +'%Y-%m-%d %H:%M')"
git push origin main