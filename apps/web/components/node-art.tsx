function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

interface NodeArtProps {
  seed: string;
  className?: string;
}

const WIDTH = 160;
const HEIGHT = 110;
const NODE_COUNT = 6;
const NODE_RADIUS = 5;

export function NodeArt({ seed, className = "" }: NodeArtProps) {
  const random = seededRandom(seed);
  const centerIndex = Math.floor(random() * NODE_COUNT);

  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
    if (i === centerIndex) {
      return { x: WIDTH / 2, y: HEIGHT / 2 };
    }
    const angle = random() * Math.PI * 2;
    const radius = 28 + random() * 38;
    return {
      x: WIDTH / 2 + Math.cos(angle) * radius,
      y: HEIGHT / 2 + Math.sin(angle) * radius * 0.75,
    };
  });

  const center = nodes[centerIndex];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {nodes.map((node, i) =>
        i === centerIndex ? null : (
          <line
            key={`line-${i}`}
            x1={center?.x}
            y1={center?.y}
            x2={node.x}
            y2={node.y}
            stroke="currentColor"
            strokeWidth={1}
            className="text-neutral-300 dark:text-neutral-700"
          />
        )
      )}
      {nodes.map((node, i) =>
        i === centerIndex ? (
          <circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r={NODE_RADIUS}
            fill="var(--color-accent-primary)"
          />
        ) : (
          <circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r={NODE_RADIUS}
            stroke="currentColor"
            strokeWidth={1.5}
            className="text-neutral-400 dark:text-neutral-600"
          />
        )
      )}
    </svg>
  );
}
