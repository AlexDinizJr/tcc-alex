import { useMemo } from "react";
import { ALL_MEDIA } from "../mockdata/mockMedia";
import { MediaType } from "../models/MediaType";
import { MediaGenre } from "../models/GenreModel";
import { ClassificationRating } from "../models/ClassificationRating";

export function useRecommendationFilters() {
  const mediaTypes = useMemo(
    () => Object.values(MediaType).filter(v => typeof v === "string").sort(),
    []
  );

  const genres = useMemo(
    () => Object.values(MediaGenre).filter(v => typeof v === "string").sort(),
    []
  );

  const classifications = useMemo(
    () => Object.values(ClassificationRating).filter(v => typeof v === "string").sort(),
    []
  )

  const platforms = useMemo(
    () => {
      try {
        return [
          ...new Set(
            ALL_MEDIA.flatMap(m => m.streamingLinks?.map(s => s.service) || [])
          )
        ];
      } catch (error) {
        console.error("Erro ao carregar plataformas:", error);
        return [];
      }
    },
    []
  );

  return { mediaTypes, genres, platforms, classifications };
}