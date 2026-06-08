from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

# IMPORTA O QUE VOCÊ CRIOU NO MODEL
from app.model.database import get_db_connection, buscar_praga_no_banco

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (seu middleware CORS continua igual) ...

class AnaliseRequest(BaseModel):
    setor: str
    praga_nome: str
    confianca: float
    status: str

@app.post("/salvar-analise")
def salvar_analise(dados: AnaliseRequest):
    try:
        conn = get_db_connection() # Agora chamando do seu database.py
        cursor = conn.cursor()
        comando = "INSERT INTO historico (data_hora, setor, praga_nome, confianca, status) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(comando, (datetime.now(), dados.setor, dados.praga_nome, dados.confianca, dados.status))
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "sucesso"}
    except Exception as e:
        return {"status": "erro", "mensagem": str(e)}

@app.get("/ultima-analise")
def buscar_ultima_analise():
    # Aqui o Controller apenas delega a tarefa para o Model!
    praga = buscar_praga_no_banco()
    return {"praga": praga}