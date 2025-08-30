import MediaGrid from "../components/MediaGrid";
import { MediaType } from "../models/MediaType";
import { getMediaByType } from "../utils/MediaHelpers";

export default function TVSeriesPage() {
  const mockTVSeries = getMediaByType(MediaType.SERIES);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Músicas</h2>
      <MediaGrid items={mockTVSeries} />
    </div>
  );
}