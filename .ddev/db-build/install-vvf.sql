-- Questo script verrà eseguito alla creazione del database
CREATE USER vvf WITH PASSWORD 'vvf';
GRANT ALL PRIVILEGES ON DATABASE db TO vvf;
ALTER USER vvf WITH SUPERUSER; -- Opzionale, ma utile per migrazioni complesse