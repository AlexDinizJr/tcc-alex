# MediaHub

MediaHub é uma plataforma web para gerenciamento e recomendação de mídias, incluindo **games, filmes, músicas, séries e livros**. Permite que usuários criem avaliações, listas e salvem suas mídias favoritas. Através destas interações, o sistema é capaz de oferecer recomendações personalizadas.

---

## Tecnologias

- **Backend:** Node.js, Express, PostgreSQL, Prisma, Nodemailer, Cloudinary  
- **Frontend:** React, Tailwind CSS  
- **Infraestrutura e Versionamento:** Docker e GitHub

---

## Funcionalidades Principais

- Sistema de **recomendações de mídias**  
- Cadastro e login de usuários  
- Avaliações, listas e mídias favoritas  
- Suporte a múltiplos ecossistemas: games, filmes, músicas, séries e livros  

---

## Instalação

```bash
# Clonar o repositório
git clone <repo-url>
cd tcc-alex

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Voltar para a raiz e rodar Docker
cd ..
docker compose up

# Configure as variáveis de ambiente no .env