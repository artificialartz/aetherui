import React, { useState } from 'react';
import {
  Glass,
  GlassCard,
  GlassButton,
  GlassInput,
  MeshGradient,
  MeshGradientCard,
  CommandPalette,
  AdaptiveLayout,
} from '../src';

// Sample commands for CommandPalette
const sampleCommands = [
  {
    id: 'navigate-home',
    label: 'Go to Home',
    description: 'Navigate to the home page',
    icon: '🏠',
    action: () => console.log('Navigating to home'),
    shortcut: '⌘H',
  },
  {
    id: 'navigate-settings',
    label: 'Open Settings',
    description: 'Configure your preferences',
    icon: '⚙️',
    action: () => console.log('Opening settings'),
    shortcut: '⌘,',
  },
  {
    id: 'theme-dark',
    label: 'Switch to Dark Mode',
    description: 'Enable dark theme',
    icon: '🌙',
    action: () => console.log('Switching to dark mode'),
  },
  {
    id: 'theme-light',
    label: 'Switch to Light Mode',
    description: 'Enable light theme',
    icon: '☀️',
    action: () => console.log('Switching to light mode'),
  },
  {
    id: 'export-data',
    label: 'Export Data',
    description: 'Download your data as JSON',
    icon: '📥',
    action: () => console.log('Exporting data'),
    shortcut: '⌘E',
  },
  {
    id: 'new-project',
    label: 'New Project',
    description: 'Create a new project',
    icon: '➕',
    action: () => console.log('Creating new project'),
    shortcut: '⌘N',
  },
];

function App() {
  const [inputValue, setInputValue] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'flex' | 'masonry' | 'carousel'>('grid');

  // Sample cards for AdaptiveLayout
  const sampleCards = Array.from({ length: 12 }, (_, i) => (
    <GlassCard
      key={i}
      title={`Card ${i + 1}`}
      description="Adaptive content with smooth animations"
      variant="hover"
    >
      <p className="text-white/70 text-sm">
        This card adapts to different screen sizes and layout modes.
      </p>
    </GlassCard>
  ));

  return (
    <MeshGradient preset="aurora" className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Glass className="inline-block px-8 py-6 mb-6">
            <h1 className="text-5xl font-bold text-white mb-2">AetherUI</h1>
            <p className="text-white/70 text-lg">
              A high-end glassmorphism React component library
            </p>
          </Glass>
          <p className="text-white/60 text-sm">
            Featuring backdrop-filter optimizations and iridescent mesh gradient generators
          </p>
        </div>

        {/* Glass Components Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <GlassCard
            title="Glass Component"
            description="The foundation of glassmorphism design"
            variant="hover"
          >
            <p className="text-white/70 text-sm">
              Fully customizable with variants, blur levels, and rounded corners.
            </p>
          </GlassCard>

          <GlassCard
            title="Mesh Gradients"
            description="Beautiful animated backgrounds"
            variant="hover"
          >
            <p className="text-white/70 text-sm">
              Choose from presets or create your own iridescent gradients.
            </p>
          </GlassCard>

          <GlassCard
            title="Optimized Performance"
            description="Hardware accelerated animations"
            variant="hover"
          >
            <p className="text-white/70 text-sm">
              Automatic optimizations for mobile and low-end devices.
            </p>
          </GlassCard>

          <GlassCard
            title="Command Palette"
            description="Keyboard-first navigation"
            variant="hover"
          >
            <p className="text-white/70 text-sm mb-4">
              Quick actions with keyboard shortcuts. Press Cmd+K to open.
            </p>
            <GlassButton onClick={() => setCommandPaletteOpen(true)} size="sm">
              Open Palette
            </GlassButton>
          </GlassCard>

          <GlassCard
            title="Adaptive Layout"
            description="Responsive layout engine"
            variant="hover"
          >
            <p className="text-white/70 text-sm">
              Grid, flex, masonry, and carousel layouts with animations.
            </p>
          </GlassCard>

          <GlassCard
            title="Micro-interactions"
            description="Rich interaction hooks"
            variant="hover"
          >
            <p className="text-white/70 text-sm">
              Hover, focus, press, and keyboard navigation utilities.
            </p>
          </GlassCard>
        </div>

        {/* Buttons Showcase */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Glass Buttons</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <GlassButton variant="primary">Primary</GlassButton>
            <GlassButton variant="secondary">Secondary</GlassButton>
            <GlassButton variant="ghost">Ghost</GlassButton>
            <GlassButton disabled>Disabled</GlassButton>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <GlassButton size="sm">Small</GlassButton>
            <GlassButton size="md">Medium</GlassButton>
            <GlassButton size="lg">Large</GlassButton>
          </div>
        </div>

        {/* Input Showcase */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Glass Input</h2>
          <div className="max-w-md mx-auto space-y-4">
            <GlassInput
              label="Enter your email"
              placeholder="hello@example.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <GlassInput
              label="With error state"
              placeholder="Type something..."
              error="This field is required"
            />
          </div>
        </div>

        {/* Adaptive Layout Showcase */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Adaptive Layout</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <GlassButton
              size="sm"
              variant={layoutMode === 'grid' ? 'primary' : 'secondary'}
              onClick={() => setLayoutMode('grid')}
            >
              Grid
            </GlassButton>
            <GlassButton
              size="sm"
              variant={layoutMode === 'flex' ? 'primary' : 'secondary'}
              onClick={() => setLayoutMode('flex')}
            >
              Flex
            </GlassButton>
            <GlassButton
              size="sm"
              variant={layoutMode === 'masonry' ? 'primary' : 'secondary'}
              onClick={() => setLayoutMode('masonry')}
            >
              Masonry
            </GlassButton>
            <GlassButton
              size="sm"
              variant={layoutMode === 'carousel' ? 'primary' : 'secondary'}
              onClick={() => setLayoutMode('carousel')}
            >
              Carousel
            </GlassButton>
          </div>
          <AdaptiveLayout
            mode={layoutMode}
            columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
            gap={{ xs: '1rem', sm: '1.5rem' }}
            minItemWidth={280}
          >
            {sampleCards}
          </AdaptiveLayout>
        </div>

        {/* Mesh Gradient Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Mesh Gradient Presets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MeshGradientCard preset="aurora" title="Aurora" interactive />
            <MeshGradientCard preset="sunset" title="Sunset" interactive />
            <MeshGradientCard preset="ocean" title="Ocean" interactive />
            <MeshGradientCard preset="galaxy" title="Galaxy" interactive />
            <MeshGradientCard preset="forest" title="Forest" interactive />
            <MeshGradientCard preset="fire" title="Fire" interactive />
          </div>
        </div>

        {/* Glass Variants */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Glass Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Glass variant="default" className="p-4 text-center text-white/80">
              Default
            </Glass>
            <Glass variant="subtle" className="p-4 text-center text-white/80">
              Subtle
            </Glass>
            <Glass variant="strong" className="p-4 text-center text-white/80">
              Strong
            </Glass>
            <Glass variant="frosted" className="p-4 text-center text-white/80">
              Frosted
            </Glass>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Glass className="inline-block px-6 py-3">
            <p className="text-white/60 text-sm">
              Built with React, TypeScript, TailwindCSS, and Framer Motion
            </p>
          </Glass>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={sampleCommands}
        placeholder="Search commands..."
      />
    </MeshGradient>
  );
}

export default App;
