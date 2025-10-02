import { 
  FaSpotify, 
  FaAmazon,
  FaMicrosoft,
  FaPlaystation,
  FaXbox, 
  FaDeezer,
  FaBattleNet,
  FaApple
} from 'react-icons/fa';

import { 
  SiNetflix,
  SiPrimevideo,  
  SiSteam, 
  SiNintendoswitch,
  SiYoutubemusic,
  SiHbo,
  SiApplemusic,
  SiCrunchyroll,
  SiAppletv,
  SiRockstargames,
  SiUbisoft,
  SiEa,
  SiGogdotcom,
  SiParamountplus,
  SiEpicgames
} from 'react-icons/si';
import { TbBrandDisney } from "react-icons/tb";
import { FcKindle } from "react-icons/fc";
import { IoLogoGooglePlaystore } from 'react-icons/io5';
import CIcon from '@coreui/icons-react';
import { cibHulu } from '@coreui/icons';

export const SERVICES = {
  NETFLIX: {
    name: "Netflix",
    icon: <SiNetflix className="w-5 h-5" />,
    color: "bg-[#E50914] hover:bg-[#B80710] text-white", // Vermelho oficial Netflix
    baseUrl: "https://www.netflix.com/title/"
  },
  PRIMEVIDEO: {
    name: "Prime Video",
    icon: <SiPrimevideo className="w-5 h-5" />,
    color: "bg-[#00A8E1] hover:bg-[#0092C5] text-white", // Azul oficial Prime Video
    baseUrl: "https://www.primevideo.com/detail/"
  },
  DISNEY: {
    name: "Disney+",
    icon: <TbBrandDisney className="w-5 h-5" />,
    color: "bg-[#0063E5] hover:bg-[#0052C5] text-white", // Azul oficial Disney+
    baseUrl: "https://www.disneyplus.com/title/"
  },
  MAX: {
    name: "Max",
    icon: <SiHbo className="w-5 h-5" />,
    color: "bg-[#0D1117] hover:bg-[#000000] text-white", // Preto/azul muito escuro da Max
    baseUrl: "https://play.max.com/title/"
  },
  PARAMOUNT: {
    name: "Paramount+",
    icon: <SiParamountplus className="w-5 h-5" />,
    color: "bg-[#0066CC] hover:bg-[#0055AA] text-white", // Azul Paramount+
    baseUrl: "https://www.paramountplus.com/"
  },
  CRUNCHYROLL: {
    name: "Crunchyroll",
    icon: <SiCrunchyroll className="w-5 h-5" />,
    color: "bg-[#F47521] hover:bg-[#D4631A] text-white", // Laranja oficial Crunchyroll
    baseUrl: "https://beta.crunchyroll.com/"
  },
  APPLE_TV: {
    name: "Apple TV+",
    icon: <SiAppletv className="w-5 h-5" />,
    color: "bg-[#000000] hover:bg-[#1A1A1A] text-white", // Preto Apple
    baseUrl: "https://tv.apple.com/"
  },
  HULU: {
    name: "Hulu",
    icon: <CIcon icon={cibHulu} className="w-5 h-5" />,
    color: "bg-[#1CE783] hover:bg-[#17B869] text-black", // Verde oficial Hulu com texto preto
    baseUrl: "https://www.hulu.com/watch/"
  },
  PEACOCK: {
    name: "Peacock TV",
    icon: <span className="font-bold text-lg">🦚</span>,
    color: "bg-[#000000] hover:bg-[#1A1A1A] text-[#FFD700]", // Fundo preto e texto dourado, cores do Peacock
    baseUrl: "https://www.peacocktv.com/watch/"
  },
  HIDIVE: {
    name: "HIDIVE",
    icon: <span className="font-bold text-sm">HD</span>, 
    color: "bg-[#00AEEF] hover:bg-[#008FCC] text-white", // Azul oficial HIDIVE
    baseUrl: "https://www.hidive.com/stream/"
  },
  STEAM: {
    name: "Steam",
    icon: <SiSteam className="w-5 h-5" />,
    color: "bg-[#000000] hover:bg-[#1A1A1A] text-[#66C0F4]", // Preto com texto azul Steam
    baseUrl: "https://store.steampowered.com/app/"
  },
  PLAYSTATION: {
    name: "PlayStation",
    icon: <FaPlaystation className="w-5 h-5" />,
    color: "bg-[#003791] hover:bg-[#002A75] text-white", // Azul escuro PlayStation
    baseUrl: "https://store.playstation.com/product/"
  },
  XBOX: {
    name: "Xbox",
    icon: <FaXbox className="w-5 h-5" />,
    color: "bg-[#107C10] hover:bg-[#0D630D] text-white", // Verde Xbox
    baseUrl: "https://www.xbox.com/games/store/"
  },
  NINTENDO: {
    name: "Nintendo",
    icon: <SiNintendoswitch className="w-5 h-5" />,
    color: "bg-[#E60012] hover:bg-[#C4000F] text-white", // Vermelho Nintendo
    baseUrl: "https://www.nintendo.com/store/products/"
  },
  EPIC_GAMES: {
    name: "Epic Games",
    icon: <SiEpicgames className="w-5 h-5" />,
    color: "bg-[#313131] hover:bg-[#444444] text-white", // cinza escuro com texto branco (cores da Epic)
    baseUrl: "https://store.epicgames.com/p/" // URL base para páginas de jogos na Epic Games
  },
  GOG: {
    name: "GOG",
    icon: <SiGogdotcom className="w-5 h-5" />,
    color: "bg-[#863CAC] hover:bg-[#6E2F8F] text-white", // Roxo GOG
    baseUrl: "https://www.gog.com/"
  },
  ROCKSTAR: {
    name: "Rockstar Games",
    icon: <SiRockstargames className="w-5 h-5" />,
    color: "bg-[#FF0000] hover:bg-[#D40000] text-yellow-300", // Vermelho com texto amarelo
    baseUrl: "https://www.rockstargames.com/"
  },
  UBISOFT: {
    name: "Ubisoft",
    icon: <SiUbisoft className="w-5 h-5" />,
    color: "bg-[#000000] hover:bg-[#1A1A1A] text-[#00A2FF]", // Preto com texto azul Ubisoft
    baseUrl: "https://store.ubisoft.com/"
  },
  EA: {
    name: "EA Games",
    icon: <SiEa className="w-5 h-5" />,
    color: "bg-[#000000] hover:bg-[#1A1A1A] text-[#FF0000]", // Preto com texto vermelho EA
    baseUrl: "https://www.ea.com/"
  },
  BATTLENET: {
    name: "Battle.net",
    icon: <FaBattleNet className="w-5 h-5" />, // Ícone da Blizzard
    color: "bg-[#148EFF] hover:bg-[#0F70CC] text-white", // Azul oficial da Battle.net
    baseUrl: "https://shop.battle.net/product/" // URL para produtos na Battle.net
  },
  SPOTIFY: {
    name: "Spotify",
    icon: <FaSpotify className="w-5 h-5" />,
    color: "bg-[#1DB954] hover:bg-[#1AA34A] text-white", // Verde Spotify
    baseUrl: "https://open.spotify.com/album/"
  },
  APPLE_MUSIC: {
    name: "Apple Music",
    icon: <SiApplemusic className="w-5 h-5" />,
    color: "bg-[#FA243C] hover:bg-[#E02038] text-white", // Rosa/vermelho Apple Music
    baseUrl: "https://music.apple.com/album/"
  },
  DEEZER: {
    name: "Deezer",
    icon: <FaDeezer className="w-5 h-5" />,
    color: "bg-[#FEAA2D] hover:bg-[#E59725] text-[#000000]", // Laranja Deezer com texto preto
    baseUrl: "https://www.deezer.com/album/"
  },
  YOUTUBE_MUSIC: {
    name: "YouTube Music",
    icon: <SiYoutubemusic className="w-5 h-5" />,
    color: "bg-[#FF0000] hover:bg-[#D40000] text-white", // Vermelho YouTube
    baseUrl: "https://music.youtube.com/playlist?list="
  },
  AMAZON_MUSIC: {
    name: "Amazon Music",
    icon: <FaAmazon className="w-5 h-5" />,
    color: "bg-[#00A8E1] hover:bg-[#0080B0] text-white", // Azul/verde Amazon Music
    baseUrl: "https://music.amazon.com/albums/"
  },
  AMAZON: {
    name: "Amazon",
    icon: <FaAmazon className="w-5 h-5" />,
    color: "bg-[#FF9900] hover:bg-[#E58800] text-[#000000]", // Laranja Amazon com texto preto
    baseUrl: "https://www.amazon.com.br/dp/"
  },
  AMAZON_KINDLE: {
    name: "Kindle",
    icon: <FcKindle className="w-5 h-5" />,
    color: "bg-[#FF9900] hover:bg-[#E58800] text-[#000000]", // Laranja Amazon com texto preto
    baseUrl: "https://www.amazon.com.br/dp/"
  },
  GOOGLE_PLAY: {
    name: "Google Play",
    icon: <IoLogoGooglePlaystore className="w-5 h-5" />,
    color: "bg-[#4285F4] hover:bg-[#3A76D9] text-white", // Azul Google
    baseUrl: "https://play.google.com/store/music/album/"
  },
  APPLE_STORE: {
    name: "Apple Store",
    icon: <FaApple className="w-5 h-5" />,
    color: "bg-[#0A84FF] hover:bg-[#0066CC] text-white", // Azul oficial App Store
    baseUrl: "https://apps.apple.com/app/" // URL base para aplicativos na App Store
  },
  MICROSOFT: {
    name: "Microsoft Store",
    icon: <FaMicrosoft className="w-5 h-5" />,
    color: "bg-[#0078D4] hover:bg-[#0066B8] text-white", // Azul Microsoft
    baseUrl: "https://www.microsoft.com/store/product/"
  }
};
