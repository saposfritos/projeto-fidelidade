# Guia de Deploy - Sistema de Fidelidade ENIAC

Este guia fornece instruções detalhadas para fazer o deploy do sistema de fidelidade em diferentes ambientes.

## 🚀 Deploy Local (Desenvolvimento)

### Pré-requisitos
- Python 3.11+
- Git (opcional)

### Passos
1. **Extrair o projeto**
   ```bash
   # Se recebeu um arquivo ZIP
   unzip loyalty-backend.zip
   cd loyalty-backend
   ```

2. **Ativar ambiente virtual**
   ```bash
   # Linux/Mac
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

3. **Instalar dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Executar aplicação**
   ```bash
   python src/main.py
   ```

5. **Acessar aplicação**
   - URL: http://localhost:5001
   - Login: admin@eniac.edu.br
   - Senha: admin123

## 🌐 Deploy em Servidor (Produção)

### Opção 1: Servidor VPS/Dedicado

#### 1. Preparar Servidor
```bash
# Atualizar sistema (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Instalar Python e dependências
sudo apt install python3.11 python3.11-venv python3-pip nginx -y

# Criar usuário para aplicação
sudo useradd -m -s /bin/bash eniac
sudo su - eniac
```

#### 2. Configurar Aplicação
```bash
# Fazer upload do projeto para /home/eniac/loyalty-backend
cd /home/eniac/loyalty-backend

# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências de produção
pip install -r requirements.txt
pip install gunicorn
```

#### 3. Configurar Gunicorn
```bash
# Criar arquivo de configuração
cat > gunicorn.conf.py << EOF
bind = "127.0.0.1:5001"
workers = 4
worker_class = "sync"
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
EOF
```

#### 4. Criar Serviço Systemd
```bash
sudo cat > /etc/systemd/system/eniac-loyalty.service << EOF
[Unit]
Description=ENIAC Loyalty Program
After=network.target

[Service]
User=eniac
Group=eniac
WorkingDirectory=/home/eniac/loyalty-backend
Environment="PATH=/home/eniac/loyalty-backend/venv/bin"
ExecStart=/home/eniac/loyalty-backend/venv/bin/gunicorn -c gunicorn.conf.py src.main:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Habilitar e iniciar serviço
sudo systemctl daemon-reload
sudo systemctl enable eniac-loyalty
sudo systemctl start eniac-loyalty
```

#### 5. Configurar Nginx
```bash
sudo cat > /etc/nginx/sites-available/eniac-loyalty << EOF
server {
    listen 80;
    server_name seu-dominio.com;  # Substitua pelo seu domínio

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /static {
        alias /home/eniac/loyalty-backend/src/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Habilitar site
sudo ln -s /etc/nginx/sites-available/eniac-loyalty /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Opção 2: Heroku

#### 1. Preparar Arquivos
```bash
# Criar Procfile
echo "web: gunicorn -b 0.0.0.0:\$PORT src.main:app" > Procfile

# Criar runtime.txt
echo "python-3.11.0" > runtime.txt

# Atualizar requirements.txt
echo "gunicorn==21.2.0" >> requirements.txt
```

#### 2. Deploy
```bash
# Instalar Heroku CLI e fazer login
heroku login

# Criar aplicação
heroku create eniac-loyalty-app

# Fazer deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Configurar variáveis de ambiente
heroku config:set FLASK_ENV=production
```

### Opção 3: Docker

#### 1. Criar Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["gunicorn", "-b", "0.0.0.0:5001", "src.main:app"]
```

#### 2. Criar docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5001:5001"
    volumes:
      - ./src/database:/app/src/database
      - ./src/uploads:/app/src/uploads
    environment:
      - FLASK_ENV=production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web
    restart: unless-stopped
```

#### 3. Deploy com Docker
```bash
# Construir e executar
docker-compose up -d

# Verificar status
docker-compose ps
```

## 🔒 Configurações de Segurança

### 1. HTTPS com Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Firewall
```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 3. Variáveis de Ambiente
```bash
# Criar arquivo .env (não versionar!)
cat > .env << EOF
SECRET_KEY=sua-chave-secreta-muito-forte
DATABASE_URL=sqlite:///app.db
FLASK_ENV=production
EOF
```

## 📊 Monitoramento

### 1. Logs
```bash
# Ver logs do serviço
sudo journalctl -u eniac-loyalty -f

# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Backup
```bash
# Script de backup do banco
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /home/eniac/loyalty-backend/src/database/app.db \
   /home/eniac/backups/app_$DATE.db

# Manter apenas últimos 7 dias
find /home/eniac/backups -name "app_*.db" -mtime +7 -delete
```

### 3. Monitoramento de Recursos
```bash
# Instalar htop para monitoramento
sudo apt install htop

# Verificar uso de recursos
htop
df -h
free -h
```

## 🔧 Manutenção

### Atualizações
```bash
# Parar serviço
sudo systemctl stop eniac-loyalty

# Fazer backup
cp -r /home/eniac/loyalty-backend /home/eniac/backup-$(date +%Y%m%d)

# Atualizar código
# (substituir arquivos)

# Instalar novas dependências
source venv/bin/activate
pip install -r requirements.txt

# Reiniciar serviço
sudo systemctl start eniac-loyalty
```

### Troubleshooting
```bash
# Verificar status do serviço
sudo systemctl status eniac-loyalty

# Verificar logs de erro
sudo journalctl -u eniac-loyalty --since "1 hour ago"

# Testar configuração do Nginx
sudo nginx -t

# Reiniciar serviços
sudo systemctl restart eniac-loyalty
sudo systemctl restart nginx
```

## 📈 Otimizações de Performance

### 1. Cache
```python
# Adicionar ao main.py
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/products')
@cache.cached(timeout=300)  # 5 minutos
def get_products():
    # código existente
```

### 2. Compressão
```bash
# Adicionar ao Nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. CDN para Assets
```html
<!-- Usar CDN para bibliotecas -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
```

## 🚨 Checklist de Deploy

- [ ] Servidor configurado e atualizado
- [ ] Python 3.11+ instalado
- [ ] Aplicação funcionando localmente
- [ ] Banco de dados configurado
- [ ] Nginx configurado
- [ ] HTTPS configurado
- [ ] Firewall configurado
- [ ] Backup configurado
- [ ] Monitoramento configurado
- [ ] Logs funcionando
- [ ] Testes de carga realizados
- [ ] Documentação atualizada

---

**Sucesso no seu deploy! 🚀**

