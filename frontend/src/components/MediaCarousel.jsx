import MediaCarouselCard from "./MediaCarouselCard";

export default function MediaCarousel({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p>Nenhum item disponível</p>;
  }

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 py-2 overflow-visible">
      {items.map((media) => (
        <MediaCarouselCard key={media.id} media={media} />
      ))}
    </div>
  );
}
