import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';  // <-- Add this line
import AboutPanel from '../AboutPanel';

describe('AboutPanel', () => {
  it('renders the heading "About"', () => {
    render(<AboutPanel />);
    const heading = screen.getByRole('heading', { name: /about/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the welcome message with bold "fruteria"', () => {
    render(<AboutPanel />);
    const boldText = screen.getByText('fruteria', { selector: 'b' });
    expect(boldText).toBeInTheDocument();
  });

  it('renders the italicized made with emoji text', () => {
    render(<AboutPanel />);
    const italicText = screen.getByText(/Made with 🍌 and ❤️/i, { selector: 'i' });
    expect(italicText).toBeInTheDocument();
  });

  it('has the correct style on container div', () => {
    const { container } = render(<AboutPanel />);
    const div = container.firstChild;
    expect(div).toHaveStyle({
      padding: '24px',
      color: '#e0e0e0',
      fontFamily: 'monospace',
    });
  });
});
