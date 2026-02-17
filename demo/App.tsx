import React from 'react';
import {
  Glass,
  GlassCard,
  GlassButton,
  GlassInput,
  MeshGradient,
  MeshGradientCard,
} from '../src';

function App() {
  const [inputValue, setInputValue] = React.useState('');

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
        </div>

        {/* Buttons Showcase */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Glass Buttons</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <GlassButton variant="primary">Primary</GlassButton>
            <GlassButton variant="secondary">Secondary</GlassButton>
            <GlassButton variant="ghost">Ghost</GlassButton>
          </div>
        </div>

        {/* Input Showcase */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Glass Input</h2>
          <div className="max-w-md mx-auto">
            <GlassInput
              label="Enter your email"
              placeholder="hello@example.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
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
    </MeshGradient>
  );
}

export default App;
