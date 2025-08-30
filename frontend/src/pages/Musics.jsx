import MediaGrid from "../components/MediaGrid";
import { MediaType } from "../models/MediaType";
import { getMediaByType } from "../utils/MediaHelpers";

export default function MusicsPage() {
  const mockMusics = getMediaByType(MediaType.MUSIC);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Músicas</h2>
      <MediaGrid items={mockMusics} />
    </div>
  );
}