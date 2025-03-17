# Clube.vc Project

## Descrição
Sysane é um projeto de API RESTful com frontend em Next.js e backend em FastAPI, integrado ao PostgreSQL.

## Estrutura
- **back/**: Backend em FastAPI.
- **front/**: Frontend em Next.js.

## Instalação

### Backend
1. Ative o ambiente virtual:
   ```bash
   cd back
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows

2. Instale as dependências:   
   pip install -r requirements.txt

   2.1. Atualizar as dependências:   
      pip freeze > requirements.txt


3. Configure o banco no arquivo .env.

4. Execute:
   uvicorn app.main:app --reload



### Frontend
1. Instale as dependências:
   ```bash
   cd client
   npm install

2. Execute:
   npm run dev
