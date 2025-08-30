import MediaGrid from "../components/MediaGrid";
import { MediaType } from "../models/MediaType";
import { getMediaByType } from "../utils/MediaHelpers";

export default function BooksPage() {
  const mockBooks = getMediaByType(MediaType.BOOK);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Livros</h2>
      <MediaGrid items={mockBooks} />
    </div>
  );
}