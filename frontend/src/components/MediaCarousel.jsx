import MediaCarouselCard from "./MediaCarouselCard";

export default function MediaCarousel({ items }) {
  return (
    <div className="w-full max-w-5xl mx-auto overflow-x-auto flex gap-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 justify-center">
      {items.map((media) => (
        <div key={media.id} className="snap-start">
          <MediaCarouselCard media={media} />
        </div>
      ))}
    </div>
  );
}
