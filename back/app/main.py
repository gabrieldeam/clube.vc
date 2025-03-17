from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import auth, club, category, club_style, subscription_plan, club_subscription, blog, chat, shop
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

# Monta a pasta estática para acesso aos uploads
app.mount("/static", StaticFiles(directory="static"), name="static")

# Rotas
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(club.router, prefix="/clubs", tags=["Clubs"])
app.include_router(category.router, prefix="/categories", tags=["Categories"])
app.include_router(club_style.router, prefix="/club-styles", tags=["ClubStyles"])
app.include_router(subscription_plan.router, prefix="/subscription_plans", tags=["SubscriptionPlans"])
app.include_router(club_subscription.router, prefix="/club_subscriptions", tags=["ClubSubscriptions"])
app.include_router(blog.router, prefix="/blog", tags=["Blog"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(shop.router, prefix="/shop", tags=["Shop"])

# Inicia o agendador
start_scheduler()

@app.on_event("shutdown")
async def shutdown_event():
    """Para o agendador ao desligar o servidor."""
    from app.tasks.scheduler import scheduler
    scheduler.shutdown()

@app.get("/")
async def read_root():
    return {"message": "Bem-vindo à API!"}
