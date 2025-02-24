import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"
engine = create_engine(DATABASE_URL)

# Definição da Base para os modelos
Base = declarative_base()

# Criação da sessão local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Função para injetar a sessão nos endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
