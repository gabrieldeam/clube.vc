# Escolhe uma imagem base com Python
FROM python:3.9

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo de dependências para o container
COPY requirements.txt .

# Instala as dependências
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copia o restante do código para o container
COPY . .

# Expõe a porta que o Uvicorn utilizará
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
