from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.revoked_token import RevokedToken

def delete_expired_tokens():
    """Remove tokens expirados do banco de dados."""
    with SessionLocal() as db:  # Abre sessão no banco de dados
        now = datetime.utcnow()
        expired_tokens = db.query(RevokedToken).filter(RevokedToken.expires_at < now).all()
        for token in expired_tokens:
            db.delete(token)
        db.commit()

# Configuração do agendador
scheduler = BackgroundScheduler()
scheduler.add_job(delete_expired_tokens, "interval", minutes=30)  # Executa a cada 30 minutos

def start_scheduler():
    """Inicializa o agendador."""
    scheduler.start()
