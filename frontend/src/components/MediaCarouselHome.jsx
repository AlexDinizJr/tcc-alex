import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MediaCarouselCardHome from "./MediaCarouselCardHome";

export default function MediaCarouselHome({ items }) {
  const scrollRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ✅ Hooks sempre são chamados
  useEffect(() => {
    const updateScrollState = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    updateScrollState();

    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.9;
    const newScrollLeft =
      direction === "left"
        ? Math.max(0, scrollRef.current.scrollLeft - scrollAmount)
        : Math.min(
            scrollRef.current.scrollWidth - clientWidth,
            scrollRef.current.scrollLeft + scrollAmount
          );

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  // ✅ Se não houver items, renderiza mensagem
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-center text-gray-500">Nenhum item disponível</p>;
  }

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Botões e Gradientes */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full text-white transition-all duration-300 bg-gray-900/60 hover:bg-gray-900/80 hidden sm:flex ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <FiChevronLeft size={26} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full text-white transition-all duration-300 bg-gray-900/60 hover:bg-gray-900/80 hidden sm:flex ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <FiChevronRight size={26} />
        </button>
      )}

      {/* Gradientes */}
      <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10">
        <div className="h-full w-full bg-gradient-to-r from-gray-900/95 to-transparent" />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10">
        <div className="h-full w-full bg-gradient-to-l from-gray-900/95 to-transparent" />
      </div>

      {/* Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-hide scroll-smooth px-10 py-6 snap-x snap-mandatory"
        style={{ overscrollBehaviorX: "contain" }}
      >
        {items.map((media) => (
          <div
            key={media.id}
            className="snap-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <MediaCarouselCardHome media={media} />
          </div>
        ))}
      </div>
    </div>
  );
}
