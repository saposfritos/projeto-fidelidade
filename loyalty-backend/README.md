# Sistema de Fidelidade ENIAC - Backend

Este é o backend completo para o sistema de fidelidade da ENIAC, desenvolvido em Flask com integração total ao frontend existente.

## 🚀 Funcionalidades

### Autenticação
- Login seguro com hash de senhas
- Sessões persistentes
- Middleware de autenticação para rotas protegidas

### Gestão de Usuários
- Cadastro e gerenciamento de usuários
- Sistema de pontos integrado
- Histórico de transações

### Catálogo de Produtos
- CRUD completo de produtos
- Filtros por categoria, preço e popularidade
- Controle de estoque
- Imagens via URLs externas

### Sistema de Resgate
- Validação de pontos suficientes
- Transações atômicas
- Atualização automática de saldo
- Histórico de resgates

### Upload de Certificados
- Upload seguro de arquivos PDF
- Validação de tipo e tamanho
- Armazenamento organizado
- Sistema de validação posterior

## 🛠️ Tecnologias Utilizadas

- **Flask** - Framework web
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Flask-CORS** - Suporte a CORS
- **Werkzeug** - Utilitários web e hash de senhas
- **Python 3.11** - Linguagem de programação

## 📁 Estrutura do Projeto

```
loyalty-backend/
├── src/
│   ├── main.py              # Aplicação principal
│   ├── models/
│   │   └── user.py          # Modelos de dados
│   ├── routes/
│   │   ├── user.py          # Rotas de usuário e autenticação
│   │   ├── products.py      # Rotas de produtos
│   │   └── certificates.py  # Rotas de certificados
│   ├── static/              # Frontend integrado
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── produtos.html
│   │   ├── upload_certificado.html
│   │   ├── script/
│   │   └── style/
│   ├── database/            # Banco de dados SQLite
│   └── uploads/             # Arquivos enviados
├── venv/                    # Ambiente virtual
├── requirements.txt         # Dependências
└── README.md               # Este arquivo
```

## 🔧 Instalação e Configuração

### 1. Pré-requisitos
- Python 3.11 ou superior
- pip (gerenciador de pacotes Python)

### 2. Instalação

```bash
# Clone ou extraia o projeto
cd loyalty-backend

# Ative o ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt
```

### 3. Configuração do Banco de Dados

O banco de dados SQLite será criado automaticamente na primeira execução com dados de exemplo:

**Usuário Admin:**
- Email: `admin@eniac.edu.br`
- Senha: `admin123`
- Pontos: 5.000

**Produtos de Exemplo:**
- 8 produtos variados com diferentes categorias
- Preços de 150 a 1.200 pontos
- Estoque controlado

### 4. Execução

```bash
# Execute o servidor
python src/main.py
```

O servidor estará disponível em: `http://localhost:5001`

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `GET /api/auth/me` - Dados do usuário logado
- `POST /api/auth/logout` - Logout

### Produtos
- `GET /api/products` - Listar produtos (com filtros)
- `GET /api/products/{id}` - Detalhes do produto
- `POST /api/products/{id}/redeem` - Resgatar produto

### Certificados
- `POST /api/certificates/upload` - Upload de certificado
- `GET /api/certificates` - Listar certificados do usuário

### Usuários
- `GET /api/users` - Listar usuários (admin)
- `POST /api/users` - Criar usuário
- `PUT /api/users/{id}` - Atualizar usuário

## 🔒 Segurança

- Senhas hasheadas com Werkzeug
- Validação de sessões
- Sanitização de uploads
- Validação de tipos de arquivo
- Proteção CORS configurada

## 🎯 Funcionalidades do Frontend Integrado

### Página Inicial (`/`)
- Apresentação do sistema
- Navegação principal
- Call-to-action para login

### Login (`/login.html`)
- Formulário de autenticação
- Validação em tempo real
- Feedback visual
- Redirecionamento automático

### Produtos (`/produtos.html`)
- Catálogo completo de produtos
- Filtros por categoria, preço e popularidade
- Sistema de pontos em tempo real
- Modal de confirmação de resgate
- Feedback de sucesso/erro

### Certificados (`/upload_certificado.html`)
- Upload drag-and-drop
- Validação de arquivos PDF
- Feedback de progresso
- Mensagens de status

## 🔄 Fluxo de Dados

1. **Login**: Frontend → `/api/auth/login` → Sessão criada
2. **Produtos**: Frontend → `/api/products` → Lista filtrada
3. **Resgate**: Frontend → `/api/products/{id}/redeem` → Transação processada
4. **Upload**: Frontend → `/api/certificates/upload` → Arquivo salvo

## 🚀 Deploy e Produção

### Configurações Recomendadas

1. **Banco de Dados**: Migrar para PostgreSQL ou MySQL
2. **Servidor**: Usar Gunicorn + Nginx
3. **Segurança**: Configurar HTTPS e variáveis de ambiente
4. **Storage**: Usar serviços de cloud para uploads

### Exemplo de Deploy

```bash
# Instalar Gunicorn
pip install gunicorn

# Executar em produção
gunicorn -w 4 -b 0.0.0.0:5001 src.main:app
```

## 🧪 Testes

### Credenciais de Teste
- **Email**: admin@eniac.edu.br
- **Senha**: admin123
- **Pontos**: 5.000

### Cenários de Teste
1. Login com credenciais válidas/inválidas
2. Navegação entre páginas
3. Filtros de produtos
4. Resgate de produtos
5. Upload de certificados

## 📝 Logs e Monitoramento

O sistema gera logs automáticos para:
- Tentativas de login
- Transações de resgate
- Uploads de arquivos
- Erros de sistema

## 🔧 Personalização

### Adicionando Novos Produtos
```python
# No arquivo src/main.py, adicione ao array sample_products:
{
    'name': 'Nome do Produto',
    'description': 'Descrição detalhada',
    'price': 500,  # Pontos necessários
    'category': 'electronics',  # ou books, accessories, vouchers
    'image_url': 'https://exemplo.com/imagem.jpg',
    'stock': 10,
    'badge': 'Novo'  # Opcional
}
```

### Configurando Novas Categorias
Edite os filtros no frontend (`produtos.html`) e adicione as validações no backend.

## 🆘 Solução de Problemas

### Erro de Porta em Uso
```bash
# Verificar processos na porta 5001
lsof -i :5001

# Matar processo se necessário
kill -9 <PID>
```

### Erro de Banco de Dados
```bash
# Remover banco existente para recriar
rm src/database/app.db

# Reiniciar aplicação
python src/main.py
```

### Problemas de CORS
Verifique se `flask-cors` está instalado e configurado corretamente no `main.py`.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Confirme se todas as dependências estão instaladas
3. Teste com as credenciais padrão
4. Verifique a conectividade de rede

## 🔄 Atualizações Futuras

### Funcionalidades Planejadas
- [ ] Sistema de notificações
- [ ] Dashboard administrativo
- [ ] Relatórios de uso
- [ ] API de integração externa
- [ ] Sistema de níveis/badges
- [ ] Histórico detalhado de transações

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Documentação da API (Swagger)
- [ ] Cache Redis
- [ ] Rate limiting
- [ ] Backup automatizado

---

**Desenvolvido para ENIAC - Sistema de Fidelidade Estudantil**

