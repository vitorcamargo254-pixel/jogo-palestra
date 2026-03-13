@echo off
cd /d "%~dp0"

if exist "jogo-palestra.html" (
    start "" "jogo-palestra.html"
) else (
    echo Arquivo jogo-palestra.html nao encontrado nesta pasta.
    pause
)
