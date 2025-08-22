from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# modelo para entrada
class UserRequest(BaseModel):
    user_id: int

# rota raiz
@app.get("/")
def root():
    return {"message": "API de Recomendação funcionando 🎯"}

# exemplo de rota de recomendação
@app.post("/recommend")
def recommend(req: UserRequest):
    # MOCK: sempre retorna mesmas recomendações
    return {
        "user": req.user_id,
        "recommendations": ["Filme A", "Jogo B", "Música C"]
    }