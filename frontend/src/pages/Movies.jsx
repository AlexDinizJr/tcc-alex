import MediaGrid from "../components/MediaGrid";
import { MediaType } from "../models/MediaType";
import { getMediaByType } from "../utils/MediaHelpers";

export default function MoviesPage() {
  const mockMovies = getMediaByType(MediaType.MOVIE);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Filmes</h2>
      <MediaGrid items={mockMovies} />
    </div>
  );
}