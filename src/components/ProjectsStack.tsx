import { useState, useRef, type PointerEvent } from "react";
import { FaGithub } from "react-icons/fa";
import { MdToys } from "react-icons/md";

export default function ProjectsStack({
  pro,
}: {
  pro: {
    id: number;
    title: string;
    description: string;
    demo: string | null;
    repo: string;
    stack: string[];
    image?: string | undefined;
  }[];
}) {
  const [cards, setCards] = useState(pro);

  const moveToEnd = (fromIndex: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      const [movedCard] = newCards.splice(fromIndex, 1);
      newCards.push(movedCard);
      return newCards;
    });
  };

  return (
    <div className="flex flex-col w-full max-w-lg items-center gap-6 font-[Rubik]">
      <div className="relative w-full max-w-lg h-150 flex items-center justify-center perspective-[1000px]">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            isTop={index === 0}
            onSwipe={() => moveToEnd(index)}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  card,
  index,
  isTop,
  onSwipe,
}: {
  card: any;
  index: number;
  isTop: boolean;
  onSwipe: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!isTop) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
    startX.current = e.clientX;
    currentX.current = 0;

    if (cardRef.current) {
      cardRef.current.style.transition = "none";
      cardRef.current.style.cursor = "grabbing";
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !isTop) return;
    currentX.current = e.clientX - startX.current;
    if (cardRef.current) {
      const rotate = currentX.current * 0.05;
      cardRef.current.style.transform = `translate3d(${currentX.current}px, 0, 0) rotate(${rotate}deg)`;
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !isTop) return;
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    const el = cardRef.current;
    if (el) {
      const swipeThreshold = 100;
      el.style.transition = "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)";
      el.style.cursor = "grab";

      if (Math.abs(currentX.current) > swipeThreshold) {
        const direction = currentX.current > 0 ? 1 : -1;
        const throwX = direction * (window.innerWidth + 500);
        const throwRotate = direction * 45;
        el.style.transform = `translate3d(${throwX}px, 0, 0) rotate(${throwRotate}deg)`;
        setTimeout(() => {
          onSwipe();
          if (cardRef.current) cardRef.current.style.transform = "";
        }, 300);
      } else {
        el.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        setTimeout(() => {
          if (cardRef.current && !isDragging.current) {
            cardRef.current.style.transform = "";
          }
        }, 300);
      }
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (Math.abs(currentX.current) > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className="absolute w-full h-140"
      style={{
        zIndex: 100 - index,
        pointerEvents: isTop ? "auto" : "none",
        transform: `translate3d(${index * 25}px, ${index * -5}px, 0) scale(${1 - index * 0.04}) rotate(${index * 4}deg)`,
        opacity: index >= 4 ? 0 : 1,
        transformOrigin: "center center",
        transition:
          "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease",
      }}
    >
      <div
        ref={cardRef}
        onClickCapture={handleClickCapture}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full bg-[#111111] rounded-2xl border border-white/10 flex flex-col"
        style={{
          cursor: isTop ? "grab" : "auto",
          boxShadow: isTop
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
            : "-10px 10px 30px -10px rgba(0, 0, 0, 0.6)",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
          touchAction: isTop ? "none" : "auto",
          willChange: isTop ? "transform" : "auto",
        }}
      >
        <div className="relative p-2 h-48 w-full shrink-0 select-none">
          <img
            src={card.image}
            alt={card.title}
            className="w-full rounded-xl h-full object-cover pointer-events-none border-2 border-black/50"
            draggable={false}
          />
        </div>

        <div className="p-5 flex flex-col grow select-none">
          <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
            {card.title}
          </h2>
          <p className="text-neutral-400 text-md mb-4 grow leading-relaxed">
            {card.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6 pointer-events-none">
            {card.stack.map((t: string) => (
              <span
                key={t}
                className="px-3 py-1 text-xs font-medium bg-neutral-800/50 text-neutral-300 rounded-full border border-white/5"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-3 mt-auto">
            <a
              href={card.demo || "#"}
              style={{
                pointerEvents: card.demo ? "auto" : "none",
                backgroundColor: card.demo ? "#fff" : "#555",
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-xl font-semibold text-xl transition-colors pointer-events-auto"
              onClick={(e) => (isTop ? null : e.preventDefault())}
            >
              <MdToys size={20} />
              Demo
            </a>
            <a
              href={card.repo}
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 text-white py-3 px-4 rounded-xl font-semibold text-xl hover:bg-neutral-700 transition-colors pointer-events-auto border border-white/10"
              onClick={(e) => (isTop ? null : e.preventDefault())}
            >
              <FaGithub size={20} />
              Repo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
