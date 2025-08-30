import { ALL_MEDIA } from "../mockdata/mockMedia";
import MediaCarousel from "./MediaCarousel";

export default function TrendingSection() {
  const trendingItems = ALL_MEDIA.filter((m) => m.rating >= 4.5).slice(0, 5);

  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold text-left mb-4">🔥 Trendings</h2>
      <MediaCarousel items={trendingItems} />
    </div>
  );
}
