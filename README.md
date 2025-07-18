# Sistema de Fidelidade - ENIAC

Sistema de pontos de fidelidade para estudantes da ENIAC.

## Como usar

### Windows
1. Execute o arquivo `start.bat`
2. O sistema abrirá automaticamente no seu navegador
3. Acesse com as credenciais:
   - Email: admin@eniac.edu.br
   - Senha: admin123

### Linux/Mac
1. Execute o arquivo `start.sh`
2. O sistema abrirá automaticamente no seu navegador

## Primeira execução

Se for a primeira vez executando o sistema:

1. Abra o terminal/prompt de comando
2. Navegue até a pasta `loyalty-backend`
3. Execute os comandos:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # ou
   source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

## Funcionalidades

- Login de usuários
- Sistema de pontos
- Loja de produtos
- Upload de certificados
- Troca de pontos por produtos

## Estrutura do Projeto

```
projeto-fidelidade-main/
├── loyalty-backend/          # Backend Flask
│   ├── src/
│   │   ├── main.py          # Arquivo principal
│   │   ├── models/          # Modelos do banco de dados
│   │   ├── routes/          # Rotas da API
│   │   └── static/          # Arquivos do frontend
│   ├── venv/                # Ambiente virtual Python
│   └── requirements.txt     # Dependências Python
├── start.bat                # Script de inicialização (Windows)
├── start.sh                 # Script de inicialização (Linux/Mac)
└── README.md               # Este arquivo
```

## Problemas Comuns

### "O sistema não pode encontrar o caminho especificado"
- Certifique-se de que está executando o `start.bat` na pasta correta
- Verifique se a pasta `loyalty-backend` existe

### "Ambiente virtual não encontrado"
- Execute a instalação inicial conforme descrito acima

### "Porta 5001 já está em uso"
- Feche outros programas que possam estar usando a porta 5001
- Ou altere a porta no arquivo `src/main.py`

## Suporte

Para problemas técnicos, verifique:
1. Se o Python está instalado (versão 3.7 ou superior)
2. Se todas as dependências foram instaladas
3. Se não há conflitos de porta

