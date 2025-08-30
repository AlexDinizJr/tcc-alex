export const savedItems = [
    { id: 1, title: "Interestelar", type: "Filme", image: "/placeholder-movie.jpg" },
    { id: 2, title: "The Last of Us", type: "Game", image: "/placeholder-game.jpg" },
    { id: 3, title: "Stranger Things", type: "Série", image: "/placeholder-tv.jpg" },
    { id: 4, title: "Album Random Access Memories", type: "Música", image: "/placeholder-music.jpg" },
];

export const userReviews = [
    { id: 1, title: "Interestelar", rating: 5, comment: "Obra prima do Nolan!", date: "15/08/2023" },
    { id: 2, title: "The Last of Us", rating: 4, comment: "Jogo incrível, narrativa excelente", date: "10/07/2023" },
    { id: 3, title: "Album Random Access Memories", rating: 5, comment: "Disco atemporal", date: "05/06/2023" },
];

export const userLists = [
    { 
      id: 1, 
      title: "Melhores Filmes de Ficção Científica", 
      description: "Uma coleção dos melhores filmes de ficção científica de todos os tempos", 
      itemCount: 12, 
      isPublic: true, 
      createdAt: "12/09/2023" 
    },
    { 
      id: 2, 
      title: "Séries para Maratonar", 
      description: "Minhas séries favoritas para assistir nos finais de semana", 
      itemCount: 8, 
      isPublic: true, 
      createdAt: "05/08/2023" 
    },
    { 
      id: 3, 
      title: "Lista Privada de Games", 
      description: "Games que ainda preciso jogar", 
      itemCount: 5, 
      isPublic: false, 
      createdAt: "22/07/2023" 
    },
];

export const userStats = {
    savedItems: 12,
    reviews: 7,
    lists: 3,
    activeDays: 28
};