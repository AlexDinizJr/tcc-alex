import { MediaType, MediaGenre, ClassificationRating } from '@prisma/client';

export const ALL_MEDIA = [
  // Jogos
  { 
    id: 1, 
    title: "The Last of Us Part II", 
    rating: 4.9, 
    image: "https://preview.redd.it/do-you-prefer-the-new-symmetrical-covers-or-the-originals-v0-x7zz0r8n9edd1.jpg?width=640&crop=smart&auto=webp&s=0d50b311426345fdd80f80bb42a1618aa7f67379",
    type: MediaType.GAME,
    year: 2020,
    platforms: ["PlayStation 4", "PlayStation 5"],
    genres: [MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.SURVIVAL, MediaGenre.HORROR],
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
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    type: MediaType.GAME,
    year: 2022,
    platforms: ["PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X/S", "PC"],
    genres: [MediaGenre.RPG, MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.FANTASY, MediaGenre.OPEN_WORLD],
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
    image: "https://steamcdn-a.akamaihd.net/steam/apps/292030/library_600x900_2x.jpg",
    type: MediaType.GAME,
    year: 2015,
    platforms: ["PlayStation 4", "Xbox One", "PC", "Nintendo Switch"],
    genres: [MediaGenre.RPG, MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.FANTASY, MediaGenre.OPEN_WORLD],
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
    image: "https://upload.wikimedia.org/wikipedia/pt/8/82/God_of_War_2018_capa.png",
    type: MediaType.GAME,
    year: 2018,
    platforms: ["PlayStation 4", "PC"],
    genres: [MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.FANTASY, MediaGenre.RPG],
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
    image: "https://theflucobeat.com/wp-content/uploads/2018/12/Red_Dead_Redemption_2_Cover_Art-729x900.jpg",
    type: MediaType.GAME,
    year: 2018,
    platforms: ["PlayStation 4", "Xbox One", "PC", "Google Stadia"],
    genres: [MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.WESTERN, MediaGenre.OPEN_WORLD],
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
    image: "https://images.squarespace-cdn.com/content/v1/5ec686197f8b2976074846c2/1618809593080-N5PB8CWYOW3OPDE2TT6E/Feature+3-1.png",
    type: MediaType.MOVIE,
    year: 2010,
    directors: ["Christopher Nolan"],
    duration: 148,
    genres: [MediaGenre.SCI_FI, MediaGenre.ACTION, MediaGenre.THRILLER],
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
    image: "https://www.baltana.com/files/wallpapers-32/The-Matrix-Resurrections-Desktop-HD-Wallpaper-125877.jpg",
    type: MediaType.MOVIE,
    year: 1999,
    directors: ["Lana Wachowski", "Lilly Wachowski"],
    classification: ClassificationRating.FOURTEEN,
    genres: [MediaGenre.SCI_FI, MediaGenre.ACTION, MediaGenre.THRILLER],
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
    image: "https://cdn-images.dzcdn.net/images/cover/f3d66e855e15ac75c9e3a085aa6697b6/0x1900-000000-80-0-0.jpg",
    type: MediaType.MOVIE,
    year: 1994,
    directors: ["Quentin Tarantino"],
    duration: 154,
    genres: [MediaGenre.CRIME, MediaGenre.DRAMA, MediaGenre.THRILLER],
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
    image: "https://play-lh.googleusercontent.com/qhfncXOqccJ5Y_IBPaRy0O79QZQDl7L5FyKQAsLFICt8c9-2Vfmqd2bniAPESto0ZmSLTOzjl-o1F_jgb2Nr",
    type: MediaType.MOVIE,
    year: 2008,
    directors: ["Christopher Nolan"],
    duration: 152,
    genres: [MediaGenre.ACTION, MediaGenre.CRIME, MediaGenre.DRAMA, MediaGenre.SUPERHERO],
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
    image: "https://www.ubuy.com.br/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvOTFLQXJZUDAzWUwuX0FDX1NMMTUwMF8uanBn.jpg",
    type: MediaType.MOVIE,
    year: 2019,
    directors: ["Bong Joon-ho"],
    duration: 132,
    genres: [MediaGenre.DRAMA, MediaGenre.THRILLER, MediaGenre.COMEDY],
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
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/b4f85340664543.5787e03bf1133.jpg",
    type: MediaType.SERIES,
    year: 2016,
    seasons: 4,
    genres: [MediaGenre.SCI_FI, MediaGenre.HORROR, MediaGenre.ADVENTURE, MediaGenre.MYSTERY],
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
    image: "https://www.coverwhiz.com/uploads/tv/breaking-bad-season-4.jpg",
    type: MediaType.SERIES,
    year: 2008,
    seasons: 5,
    genres: [MediaGenre.DRAMA, MediaGenre.CRIME, MediaGenre.THRILLER],
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
    image: "https://i1.sndcdn.com/artworks-W8KXhQeXZrv2YSJO-ctOyHA-t500x500.jpg",
    type: MediaType.SERIES,
    year: 2011,
    seasons: 8,
    genres: [MediaGenre.FANTASY, MediaGenre.DRAMA, MediaGenre.ACTION, MediaGenre.HISTORICAL],
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
    image: "https://i.pinimg.com/736x/c2/86/2e/c2862e9a2757aabd959d181224ce9339.jpg",
    type: MediaType.SERIES,
    year: 2019,
    seasons: 3,
    genres: [MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.SCI_FI, MediaGenre.SPACE],
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
    image: "https://i.ebayimg.com/thumbs/images/g/oDgAAOSwu09nvTMQ/s-l1200.jpg",
    type: MediaType.SERIES,
    year: 2005,
    seasons: 9,
    genres: [MediaGenre.COMEDY, MediaGenre.MOCKUMENTARY, MediaGenre.SITCOM],
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
    image: "https://m.media-amazon.com/images/I/71ZLavBjpRL._UF1000,1000_QL80_.jpg",
    type: MediaType.BOOK,
    year: 1954,
    authors: ["J.R.R. Tolkien"],
    pages: 1178,
    genres: [MediaGenre.FANTASY, MediaGenre.ADVENTURE, MediaGenre.EPIC],
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
    image: "https://m.media-amazon.com/images/I/61HkdyBpKOL.jpg",
    type: MediaType.BOOK,
    year: 1949,
    authors: ["George Orwell"],
    pages: 328,
    genres: [MediaGenre.DYSTOPIAN, MediaGenre.SCI_FI, MediaGenre.POLITICAL, MediaGenre.DRAMA],
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
    image: "https://m.media-amazon.com/images/I/81q77Q39nEL.jpg",
    type: MediaType.BOOK,
    year: 1997,
    authors: ["J.K. Rowling"],
    pages: 223,
    genres: [MediaGenre.FANTASY, MediaGenre.ADVENTURE, MediaGenre.YOUNG_ADULT],
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
    image: "https://m.media-amazon.com/images/I/819vfB2BjyL._UF1000,1000_QL80_.jpg",
    type: MediaType.BOOK,
    year: 1967,
    authors: ["Gabriel García Márquez"],
    pages: 417,
    genres: [MediaGenre.MAGICAL_REALISM, MediaGenre.DRAMA, MediaGenre.HISTORICAL_FICTION],
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
    image: "https://m.media-amazon.com/images/I/51nNwwVSclL._UF1000,1000_QL80_.jpg",
    type: MediaType.BOOK,
    year: 1943,
    authors: ["Antoine de Saint-Exupéry"],
    pages: 96,
    genres: [MediaGenre.CHILDREN, MediaGenre.FANTASY, MediaGenre.PHILOSOPHICAL],
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
    image: "https://e.snmc.io/i/1200/s/d368744216afb5a3b28eb219994f85be/11486295",
    type: MediaType.MUSIC,
    year: 1982,
    artists: ["Michael Jackson"],
    genres: [MediaGenre.POP, MediaGenre.RNB, MediaGenre.DANCE],
    description: "Thriller é o álbum mais vendido de todos os tempos, revolucionando a música pop com hits como 'Beat It', 'Billie Jean' e a icônica faixa-título. Michael Jackson no auge de sua criatividade.",
    streamingLinks: [
      {
        service: "SPOTIFY",
        url: "https://open.spotify.com/album/2ANVost0y2y52ema1E9xAZ"
      },
      {
        service: "APPLE_MUSIC",
        url: "https://music.apple.com/br/album/thriller/159292355"
      }
    ]
  },
  { 
    id: 23, 
    title: "Back in Black", 
    rating: 4.85, 
    image: "https://f4.bcbits.com/img/a2908223105_16.jpg",
    type: MediaType.MUSIC,
    year: 1980,
    artists: ["AC/DC"],
    genres: [MediaGenre.ROCK, MediaGenre.HARD_ROCK],
    description: "Back in Black é o sétimo álbum de estúdio do AC/DC e um dos mais vendidos mundialmente. Homenageia o falecido Bon Scott e apresenta clássicos do rock.",
    streamingLinks: [
      {
        service: "SPOTIFY",
        url: "https://open.spotify.com/album/6mUdeDZCsExyJLMdAfDuwh"
      },
      {
        service: "APPLE_MUSIC",
        url: "https://music.apple.com/br/album/back-in-black/574376"
      }
    ]
  },
  { 
    id: 24, 
    title: "Abbey Road", 
    rating: 4.9, 
    image: "https://www.udiscovermusic.com/wp-content/uploads/2020/08/Abbey-Road.jpg",
    type: MediaType.MUSIC,
    year: 1969,
    artists: ["The Beatles"],
    genres: [MediaGenre.ROCK, MediaGenre.HARD_ROCK],
    description: "Abbey Road é o décimo primeiro álbum de estúdio dos Beatles, famoso pelo icônico cover na faixa de pedestres e por clássicos como 'Come Together' e 'Here Comes the Sun'.",
    streamingLinks: [
      {
        service: "SPOTIFY",
        url: "https://open.spotify.com/album/0ETFjACtuP2ADo6LFhL6HN"
      },
      {
        service: "APPLE_MUSIC",
        url: "https://music.apple.com/br/album/abbey-road/1441164426"
      }
    ]
  },
  { 
    id: 25, 
    title: "Hotel California", 
    rating: 4.8, 
    image: "https://pure-music.co.uk/wp-content/uploads/2019/04/Hotel-California-Album-Cover.png",
    type: MediaType.MUSIC,
    year: 1976,
    artists: ["Eagles"],
    genres: [MediaGenre.ROCK, MediaGenre.POP, MediaGenre.CLASSIC_ROCK],
    description: "Hotel California é o quinto álbum de estúdio dos Eagles, incluindo a famosa faixa-título. Uma obra-prima do rock clássico com letras enigmáticas e solos memoráveis.",
    streamingLinks: [
      {
        service: "SPOTIFY",
        url: "https://open.spotify.com/album/4T2J7cJ0yN18dUDKlpq5A3"
      },
      {
        service: "APPLE_MUSIC",
        url: "https://music.apple.com/br/album/hotel-california/574376"
      }
    ]
  },
  {
    id: 27,
    title: "Meteora",
    rating: 4.6,
    image: "https://cdn-images.dzcdn.net/images/cover/882448ab63952aa16e502c82db2df160/500x500.jpg",
    type: MediaType.MUSIC,
    year: 2003,
    artists: ["Linkin Park"],
    genres: [MediaGenre.ROCK, MediaGenre.ALTERNATIVE],
    description: "Meteora é o segundo álbum de estúdio da banda Linkin Park, lançado em 2003. Consolidou o sucesso do grupo com hits como 'Numb' e 'Breaking the Habit', mantendo a sonoridade intensa e melódica do nu metal.",
    streamingLinks: [
      {
        service: "SPOTIFY",
        url: "https://open.spotify.com/album/4Gfnly5CzMJQqkUFfoHaP3"
      },
      {
        service: "APPLE_MUSIC",
        url: "https://music.apple.com/br/album/meteora/693998379"
      }
    ]
  }
];
