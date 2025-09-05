import { UserList } from "../models/ListModel";
import { ALL_MEDIA } from "./mockMedia";
import { MediaType } from "../models/MediaType";

// Filtrar algumas mídias para usar nas listas
const scifiMovies = ALL_MEDIA.filter(item => 
  item.type === MediaType.MOVIE && (item.title.includes("Matrix") || item.title.includes("Inception"))
);

const seriesToBinge = ALL_MEDIA.filter(item => 
  item.type === MediaType.SERIES && (item.title.includes("Stranger") || item.title.includes("Breaking"))
);

const gamesToPlay = ALL_MEDIA.filter(item => 
  item.type === MediaType.GAME && (item.title.includes("Last") || item.title.includes("Elden"))
);

export const MOCK_LISTS: UserList[] = [
  { 
    id: 1, 
    userId: 1,
    name: "Melhores Filmes de Ficção Científica", 
    items: scifiMovies,
    isPublic: true, 
    createdAt: "2023-09-12T10:30:00Z",
    description: "Uma coleção dos melhores filmes de ficção científica de todos os tempos"
  },
  { 
    id: 2, 
    userId: 2,
    name: "Séries para Maratonar", 
    items: seriesToBinge,
    isPublic: true, 
    createdAt: "2023-08-05T14:22:00Z",
    description: "Minhas séries favoritas para assistir nos finais de semana"
  },
  { 
    id: 3, 
    userId: 2,
    name: "Lista Privada de Games", 
    items: gamesToPlay,
    isPublic: false, 
    createdAt: "2023-07-22T08:45:00Z",
    description: "Games que ainda preciso jogar"
  },
];