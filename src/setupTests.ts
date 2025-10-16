// src/setupTests.ts

// 1. Import jest-dom matchers for extended expect()
import '@testing-library/jest-dom';

// 2. Mock window.matchMedia (needed for some UI libs)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),       // deprecated, but some libs might use it
    removeListener: jest.fn(),    // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
