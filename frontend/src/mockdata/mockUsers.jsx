import { MOCK_REVIEWS } from "./mockReviews";
import { MOCK_LISTS } from "./mockLists";

export const mockUsers = [
  { 
    id: 1, 
    email: 'usuario@email.com', 
    password: '123456', 
    name: 'João Silva',
    username: 'joaosilva123',
    bio: 'Apaixonado por filmes e séries.',
    createdAt: "2024-06-15T10:30:00Z",
    avatar: '',
    savedMedia: [1, 2, 3, 4, 5, 6],
    favorites: [1, 3, 5],
    reviews: MOCK_REVIEWS.filter(review => review.userId === 1),
    lists: MOCK_LISTS.filter(review => review.userId === 1),
    privacy: {
    profileVisibility: "public",
    showSavedItems: true,
    showFavorites: true,
    showReviews: true,
    showStats: true,
    dataCollection: true,
  },
  },
  { 
    id: 2, 
    email: 'teste@email.com', 
    password: 'senha123', 
    name: 'Maria Santos',
    username: 'mariassantos123',
    bio: 'Amante de música e games.',
    createdAt: "2022-03-15T10:30:00Z",
    avatar: '',
    savedMedia: [7, 8, 9, 10, 11, 12],
    favorites: [11, 18, 8],
    reviews: MOCK_REVIEWS.filter(review => review.userId === 2),
    lists: MOCK_LISTS.filter(review => review.userId === 2),
    profileVisibility: "private",
    showSavedItems: false,
    showFavorites: false,
    showReviews: false,
    showStats: false,
    dataCollection: false,
  }
];