import { MediaType } from "../models/MediaType";

export const ALL_MEDIA = [
  // Jogos
  { 
    id: 1, 
    title: "The Last of Us Part II", 
    rating: 4.9, 
    image: "/images/games/tlou2.jpg",
    type: MediaType.GAME,
    year: 2020,
    platforms: ["PlayStation 4", "PlayStation 5"],
    description: "The Last of Us Part II é uma aventura épica de ação e sobrevivência que se passa cinco anos após os eventos do primeiro jogo. Joel e Ellie estabelecem uma vida em Jackson, mas quando um evento violento interrompe a paz, Ellie embarca em uma jornada implacável para fazer justiça e encontrar uma solução.",
    streamingLinks: [
      {
        service: "PLAYSTATION",
        url: "https://store.playstation.com/pt-br/product/UP9000-CUSA07820_00-THELASTOFUSPART2"
      }
    ]
  },
  { 
    id: 2, 
    title: "Elden Ring", 
    rating: 4.7, 
    image: "/images/games/eldenring.jpg",
    type: MediaType.GAME,
    year: 2022,
    platforms: ["PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X/S", "PC"],
    description: "Elden Ring é um RPG de ação em mundo aberto desenvolvido pela FromSoftware. Situado nas Terras Intermédias, os jogadores exploram um vasto mundo cheio de mistérios, perigos e segredos enquanto buscam se tornar o Lorde Anelar.",
    streamingLinks: [
      {
        service: "STEAM",
        url: "https://store.steampowered.com/app/1245620/ELDEN_RING/"
      },
      {
        service: "PLAYSTATION",
        url: "https://store.playstation.com/pt-br/product/UP0006-PPSA01396_00-ELDENRING0000000"
      },
      {
        service: "XBOX",
        url: "https://www.xbox.com/pt-BR/games/store/elden-ring/9NJ4K7W7VH2P"
      }
    ]
  },
  { 
    id: 9, 
    title: "The Witcher 3: Wild Hunt", 
    rating: 4.95, 
    image: "/images/games/witcher3.jpg",
    type: MediaType.GAME,
    year: 2015,
    platforms: ["PlayStation 4", "Xbox One", "PC", "Nintendo Switch"],
    description: "The Witcher 3: Wild Hunt é um RPG de mundo aberto onde você controla Geralt de Rívia, um caçador de monstros em busca de sua filha adotiva. Com um mundo vasto, missões complexas e escolhas morais impactantes.",
    streamingLinks: [
      {
        service: "STEAM",
        url: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/"
      },
      {
        service: "PLAYSTATION",
        url: "https://store.playstation.com/pt-br/product/UP4497-CUSA05571_00-THEWITCHER30000"
      },
      {
        service: "GOG",
        url: "https://www.gog.com/game/the_witcher_3_wild_hunt"
      }
    ]
  },
  { 
    id: 10, 
    title: "God of War", 
    rating: 4.8, 
    image: "/images/games/godofwar.jpg",
    type: MediaType.GAME,
    year: 2018,
    platforms: ["PlayStation 4", "PC"],
    description: "God of War reconta a mitologia nórdica através de Kratos e seu filho Atreus. Uma jornada emocional sobre paternidade, redenção e sobrevivência em um mundo repleto de deuses e monstros.",
    streamingLinks: [
      {
        service: "PLAYSTATION",
        url: "https://store.playstation.com/pt-br/product/UP9000-CUSA07408_00-0000000GODOFWARN"
      },
      {
        service: "STEAM",
        url: "https://store.steampowered.com/app/1593500/God_of_War/"
      }
    ]
  },
  { 
    id: 11, 
    title: "Red Dead Redemption 2", 
    rating: 4.9, 
    image: "/images/games/reddead2.jpg",
    type: MediaType.GAME,
    year: 2018,
    platforms: ["PlayStation 4", "Xbox One", "PC", "Google Stadia"],
    description: "Red Dead Redemption 2 é um épico western que segue a gangue Van der Linde em sua luta pela sobrevivência no final da era do Velho Oeste. Uma história sobre lealdade, honra e o preço da liberdade.",
    streamingLinks: [
      {
        service: "STEAM",
        url: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/"
      },
      {
        service: "ROCKSTAR",
        url: "https://www.rockstargames.com/reddeadredemption2/"
      }
    ]
  },
  
  // Filmes
  { 
    id: 3, 
    title: "Inception", 
    rating: 4.8, 
    image: "/images/movies/inception.jpg",
    type: MediaType.MOVIE,
    year: 2010,
    director: "Christopher Nolan",
    duration: 148,
    description: "Inception é um thriller de ficção científica onde Dom Cobb é um ladrão especializado em roubar segredos do subconsciente durante o estado de sonho. Ele recebe a missão inversa: implantar uma ideia na mente de alguém.",
    streamingLinks: [
      {
        service: "NETFLIX",
        url: "https://www.netflix.com/title/70131314"
      },
      {
        service: "PRIMEVIDEO",
        url: "https://www.primevideo.com/detail/Inception/0KRU0P5K6XZ5Z1Z1Z1Z1Z1Z1Z1"
      }
    ]
  },
  { 
    id: 4, 
    title: "The Matrix", 
    rating: 4.7, 
    image: "/images/movies/matrix.jpg",
    type: MediaType.MOVIE,
    year: 1999,
    director: "Lana Wachowski, Lilly Wachowski",
    description: "The Matrix apresenta um futuro distópico onde a humanidade está presa em uma realidade simulada por máquinas. Neo descobre a verdade e se junta à rebelião contra as máquinas.",
    streamingLinks: [
      {
        service: "NETFLIX",
        url: "https://www.netflix.com/title/20557937"
      },
      {
        service: "MAX",
        url: "https://play.max.com/movie/the-matrix/7e47f6d6-7b4f-4b5f-9b9a-7b1b0b0b0b0b"
      }
    ]
  },
  { 
    id: 12, 
    title: "Pulp Fiction", 
    rating: 4.85, 
    image: "/images/movies/pulpfiction.jpg",
    type: MediaType.MOVIE,
    year: 1994,
    director: "Quentin Tarantino",
    duration: 154,
    description: "Pulp Fiction é um filme cult que entrelaça várias histórias de criminosos de Los Angeles. Com diálogos afiados e uma narrativa não linear, revolucionou o cinema independente.",
    streamingLinks: [
      {
        service: "PRIMEVIDEO",
        url: "https://www.primevideo.com/detail/Pulp-Fiction/0KRU0P5K6XZ5Z1Z1Z1Z1Z1Z1Z1"
      },
      {
        service: "APPLE",
        url: "https://tv.apple.com/movie/pulp-fiction/umc.cmc.6fz6f6z6f6z6f6z6f6z6f6z6"
      }
    ]
  },
  { 
    id: 13, 
    title: "The Dark Knight", 
    rating: 4.9, 
    image: "/images/movies/darkknight.jpg",
    type: MediaType.MOVIE,
    year: 2008,
    director: "Christopher Nolan",
    duration: 152,
    description: "The Dark Knight apresenta Batman em um conflito épico contra o Coringa, que busca mergulhar Gotham City no caos. Um estudo profundo sobre heroísmo, moralidade e sacrifício.",
    streamingLinks: [
      {
        service: "MAX",
        url: "https://play.max.com/movie/the-dark-knight/7e47f6d6-7b4f-4b5f-9b9a-7b1b0b0b0b0b"
      },
      {
        service: "PRIMEVIDEO",
        url: "https://www.primevideo.com/detail/The-Dark-Knight/0KRU0P5K6XZ5Z1Z1Z1Z1Z1Z1Z1"
      }
    ]
  },
  { 
    id: 14, 
    title: "Parasite", 
    rating: 4.75, 
    image: "/images/movies/parasite.jpg",
    type: MediaType.MOVIE,
    year: 2019,
    director: "Bong Joon-ho",
    duration: 132,
    description: "Parasite é uma sátira social sobre uma família pobre que infiltra-se na casa de uma família rica, desencadeando eventos inesperados. Um comentário afiado sobre desigualdade social.",
    streamingLinks: [
      {
        service: "NETFLIX",
        url: "https://www.netflix.com/title/81221938"
      },
      {
        service: "PRIMEVIDEO",
        url: "https://www.primevideo.com/detail/Parasite/0KRU0P5K6XZ5Z1Z1Z1Z1Z1Z1Z1"
      }
    ]
  },
  
  // Séries
  { 
    id: 5, 
    title: "Stranger Things", 
    rating: 4.6, 
    image: "/images/series/strangerthings.jpg",
    type: MediaType.SERIES,
    year: 2016,
    seasons: 4,
    description: "Stranger Things segue um grupo de crianças em Hawkins que enfrentam fenômenos sobrenaturais e experimentos secretos do governo. Uma homenagem aos filmes de ficção científica dos anos 80.",
    streamingLinks: [
      {
        service: "NETFLIX",
        url: "https://www.netflix.com/title/80057281"
      }
    ]
  },
  { 
    id: 15, 
    title: "Breaking Bad", 
    rating: 4.95, 
    image: "/images/series/breakingbad.jpg",
    type: MediaType.SERIES,
    year: 2008,
    seasons: 5,
    description: "Breaking Bad acompanha Walter White, um professor de química que se torna um produtor de metanfetamina após ser diagnosticado com câncer. Uma transformação de homem comum a chefão do crime.",
    streamingLinks: [
      {
        service: "NETFLIX",
        url: "https://www.netflix.com/title/70143836"
      }
    ]
  },
  { 
    id: 16, 
    title: "Game of Thrones", 
    rating: 4.5, 
    image: "/images/series/gameofthrones.jpg",
    type: MediaType.SERIES,
    year: 2011,
    seasons: 8,
    description: "Game of Thrones é um épico de fantasia que segue as famílias nobres em sua luta pelo Trono de Ferro de Westeros. Intrigas políticas, batalhas épicas e dragões em um mundo complexo.",
    streamingLinks: [
      {
        service: "MAX",
        url: "https://play.max.com/series/game-of-thrones/7e47f6d6-7b4f-4b5f-9b9a-7b1b0b0b0b0b"
      }
    ]
  },
  { 
    id: 17, 
    title: "The Mandalorian", 
    rating: 4.7, 
    image: "/images/series/mandalorian.jpg",
    type: MediaType.SERIES,
    year: 2019,
    seasons: 3,
    description: "The Mandalorian segue um caçador de recompensas solitário no período pós-Império em uma galáxia distante. Sua missão de proteger a Criança (Grogu) torna-se uma jornada inesperada.",
    streamingLinks: [
      {
        service: "DISNEY",
        url: "https://www.disneyplus.com/series/the-mandalorian/3jLIGMDYINqD"
      }
    ]
  },
  { 
    id: 18, 
    title: "The Office", 
    rating: 4.8, 
    image: "/images/series/theoffice.jpg",
    type: MediaType.SERIES,
    year: 2005,
    seasons: 9,
    description: "The Office é uma comédia mockumentary que retrata o cotidiano dos funcionários do escritório da Dunder Mifflin. Humor ácido e personagens memoráveis em situações absurdas.",
    streamingLinks: [
      {
        service: "PRIMEVIDEO",
        url: "https://www.primevideo.com/detail/The-Office/0KRU0P5K6XZ5Z1Z1Z1Z1Z1Z1Z1"
      },
      {
        service: "NETFLIX",
        url: "https://www.netflix.com/title/70136120"
      }
    ]
  },
  
  // Livros
  { 
    id: 6, 
    title: "O Senhor dos Anéis", 
    rating: 4.9, 
    image: "/images/books/lotr.jpg",
    type: MediaType.BOOK,
    year: 1954,
    author: "J.R.R. Tolkien",
    pages: 1178,
    description: "O Senhor dos Anéis é uma épica trilogia de fantasia que segue a jornada do humilde hobbit Frodo Bolseiro para destruir o Um Anel e salvar a Terra Média das trevas de Sauron.",
    streamingLinks: [
      {
        service: "AMAZON",
        url: "https://www.amazon.com.br/Senhor-dos-Anéis-J-R-R-Tolkien/dp/8595086352"
      },
      {
        service: "AMAZON_KINDLE",
        url: "https://www.amazon.com.br/Senhor-dos-Anéis-J-R-R-Tolkien-ebook/dp/B07D2C9K7H"
      }
    ]
  },
  { 
    id: 7, 
    title: "1984", 
    rating: 4.7, 
    image: "/images/books/1984.jpg",
    type: MediaType.BOOK,
    year: 1949,
    author: "George Orwell",
    pages: 328,
    description: "1984 é um romance distópico sobre um regime totalitário que controla todos os aspectos da vida através de vigilância constante e manipulação da verdade. Um alerta atemporal.",
    streamingLinks: [
      {
        service: "AMAZON",
        url: "https://www.amazon.com.br/1984-George-Orwell/dp/8535914846"
      },
      {
        service: "AMAZON_KINDLE",
        url: "https://www.amazon.com.br/1984-George-Orwell-ebook/dp/B07D2C9K7H"
      }
    ]
  },
  { 
    id: 8, 
    title: "Harry Potter e a Pedra Filosofal", 
    rating: 4.8, 
    image: "/images/books/harrypotter.jpg",
    type: MediaType.BOOK,
    year: 1997,
    author: "J.K. Rowling",
    pages: 223,
    description: "Harry Potter e a Pedra Filosofal introduz o mundo mágico onde Harry descobre ser um bruxo e embarca em sua jornada em Hogwarts. Amizade, coragem e a luta contra o mal.",
    streamingLinks: [
      {
        service: "AMAZON",
        url: "https://www.amazon.com.br/Harry-Potter-Pedra-Filosofal-Rowling/dp/8532530788"
      },
      {
        service: "AMAZON_KINDLE",
        url: "https://www.amazon.com.br/Harry-Potter-Pedra-Filosofal-J-K-Rowling-ebook/dp/B0192CTMYG"
      }
    ]
  },
  { 
    id: 20, 
    title: "Cem Anos de Solidão", 
    rating: 4.85, 
    image: "/images/books/cemanos.jpg",
    type: MediaType.BOOK,
    year: 1967,
    author: "Gabriel García Márquez",
    pages: 417,
    description: "Cem Anos de Solidão conta a saga da família Buendía na mítica Macondo. Realismo mágico que explora amor, solidão, guerra e o ciclo inevitável da história.",
    streamingLinks: [
      {
        service: "AMAZON",
        url: "https://www.amazon.com.br/Cem-Anos-Solidão-Gabriel-García/dp/8501016070"
      },
      {
        service: "AMAZON_KINDLE",
        url: "https://www.amazon.com.br/Cem-Anos-Solidão-Gabriel-García-Márquez-ebook/dp/B00A3D3L2W"
      }
    ]
  },
  { 
    id: 21, 
    title: "O Pequeno Príncipe", 
    rating: 4.9, 
    image: "/images/books/pequenoprincipe.jpg",
    type: MediaType.BOOK,
    year: 1943,
    author: "Antoine de Saint-Exupéry",
    pages: 96,
    description: "O Pequeno Príncipe é uma fábula poética sobre um principezinho que viaja por planetas aprendendo sobre amor, amizade e a essência da vida. Lições atemporais para todas as idades.",
    streamingLinks: [
      {
        service: "AMAZON",
        url: "https://www.amazon.com.br/pequeno-príncipe-Antoine-Saint-Exupéry/dp/8595081512"
      },
      {
        service: "AMAZON_KINDLE",
        url: "https://www.amazon.com.br/pequeno-príncipe-Antoine-Saint-Exupéry-ebook/dp/B00A3D3L2W"
      }
    ]
  },
  
  // Músicas
    { 
    id: 22, 
    title: "Thriller", 
    rating: 4.95, 
    image: "/images/music/thriller.jpg",
    type: MediaType.MUSIC,
    year: 1982,
    artists: "Michael Jackson",
    description: "Thriller é o álbum mais vendido de todos os tempos, revolucionando a música pop com hits como 'Beat It', 'Billie Jean' e a icônica faixa-título. Michael Jackson no auge de sua criatividade.",
    streamingLinks: [
      {
        service: "SPOTIFY",
        url: "https://open.spotify.com/album/2ANVost0y2y52ema1E9xAZ"
      },
      {
        service: "APPLE_MUSIC",
        url: "https://music.apple.com/br/album/thriller/159292355"
      },
      {
        service: "DEEZER",
        url: "https://www.deezer.com/br/album/1003831"
      }
    ]
  },
  { 
    id: 23, 
    title: "The Dark Side of the Moon", 
    rating: 4.9, 
    image: "/images/music/darkside.jpg",
    type: MediaType.MUSIC,
    year: 1973,
    artists: "Pink Floyd",
    description: "The Dark Side of the Moon é um marco do rock progressivo, explorando temas como tempo, dinheiro, loucura e morte. Uma jornada sonora que permanece relevante décadas depois.",
    streamingLinks: [
      {
        service: "SPOTIFY",
        url: "https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv"
      },
      {
        service: "APPLE_MUSIC",
        url: "https://music.apple.com/br/album/the-dark-side-of-the-moon/1065977164"
      },
      {
        service: "YOUTUBE_MUSIC",
        url: "https://music.youtube.com/playlist?list=OLAK5uy_nClQlQoYv5vq-6esP_6N9uLN2h2JtYgYw"
      }
    ]
  }
];