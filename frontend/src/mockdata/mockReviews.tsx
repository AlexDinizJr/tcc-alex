import { Review } from "../models/ReviewModel";

export const MOCK_REVIEWS: { [key: number]: Review[] } = {
  1: [
    { 
      id: 1, 
      user: "João Silva", 
      userId: 1,
      rating: 5, 
      comment: "Jogo incrível! História emocionante e gráficos de tirar o fôlego. A evolução da Ellie é fascinante.", 
      date: "2024-01-15",
      helpful: 10
    },
    { 
      id: 2, 
      user: "Maria Santos", 
      rating: 4,
      userId: 2, 
      comment: "Muito bom, mas um pouco longo demais para meu gosto. A gameplay é excelente, porém a história poderia ser mais concisa.", 
      date: "2024-01-10",
      helpful: 12
    }
  ],
  2: [
    { 
      id: 1, 
      user: "Carlos Oliveira", 
      rating: 5,
      userId: 3, 
      comment: "Obra prima! From Software superou todas as expectativas. Mundo aberto vasto e cheio de segredos para descobrir.", 
      date: "2024-01-18",
      helpful: 25
    },
    { 
      id: 2, 
      user: "Ana Costa", 
      rating: 4,
      userId: 4, 
      comment: "Desafiador e recompensador. A liberdade de exploração é incrível, mas a dificuldade pode assustar iniciantes.", 
      date: "2024-01-20",
      helpful: 8
    }
  ],
  3: [
    { 
      id: 1, 
      user: "Pedro Almeida", 
      rating: 5,
      userId: 5, 
      comment: "Christopher Nolan é um gênio! Filme que te faz pensar sobre realidade e sonhos. Final masterpiece!", 
      date: "2024-01-12",
      helpful: 45
    },
    { 
      id: 2, 
      user: "Julia Rodrigues", 
      rating: 4,
      userId: 6, 
      comment: "Complexo e visualmente deslumbrante. Requer múltiplas assistidas para capturar todos os detalhes.", 
      date: "2024-01-08",
      helpful: 15
    }
  ],
  6: [
    { 
      id: 1, 
      user: "Rafael Lima", 
      rating: 5,
      userId: 7, 
      comment: "Obra fundamental da fantasia. Tolkien criou um mundo tão rico que parece real. Leitura obrigatória!", 
      date: "2024-01-22",
      helpful: 30
    }
  ],
};