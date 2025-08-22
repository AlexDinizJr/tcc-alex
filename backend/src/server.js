import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// rota teste
app.get("/", (req, res) => {
  res.json({ message: "API Node funcionando 🚀" });
});

// exemplo rota usuário
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  res.json({ msg: `Usuário ${email} cadastrado (mock)` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
