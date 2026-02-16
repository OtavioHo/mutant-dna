# Frontend Tests

Comprehensive test suite for the DNA Mutant Detector frontend application.

## Test Structure

```
tests/
├── setup.ts                          # Test configuration and global setup
├── utils/                           # Utility function tests
│   └── dna.utils.test.ts
├── components/                      # Component tests
│   ├── ui/
│   │   ├── Button.test.tsx
│   │   ├── TextArea.test.tsx
│   │   └── Message.test.tsx
│   └── DnaMatrix.test.tsx
├── api/                            # API hook tests
│   ├── mutants.test.ts
│   └── stats.test.ts
└── features/                       # Feature tests
    ├── mutant-detector/
    │   ├── hooks/
    │   │   └── useMutantDetector.test.ts
    │   └── components/
    │       ├── ValidationMessage.test.tsx
    │       ├── LoadingMessage.test.tsx
    │       ├── ErrorMessage.test.tsx
    │       └── ResultMessage.test.tsx
    └── stats/
        ├── hooks/
        │   └── useStats.test.ts
        └── components/
            ├── StatsCard.test.tsx
            ├── StatsGrid.test.tsx
            ├── StatsLoading.test.tsx
            └── StatsError.test.tsx
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite covers:

- ✅ Utility functions (DNA validation, parsing, filtering)
- ✅ UI components (Button, TextArea, Message)
- ✅ Feature components (DnaMatrix, Stats cards, Messages)
- ✅ Custom hooks (useMutantDetector, useStats)
- ✅ API hooks (useCheckMutant, useFetchStats)
- ✅ Accessibility (ARIA attributes, screen reader support)
- ✅ User interactions (clicks, inputs, form submissions)
- ✅ Error handling and edge cases

## Technologies

- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom DOM matchers
- **jsdom** - DOM implementation for Node.js

## Best Practices

1. Tests follow AAA pattern (Arrange, Act, Assert)
2. Focus on user behavior over implementation details
3. Use accessible queries (getByRole, getByLabelText)
4. Mock external dependencies
5. Test edge cases and error states
6. Maintain high code coverage

## Installation

Install test dependencies:

```bash
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
