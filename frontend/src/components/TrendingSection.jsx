import { ALL_MEDIA } from "../mockdata/mockMedia";
import MediaCarousel from "./MediaCarousel";
import { IoMdTrendingUp } from "react-icons/io";

export default function TrendingSection() {
  const trendingItems = ALL_MEDIA.filter((m) => m.rating >= 4.5).slice(0, 5);

  return (
    <div className="w-full mb-8 flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <IoMdTrendingUp className="w-6 h-6 text-blue-500" />
        Trendings
      </h2>
      <MediaCarousel items={trendingItems} />
    </div>
  );
}