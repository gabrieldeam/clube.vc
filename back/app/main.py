from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth
from app.database import Base, engine
import os
from dotenv import load_dotenv
from app.tasks.scheduler import start_scheduler

# Carregar variáveis do .env
load_dotenv()

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuração do CORS
origins = [
    os.getenv("FRONTEND_URL"),  # Carrega o domínio do frontend do .env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Inicia o agendador
start_scheduler()

@app.on_event("shutdown")
async def shutdown_event():
    """Para o agendador ao desligar o servidor."""
    from app.tasks.scheduler import scheduler
    scheduler.shutdown()