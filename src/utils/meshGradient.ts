import type { MeshGradientConfig } from '../types';

/**
 * Default preset mesh gradients
 */
export const meshGradientPresets: Record<string, MeshGradientConfig> = {
  aurora: {
    colors: [
      { color: '#a78bfa', position: [0, 0] },
      { color: '#60a5fa', position: [50, 50] },
      { color: '#34d399', position: [100, 100] },
      { color: '#f472b6', position: [50, 100] },
    ],
    animated: true,
    speed: 15,
  },
  sunset: {
    colors: [
      { color: '#fb7185', position: [0, 0] },
      { color: '#fb923c', position: [33, 50] },
      { color: '#fbbf24', position: [66, 50] },
      { color: '#f87171', position: [100, 100] },
    ],
    animated: true,
    speed: 20,
  },
  ocean: {
    colors: [
      { color: '#0ea5e9', position: [0, 0] },
      { color: '#06b6d4', position: [33, 33] },
      { color: '#14b8a6', position: [66, 66] },
      { color: '#0284c7', position: [100, 100] },
    ],
    animated: true,
    speed: 18,
  },
  galaxy: {
    colors: [
      { color: '#8b5cf6', position: [0, 0] },
      { color: '#d946ef', position: [25, 75] },
      { color: '#6366f1', position: [75, 25] },
      { color: '#8b5cf6', position: [100, 100] },
    ],
    animated: true,
    speed: 25,
  },
  forest: {
    colors: [
      { color: '#22c55e', position: [0, 0] },
      { color: '#84cc16', position: [50, 50] },
      { color: '#14b8a6', position: [100, 0] },
      { color: '#10b981', position: [50, 100] },
    ],
    animated: true,
    speed: 12,
  },
  fire: {
    colors: [
      { color: '#ef4444', position: [0, 0] },
      { color: '#f97316', position: [33, 33] },
      { color: '#eab308', position: [66, 66] },
      { color: '#dc2626', position: [100, 100] },
    ],
    animated: true,
    speed: 10,
  },
};

/**
 * Generates a CSS radial gradient string from mesh gradient config
 */
export function generateMeshGradient(config: MeshGradientConfig): string {
  const { colors } = config;

  return colors
    .map(({ color, position }) => {
      const [x, y] = position;
      return `radial-gradient(circle at ${x}% ${y}%, ${color}, transparent 50%)`;
    })
    .join(', ');
}

/**
 * Generates a CSS background string with all gradients
 */
export function generateMeshBackground(config: MeshGradientConfig): string {
  const meshGradient = generateMeshGradient(config);
  return meshGradient;
}

/**
 * Generates CSS animation styles for mesh gradients
 */
export function generateMeshAnimation(speed: number = 15) {
  return {
    backgroundSize: '200% 200%',
    animation: `mesh-gradient ${speed}s ease infinite`,
  };
}

/**
 * Creates a custom mesh gradient from color array
 */
export function createMeshGradient(
  colors: string[],
  animated: boolean = true,
  speed: number = 15
): MeshGradientConfig {
  const positions = [
    [0, 0],
    [33, 33],
    [66, 66],
    [100, 100],
  ];

  return {
    colors: colors.map((color, index) => ({
      color,
      position: positions[index % positions.length] as [number, number],
    })),
    animated,
    speed,
  };
}

/**
 * Interpolates between two mesh gradient configs
 */
export function interpolateMeshGradients(
  config1: MeshGradientConfig,
  config2: MeshGradientConfig,
  progress: number
): MeshGradientConfig {
  return {
    colors: config1.colors.map((color, index) => ({
      color: interpolateColor(color.color, config2.colors[index]?.color || color.color, progress),
      position: [
        color.position[0] + (config2.colors[index]?.position[0] || color.position[0] - color.position[0]) * progress,
        color.position[1] + (config2.colors[index]?.position[1] || color.position[1] - color.position[1]) * progress,
      ] as [number, number],
    })),
    animated: (config1.animated || config2.animated) ?? false,
    speed: (config1.speed ?? 15) + ((config2.speed ?? 15) - (config1.speed ?? 15)) * progress,
  };
}

/**
 * Interpolates between two hex colors
 */
function interpolateColor(color1: string, color2: string, progress: number): string {
  const hex2rgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgb1 = hex2rgb(color1);
  const rgb2 = hex2rgb(color2);

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generates a random mesh gradient
 */
export function randomMeshGradient(): MeshGradientConfig {
  const randomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
  };

  return {
    colors: [
      { color: randomColor(), position: [Math.random() * 100, Math.random() * 100] },
      { color: randomColor(), position: [Math.random() * 100, Math.random() * 100] },
      { color: randomColor(), position: [Math.random() * 100, Math.random() * 100] },
      { color: randomColor(), position: [Math.random() * 100, Math.random() * 100] },
    ],
    animated: true,
    speed: 15 + Math.random() * 10,
  };
}
