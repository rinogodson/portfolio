import { useState } from "react";
import {
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";

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
    <div className="relative w-full max-w-md h-137.5 flex items-center justify-center perspective-[1000px]">
      {cards.map((card, index) => {
        const isTop = index === 0;

        return (
          <Card
            key={card.id}
            card={card}
            index={index}
            isTop={isTop}
            onSwipe={() => moveToEnd(index)}
          />
        );
      })}
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
  const x = useMotionValue(0);
  const rotateDrag = useTransform(x, [-200, 200], [-10, 10]);

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;

    const isSwipeRight =
      info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold;
    const isSwipeLeft =
      info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold;

    if (isSwipeRight || isSwipeLeft) {
      onSwipe();
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  const xOffset = index * 25;
  const yOffset = index * -5;
  const scale = 1 - index * 0.04;
  const opacity = index >= 4 ? 0 : 1;
  const zIndex = 100 - index;
  const stackRotate = index * 4;

  return (
    <motion.div
      className="absolute w-full h-125"
      style={{
        zIndex,
        transformOrigin: "center center",
        pointerEvents: isTop ? "auto" : "none",
      }}
      animate={{
        x: xOffset,
        y: yOffset,
        scale: scale,
        opacity: opacity,
        rotate: stackRotate,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      <motion.div
        className="w-full h-full bg-[#111111] rounded-[32px] border border-white/10 flex flex-col overflow-hidden"
        style={{
          x,
          rotate: rotateDrag,
          cursor: isTop ? "grab" : "auto",
          boxShadow: isTop
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
            : "-10px 10px 30px -10px rgba(0, 0, 0, 0.6)",
          backfaceVisibility: "hidden",
          WebkitFontSmoothing: "antialiased",
        }}
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        whileTap={isTop ? { cursor: "grabbing" } : {}}
      >
        <div className="relative h-48 w-full bg-neutral-900 shrink-0 select-none">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#111111] to-transparent" />
        </div>

        <div className="p-6 flex flex-col grow select-none">
          <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">
            {card.title}
          </h2>
          <p className="text-neutral-400 text-sm mb-4 grow leading-relaxed">
            {card.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
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
              href={card.demo}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors pointer-events-auto"
              onClick={(e) => (isTop ? null : e.preventDefault())}
              draggable={false}
            >
              Demo
            </a>
            <a
              href={card.repo}
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-neutral-700 transition-colors pointer-events-auto border border-white/10"
              onClick={(e) => (isTop ? null : e.preventDefault())}
              draggable={false}
            >
              Repo
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
