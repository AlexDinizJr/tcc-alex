import { ALL_MEDIA } from "../mockdata/mockMedia";

/**
 * Simula uma chamada de API para buscar recomendações.
 * @returns {Promise<Array>} Lista de itens de mídia recomendados
 */

export async function fetchRecommendations() {
  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Retorna 5 itens aleatórios como recomendação
  const shuffled = [...ALL_MEDIA].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
}

/**
 * Simula uma chamada de API para buscar trending media
 */
export async function fetchTrending() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Ordena por rating e retorna top 5
  return [...ALL_MEDIA].sort((a, b) => b.rating - a.rating).slice(0, 5);
}

export async function fetchMedia({ type, searchQuery = "", sortBy = "", page = 1, itemsPerPage = 20 }) {
  // Simular delay
  await new Promise((res) => setTimeout(res, 200));

  // Filtrar por tipo
  let items = ALL_MEDIA.filter((m) => m.type === type);

  // Filtro de pesquisa
  if (searchQuery.trim() !== "") {
    items = items.filter((m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Ordenação
  if (sortBy === "title") {
    items = [...items].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "rating") {
    items = [...items].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "year") {
    items = [...items].sort((a, b) => b.year - a.year);
  }

  const total = items.length;

  // Paginação
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pagedItems = items.slice(start, end);

  return { items: pagedItems, total };
}

export async function fetchMediaById(id) {
  // Simula delay de fetch
  return new Promise(resolve => {
    const media = ALL_MEDIA.find(m => m.id === id);
    setTimeout(() => resolve(media || null), 200);
  });
}

/**
 * Retorna mídias por tipo, com opções de exclusão e limite
 * @param {string} type MediaType
 * @param {Object} options { excludeId: number, limit: number }
 */
export async function fetchMediaByType(type, options = {}) {
  const { excludeId = null, limit = null } = options;

  return new Promise(resolve => {
    let medias = ALL_MEDIA.filter(m => m.type === type);
    if (excludeId) medias = medias.filter(m => m.id !== excludeId);
    if (limit) medias = medias.slice(0, limit);

    setTimeout(() => resolve(medias), 200);
  });
}