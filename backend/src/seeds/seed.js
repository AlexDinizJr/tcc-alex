const { PrismaClient } = require('@prisma/client');
const { ALL_MEDIA } = require('./seedMedia');
const streamingService = require('../services/streamingService');

console.log('🚀 Seed iniciado');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🚀 Iniciando seed do banco...');


    // 🔹 Cria ou atualiza mídias
    for (const media of ALL_MEDIA) {
      const createdMedia = await prisma.media.upsert({
        where: { title_type: { title: media.title, type: media.type } },
        update: {
          rating: media.rating,
          image: media.image,
          year: media.year,
          genres: media.genres ?? [],
          platforms: media.platforms ?? [],
          directors: media.directors ?? [],
          authors: media.authors ?? [],
          artists: media.artists ?? [],
          seasons: media.seasons ?? null,
          duration: media.duration ?? null,
          pages: media.pages ?? null,
          classification: media.classification ?? null,
          description: media.description ?? ''
        },
        create: {
          title: media.title,
          type: media.type,
          rating: media.rating,
          image: media.image,
          year: media.year,
          genres: media.genres ?? [],
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

      // 🔹 Apaga links de streaming SOMENTE da mídia atual
      await prisma.streamingLink.deleteMany({
        where: { mediaId: createdMedia.id }
      });

      // 🔹 Cria streaming links da mídia
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

      console.log(`🎬 Mídia criada/atualizada: ${createdMedia.title}`);
    }

    console.log('🎉 Seed concluído com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao rodar seed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seed };