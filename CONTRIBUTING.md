# Contributing to AetherUI

Thank you for your interest in contributing to AetherUI! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Git

### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/aetherui.git
cd aetherui

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test
```

## Development Workflow

1. **Fork and Branch**: Create a branch for your work
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Implement your feature or fix

3. **Test Your Changes**:
   ```bash
   # Run tests
   pnpm test

   # Run tests with coverage
   pnpm test:coverage

   # Type check
   pnpm type-check
   ```

4. **Build Library**:
   ```bash
   pnpm build
   ```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide proper type definitions
- Avoid `any` types
- Use JSDoc comments for public APIs

```tsx
/**
 * Button component with glassmorphism effect
 * @param variant - The visual style variant
 * @param onClick - Click handler callback
 */
export function GlassButton({ variant, onClick }: GlassButtonProps) {
  // implementation
}
```

### Component Structure

```
src/
├── components/
│   └── ComponentName/
│       ├── index.tsx        # Main component
│       ├── types.ts         # TypeScript types (if complex)
│       └── styles.css       # Component-specific styles (if needed)
├── hooks/
│   └── useHookName.ts
├── utils/
│   └── utilName.ts
└── index.ts                 # Main exports
```

### Naming Conventions

- **Components**: PascalCase (`GlassCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useHover.ts`)
- **Utilities**: camelCase (`generateMeshGradient.ts`)
- **Types**: PascalCase (`GlassProps`)

### Code Style

- Use 2 spaces for indentation
- Prefer functional components with hooks
- Use forwardRef for components that need ref support
- Include proper error handling

```tsx
// Good
export const MyComponent = forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }, ref) => {
    try {
      // component logic
    } catch (error) {
      console.error('MyComponent error:', error);
      return <ErrorFallback />;
    }
  }
);

MyComponent.displayName = 'MyComponent';
```

### Accessibility

- Use semantic HTML elements
- Include proper ARIA labels
- Support keyboard navigation
- Respect reduced motion preferences

```tsx
<button
  aria-label="Close dialog"
  onClick={onClose}
  onKeyDown={(e) => {
    if (e.key === 'Escape') onClose();
  }}
>
  ×
</button>
```

### Performance

- Use `useCallback` and `useMemo` for expensive computations
- Implement proper cleanup in `useEffect`
- Avoid unnecessary re-renders

```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  doSomething(dependency);
}, [dependency]);
```

## Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Tests pass locally
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] Types are properly exported
- [ ] No console errors or warnings
- [ ] Code follows style guidelines

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Types exported
```

## Reporting Issues

When reporting bugs, please include:

- **Version**: AetherUI version
- **Environment**: Browser, OS, Node version
- **Steps to Reproduce**: Clear reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Code Sample**: Minimal reproduction

### Issue Template

```markdown
**Version**: 0.1.0

**Environment**:
- Browser: Chrome 120
- OS: macOS 14
- React: 18.3.1

**Description**:
Brief description of the issue

**Steps to Reproduce**:
1. Step one
2. Step two

**Expected**:
What should happen

**Actual**:
What actually happens

**Code**:
```tsx
// Minimal reproduction
```
```

## Feature Requests

We welcome feature requests! Please:

1. Check existing issues first
2. Describe the use case clearly
3. Explain why it's important
4. Suggest a possible implementation

## Questions

For questions, please:
- Check the documentation first
- Search existing issues
- Start a discussion rather than an issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AetherUI!
