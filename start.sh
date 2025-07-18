#!/bin/bash

# Inicia o Backend (Flask)
cd loyalty-backend
source venv/bin/activate
python3 src/main.py &

# Aguarda um pouco para o backend iniciar
sleep 5

# Inicia o Frontend no navegador
xdg-open http://localhost:5001

echo "Frontend e Backend iniciados."


