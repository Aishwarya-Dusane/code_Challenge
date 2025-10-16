import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResizableDraggablePanel from '../ResizableDraggablePanel';

describe('ResizableDraggablePanel', () => {
  const defaultProps = {
    id: 'panel1',
    title: 'Test Panel',
    content: <div>Panel Content</div>,
    x: 100,
    y: 100,
    width: 300,
    height: 200,
    onClose: jest.fn(),
    onMove: jest.fn(),
    onResize: jest.fn(),
    onFocus: jest.fn(),
    zIndex: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title and content', () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Panel Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onFocus when panel is clicked', () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const panel = screen.getByText('Test Panel').parentElement?.parentElement!;
    fireEvent.mouseDown(panel);
    expect(defaultProps.onFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onMove callback on drag', () => {
    render(<ResizableDraggablePanel {...defaultProps} />);
    const header = screen.getByText('Test Panel').parentElement!;
    
    // Simulate mousedown to start drag
    fireEvent.mouseDown(header, { clientX: 10, clientY: 10 });

    // Simulate mousemove
    fireEvent.mouseMove(window, { clientX: 15, clientY: 20 });
    expect(defaultProps.onMove).toHaveBeenCalledWith(5, 10);

    // Simulate mouseup to stop drag
    fireEvent.mouseUp(window);
  });

});
