# Contributing to Blip Monitor

First off, thank you for considering contributing to Blip Monitor! It's people like you that make Blip Monitor such a great tool.

## Table of Contents

- [Development Setup](#development-setup)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/BlipMonitor/ui.git
   cd ui
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables as needed.

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

## Development Process

1. **Branch Naming Convention**
   - Feature: `feature/description`
   - Bug Fix: `fix/description`
   - Documentation: `docs/description`
   - Performance: `perf/description`

2. **Commit Message Format**
   ```
   type(scope): description

   [optional body]

   [optional footer]
   ```
   Types: feat, fix, docs, style, refactor, perf, test, chore

3. **Code Quality**
   - Run linter: `pnpm lint`
   - Run type check: `pnpm type-check`
   - Run tests: `pnpm test`
   - Format code: `pnpm format`

## Pull Request Process

1. **Before Submitting**
   - Update documentation
   - Add/update tests
   - Run all checks locally
   - Rebase on main

2. **PR Template**
   - Clear description of changes
   - Link to related issue
   - Screenshots for UI changes
   - List of testing steps

3. **Review Process**
   - Two approvals required
   - All checks must pass
   - No merge conflicts

## Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Strict mode enabled
- Explicit return types for functions
- Interface over type when possible

### React
- Functional components with hooks
- Props interface for each component
- Early returns for conditionals
- Avoid inline styles

### CSS/Tailwind
- Follow utility-first approach
- Use design tokens
- Mobile-first responsive design
- Custom classes in globals.css

### Testing
- Jest for unit tests
- React Testing Library for components
- Cypress for E2E tests
- 80% coverage minimum

## Documentation

- JSDoc for components and functions
- README for each major directory
- Update docs with code changes
- Clear, concise commit messages

## Release Process

1. **Version Bump**
   - Update CHANGELOG.md with all changes since last release
   - Update package.json version
   - Update version references in documentation
   - Create version commit with format `chore: bump version to vX.Y.Z`

2. **Release Checklist**
   - All tests passing
   - Documentation updated (README.md, SECURITY.md)
   - CHANGELOG.md updated with proper date
   - All changes since last release documented
   - Mock data generators working correctly
   - All components have proper loading states

3. **Deploy Process**
   - Create git tag with format `vX.Y.Z`
   - Push tag to origin
   - Create GitHub release with CHANGELOG content
   - Deploy to staging environment
   - Verify all features with mock data
   - Deploy to production

## Questions?

Feel free to open an issue or reach out on Discord if you have any questions! 