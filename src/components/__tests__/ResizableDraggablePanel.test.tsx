import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ResizableDraggablePanel from '../ResizableDraggablePanel';

describe('ResizableDraggablePanel', () => {
  const defaultProps = {
    id: 'panel1',
    title: 'Test Panel',
    content: <div>Panel Content</div>,
    x: 50,
    y: 50,
    width: 300,
    height: 200,
    minWidth: 200,
    minHeight: 100,
    zIndex: 1000,
    onClose: jest.fn(),
    onMove: jest.fn(),
    onResize: jest.fn(),
    onFocus: jest.fn(),
    containerSize: { width: 500, height: 400 },
  };

  it('renders at the correct position', () => {
    const { getByText } = render(<ResizableDraggablePanel {...defaultProps} />);
    const panel = getByText('Test Panel').parentElement;
    expect(panel).toHaveStyle(`left: ${defaultProps.x}px`);
    expect(panel).toHaveStyle(`top: ${defaultProps.y}px`);
  });

  it('does not move outside the workspace bounds', () => {
    const onMove = jest.fn();
    const { getByText } = render(
      <ResizableDraggablePanel {...defaultProps} onMove={onMove} />
    );
    const panel = getByText('Test Panel').parentElement;

    // Simulate drag to negative coordinates (should clamp to 0)
    fireEvent.mouseDown(panel!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(window, { clientX: -100, clientY: -100 });
    fireEvent.mouseUp(window);

    // The onMove callback should be called with clamped values
    expect(onMove).toHaveBeenCalled();
    const [newX, newY] = onMove.mock.calls[0];
    expect(newX).toBeGreaterThanOrEqual(0);
    expect(newY).toBeGreaterThanOrEqual(0);

    // Simulate drag to outside right/bottom bounds
    fireEvent.mouseDown(panel!, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(window, { clientX: 1000, clientY: 1000 });
    fireEvent.mouseUp(window);

    const [newX2, newY2] = onMove.mock.calls[1];
    expect(newX2).toBeLessThanOrEqual(defaultProps.containerSize.width - defaultProps.width);
    expect(newY2).toBeLessThanOrEqual(defaultProps.containerSize.height - defaultProps.height);
  });
});