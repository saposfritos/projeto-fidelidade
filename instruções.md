1. Pré-requisitos

- Python 3.11 ou superior
- pip (gerenciador de pacotes Python)

2. Instalação

# Clone ou extraia o projeto
cd loyalty-backend

# Instale as dependências
pip install -r requirements.txt

3. Configuração do Banco de Dados

O banco de dados SQLite será criado automaticamente na primeira execução com dados de exemplo:

**Usuário Admin:**
- Email: `admin@eniac.edu.br`
- Senha: `admin123`

4. Execução

# Execute o servidor
python src/main.py

O servidor estará disponível em: `http://localhost:5001`


# Adicionar Pontos ao Usuário
sqlite3 D:\Downloads\projeto-fidelidade-quase-pronto\projeto-fidelidade-quase-pronto\fidelidade-backend\src\database\app.db "UPDATE user SET points = points + 1000 WHERE email = 'emaildousuario';"

# Adicionar novo Produto
sqlite3 D:\Downloads\projeto-fidelidade-quase-pronto\projeto-fidelidade-quase-pronto\fidelidade-backend\src\database\app.db "INSERT INTO product (name, description, price, category, image_url, stock, created_at) VALUES (
    'Nome do produto', 
    'Descrição', 
    100, 
    'eletronicos', 
    'https://example.com/imagem_novo_produto.jpg', 
    100, 
    strftime('%Y-%m-%d %H:%M:%S')
);"

# Remover Produto
sqlite3 D:\Downloads\projeto-fidelidade-quase-pronto\projeto-fidelidade-quase-pronto\fidelidade-backend\src\database\app.db "DELETE FROM product WHERE id = 'id produto';"