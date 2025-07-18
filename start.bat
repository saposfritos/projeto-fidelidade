@echo off
echo Iniciando Sistema de Fidelidade...
echo.

REM Verifica se o diretório loyalty-backend existe
if not exist "loyalty-backend" (
    echo ERRO: Diretorio loyalty-backend nao encontrado!
    echo Certifique-se de que o arquivo esta na pasta correta.
    pause
    exit /b 1
)

REM Verifica se o ambiente virtual existe
if not exist "loyalty-backend\venv" (
    echo ERRO: Ambiente virtual nao encontrado!
    echo Execute primeiro: cd loyalty-backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
    pause
    exit /b 1
)

echo Iniciando o Backend (Flask)...
REM Inicia o Backend em uma nova janela
start "Backend - Sistema de Fidelidade" cmd /k "cd loyalty-backend && venv\Scripts\activate && python src\main.py"

echo Aguardando o backend inicializar...
timeout /t 8 /nobreak > nul

echo Abrindo o sistema no navegador...
REM Abre o navegador com o sistema
start "" "http://localhost:5001"

echo.
echo Sistema iniciado com sucesso!
echo - Backend rodando em: http://localhost:5001
echo - Para parar o sistema, feche a janela do Backend
echo.
pause

