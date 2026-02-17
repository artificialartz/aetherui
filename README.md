# AetherUI

<div align="center">

A high-end glassmorphism React component library featuring backdrop-filter optimizations and iridescent mesh gradient generators.

![Version](https://img.shields.io/npm/v/aetherui)
![License](https://img.shields.io/npm/l/aetherui)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Size](https://img.shields.io/bundlephobia/minzip/aetherui)

[Documentation](#documentation)  [Demo](#demo)  [Examples](#examples)  [Contributing](#contributing)

</div>

---

## Features

- Glassmorphism components with backdrop-filter optimizations
- Animated mesh gradient backgrounds with presets
- Command palette with keyboard navigation
- Adaptive layout engine (Grid, Flex, Masonry, Carousel)
- Micro-interaction hooks for rich UX
- Hardware-accelerated animations
- TypeScript with strict mode
- Responsive design utilities
- Performance monitoring and optimizations
- Accessibility-first approach

## Installation

```bash
# npm
npm install aetherui

# yarn
yarn add aetherui

# pnpm
pnpm add aetherui
```

### Peer Dependencies

AetherUI requires the following peer dependencies:

```bash
npm install react react-dom framer-motion
```

### TailwindCSS Configuration

Add the AetherUI styles to your TailwindCSS configuration:

```js
// tailwind.config.js
export default {
  content: [
    "./node_modules/aetherui/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
}
```

Import the styles in your main entry point:

```tsx
import 'aetherui/style.css';
```

## Quick Start

```tsx
import { Glass, GlassCard, GlassButton, MeshGradient } from 'aetherui';

function App() {
  return (
    <MeshGradient preset="aurora" className="min-h-screen">
      <div className="container mx-auto p-8">
        <GlassCard
          title="Welcome to AetherUI"
          description="A beautiful glassmorphism component library"
        >
          <GlassButton variant="primary">Get Started</GlassButton>
        </GlassCard>
      </div>
    </MeshGradient>
  );
}
```

## Components

### Glass

The foundational glassmorphism component with backdrop-filter effects.

```tsx
import { Glass } from 'aetherui';

<Glass
  variant="frosted"
  blur="xl"
  rounded="2xl"
  shadow
  border
>
  Content here
</Glass>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'subtle' \| 'strong' \| 'frosted'` | `'default'` | Glass variant style |
| `blur` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Backdrop blur intensity |
| `opacity` | `number` | `undefined` | Custom opacity (0-1) |
| `border` | `boolean` | `true` | Show border |
| `shadow` | `boolean` | `true` | Show shadow |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| 'full'` | `'xl'` | Border radius |
| `className` | `string` | `''` | Additional classes |

### GlassCard

A card component built on top of Glass with title and description support.

```tsx
import { GlassCard } from 'aetherui';

<GlassCard
  title="Card Title"
  description="Card description goes here"
  variant="hover"
>
  <p>Additional content</p>
</GlassCard>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Card title |
| `description` | `string` | `undefined` | Card description |
| `variant` | `'default' \| 'hover' \| 'interactive'` | `'default'` | Interaction variant |
| `children` | `ReactNode` | `undefined` | Card content |

### GlassButton

A glassmorphic button with smooth animations and shimmer effects.

```tsx
import { GlassButton } from 'aetherui';

<GlassButton
  variant="primary"
  size="md"
  onClick={() => console.log('Clicked')}
>
  Click Me
</GlassButton>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Button style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable button |
| `children` | `ReactNode` | `undefined` | Button content |

### GlassInput

A glassmorphic input with floating label and error states.

```tsx
import { GlassInput } from 'aetherui';

<GlassInput
  label="Email"
  type="email"
  placeholder="hello@example.com"
  error={error ? 'Invalid email' : undefined}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Input label |
| `error` | `string` | `undefined` | Error message |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| All standard input attributes are supported |

### MeshGradient

Animated mesh gradient backgrounds with multiple presets.

```tsx
import { MeshGradient } from 'aetherui';

<MeshGradient
  preset="aurora"
  animated
  speed={15}
  className="min-h-screen"
>
  <YourContent />
</MeshGradient>
```

**Presets:** `aurora`, `sunset`, `ocean`, `galaxy`, `forest`, `fire`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `preset` | `keyof presets \| 'random'` | `'aurora'` | Gradient preset |
| `config` | `MeshGradientConfig` | `undefined` | Custom gradient config |
| `animated` | `boolean` | `true` | Enable animation |
| `speed` | `number` | `15` | Animation duration (seconds) |
| `children` | `ReactNode` | `undefined` | Content to render |

### MeshGradientCard

A card with animated mesh gradient background.

```tsx
import { MeshGradientCard } from 'aetherui';

<MeshGradientCard
  preset="galaxy"
  title="Featured"
  description="Amazing content"
  interactive
/>
```

### CommandPalette

A keyboard-first command palette for quick actions.

```tsx
import { CommandPalette } from 'aetherui';

const commands = [
  {
    id: 'save',
    label: 'Save',
    icon: '💾',
    action: () => saveFile(),
    shortcut: '⌘S',
  },
  // ... more commands
];

<CommandPalette
  commands={commands}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  hotkey="cmd+k"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `commands` | `Command[] \| CommandGroup[]` | `[]` | Commands to display |
| `isOpen` | `boolean` | `undefined` | Controlled open state |
| `onClose` | `() => void` | `undefined` | Close callback |
| `hotkey` | `string` | `'cmd+k'` | Keyboard shortcut |
| `placeholder` | `string` | `'Type a command...'` | Search placeholder |
| `maxResults` | `number` | `8` | Max results to show |

### AdaptiveLayout

A responsive layout engine with multiple modes.

```tsx
import { AdaptiveLayout } from 'aetherui';

<AdaptiveLayout
  mode="grid"
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap={{ xs: '1rem', md: '2rem' }}
  minItemWidth={280}
  loadMore
  onLoadMore={() => loadMoreItems()}
>
  {items.map((item) => (
    <GlassCard key={item.id} title={item.title}>
      {item.content}
    </GlassCard>
  ))}
</AdaptiveLayout>
```

**Modes:** `grid`, `flex`, `masonry`, `carousel`

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'grid' \| 'flex' \| 'masonry' \| 'carousel'` | `'grid'` | Layout mode |
| `columns` | `ResponsiveValue<number>` | `{ xs: 1, sm: 2, md: 3, lg: 4 }` | Responsive columns |
| `gap` | `ResponsiveValue<string>` | `{ xs: '1rem', sm: '1.5rem' }` | Responsive gap |
| `minItemWidth` | `number` | `280` | Min item width |
| `equalHeight` | `boolean` | `false` | Equal height items |
| `animated` | `boolean` | `true` | Enable animations |
| `loadMore` | `boolean` | `false` | Show load more button |
| `onLoadMore` | `() => void` | `undefined` | Load more callback |

## Hooks

### useBackdropFilter

Manage backdrop-filter with automatic optimizations.

```tsx
const { isSupported, isPerformanceMode, optimizedBlurRadius } = useBackdropFilter({
  blurRadius: 12,
  enablePerformanceMode: true,
});
```

### useHover

Manage hover states with smooth transitions.

```tsx
const { isHovered, hoverProps } = useHover({
  onHoverStart: () => console.log('hovered'),
  delay: 100,
});
```

### useFocus

Manage focus states with accessibility support.

```tsx
const { isFocused, isFocusVisible, focusProps } = useFocus();
```

### usePress

Manage press states with ripple effects.

```tsx
const { isPressed, pressProps } = usePress({
  onPress: () => console.log('pressed'),
});
```

### useKeyboardNavigation

Keyboard navigation for lists.

```tsx
const { selectedIndex, keyboardProps } = useKeyboardNavigation(items, {
  onSelect: (item) => console.log('selected', item),
  loop: true,
});
```

### useClipboard

Clipboard operations with feedback.

```tsx
const { isCopied, copy } = useClipboard({
  onSuccess: () => console.log('copied'),
});

copy('text to copy');
```

### useDebounce

Debounce values.

```tsx
const debouncedValue = useDebounce(value, 500);
```

### useThrottle

Throttle callbacks.

```tsx
const throttledCallback = useThrottle(callback, 500);
```

### useMediaQuery

Responsive media query hook.

```tsx
const isMobile = useMediaQuery('(max-width: 768px)');
```

### useIntersectionObserver

Intersection observer for lazy loading.

```tsx
const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
  threshold: 0.1,
});
```

## Utilities

### Mesh Gradient Utilities

```tsx
import {
  generateMeshGradient,
  generateMeshBackground,
  createMeshGradient,
  randomMeshGradient,
  meshGradientPresets,
} from 'aetherui';

// Generate custom gradient
const config = createMeshGradient(['#ff0000', '#00ff00', '#0000ff']);

// Get random gradient
const random = randomMeshGradient();
```

### Backdrop Filter Utilities

```tsx
import {
  supportsBackdropFilter,
  getOptimizedBlurRadius,
  shouldUsePerformanceMode,
} from 'aetherui';

if (supportsBackdropFilter()) {
  const blur = getOptimizedBlurRadius(20);
}
```

## TypeScript Support

AetherUI is built with TypeScript and exports full type definitions.

```tsx
import type {
  GlassProps,
  GlassVariant,
  MeshGradientConfig,
  Command,
  CommandGroup,
  AdaptiveLayoutProps,
  ResponsiveValue,
} from 'aetherui';
```

## Styling

AetherUI uses TailwindCSS for styling. You can customize the appearance by:

1. Extending your Tailwind config with AetherUI's content paths
2. Using the exported CSS variables
3. Applying custom className props to components

### CSS Variables

```css
:root {
  --glass-border: rgba(255, 255, 255, 0.125);
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-shadow: rgba(0, 0, 0, 0.1);
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

### Fallbacks

For browsers without backdrop-filter support, AetherUI provides automatic fallbacks using background opacity and gradients.

## Performance

AetherUI includes several performance optimizations:

- Hardware-accelerated animations
- Reduced motion support
- Automatic blur radius optimization
- Performance mode detection
- Lazy loading utilities
- Throttled/debounced callbacks

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/aetherui.git
cd aetherui

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build library
pnpm build
```

## License

MIT © [Your Name]

## Credits

Built with:
- [React](https://react.dev)
- [TypeScript](https://typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://framer.com/motion)

## Links

- [Documentation](https://aetherui.dev)
- [GitHub](https://github.com/yourusername/aetherui)
- [NPM](https://npmjs.com/package/aetherui)
- [Report Issues](https://github.com/yourusername/aetherui/issues)

---

<div align="center">

Made with ❤️ by the AetherUI team

</div>
