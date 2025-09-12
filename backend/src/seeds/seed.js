const { PrismaClient, MediaGenre } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { ALL_MEDIA } = require('./seedMedia');
const streamingService = require('../services/streamingService');

console.log('🚀 Seed iniciado');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🚀 Iniciando seed do banco...');

    // 🔹 Limpa dados existentes de usuários e streaming links (mantém mídias para update)
    await prisma.streamingLink.deleteMany();
    await prisma.user.deleteMany();

    // 🔹 Criptografa senhas
    const senhaPadraoHash = await bcrypt.hash('123456', 10);
    const senhaMariaHash = await bcrypt.hash('senha123', 10);
    const senhaAdminHash = await bcrypt.hash('admin123', 10);

    // 🔹 Cria usuários
    const usuarios = [
      {
        email: 'usuario@email.com',
        password: senhaPadraoHash,
        name: 'João Silva',
        username: 'joaosilva123',
        bio: 'Apaixonado por filmes e séries.',
        avatar: null,
        profileVisibility: 'public',
        showSavedItems: true,
        showFavorites: true,
        showReviews: true,
        showStats: true,
        dataCollection: true
      },
      {
        email: 'teste@email.com',
        password: senhaMariaHash,
        name: 'Maria Santos',
        username: 'mariassantos123',
        bio: 'Amante de música e games.',
        avatar: null,
        profileVisibility: 'private',
        showSavedItems: false,
        showFavorites: false,
        showReviews: false,
        showStats: false,
        dataCollection: false
      },
      {
        email: 'admin@email.com',
        password: senhaAdminHash,
        name: 'Administrador',
        username: 'admin',
        bio: 'Usuário administrador do sistema.',
        avatar: null,
        profileVisibility: 'private',
        showSavedItems: false,
        showFavorites: false,
        showReviews: false,
        showStats: false,
        dataCollection: false,
        role: 'ADMIN'
      }
    ];

    for (const u of usuarios) {
      const user = await prisma.user.create({ data: u });
      console.log(`✅ Usuário criado: ${user.username}`);
    }

    // 🔹 Gêneros válidos do enum
    const validGenres = Object.values(MediaGenre);

    // 🔹 Cria ou atualiza mídias
    for (const media of ALL_MEDIA) {
      const cleanedGenres = (media.genres ?? []).filter(
        g => g != null && validGenres.includes(g)
      );

      const createdMedia = await prisma.media.upsert({
        where: { title_type: { title: media.title, type: media.type } }, // assume que você criou um unique composite de title + type
        update: {
          rating: media.rating,
          image: media.image,
          year: media.year,
          genres: cleanedGenres,
          platforms: media.platforms ?? [],
          directors: media.directors ?? [],
          authors: media.authors ?? [],
          artists: media.artists ?? [],
          seasons: media.seasons ?? null,
          duration: media.duration ?? null,
          pages: media.pages ?? null,
          classification: media.classification ?? null,
          description: media.description ?? '' // atualiza a descrição
        },
        create: {
          title: media.title,
          type: media.type,
          rating: media.rating,
          image: media.image,
          year: media.year,
          genres: cleanedGenres,
          platforms: media.platforms ?? [],
          directors: media.directors ?? [],
          authors: media.authors ?? [],
          artists: media.artists ?? [],
          seasons: media.seasons ?? null,
          duration: media.duration ?? null,
          pages: media.pages ?? null,
          classification: media.classification ?? null,
          description: media.description ?? ''
        }
      });

      // 🔹 Cria streaming links
      const links = media.streamingLinks ?? [];
      for (const link of links) {
        await prisma.streamingLink.create({
          data: {
            mediaId: createdMedia.id,
            service: link.service,
            url: link.url
          }
        });
      }

      // 🔹 Cria links aleatórios se não houver links
      if (!media.streamingLinks || media.streamingLinks.length === 0) {
        for (const service of streamingService.availableServices) {
          await prisma.streamingLink.create({
            data: {
              mediaId: createdMedia.id,
              service,
              url: `https://www.${service.toLowerCase()}.com/watch/${createdMedia.id}`
            }
          });
        }
      }

      console.log(`🎬 Mídia criada/atualizada: ${createdMedia.title}`);
    }

    console.log('🎉 Seed concluído com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao rodar seed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Permite rodar via "node src/seeds/seed.js" ou "npx prisma db seed"
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seed };
