// EnrichmentPanel.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import EnrichmentPanel from '../EnrichmentPanel';

test('renders enrichment panel title', () => {
  render(<EnrichmentPanel fruit="banana" />);
  expect(screen.getByText(/banana enrichment/i)).toBeInTheDocument();
});
