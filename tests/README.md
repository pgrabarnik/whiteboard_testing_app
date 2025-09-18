# Testing Documentation for Containment Behavior

## Overview

This test suite provides comprehensive coverage for the shape containment functionality in the whiteboard application. The tests cover unit-level logic, integration behavior, and simulated user interactions.

## Test Structure

### 1. Unit Tests (`containment.test.ts`)

**Focus**: Shape-level containment logic

**Test Cases**:

- ✅ Rectangle fully inside area (basic positive case)
- ✅ Rectangle extending beyond boundaries (basic negative case)
- ✅ Rectangle completely outside area (negative case)
- ✅ Exact boundary matching (edge case)
- ✅ Single pixel overflow (precision edge case)
- ✅ Negative coordinates (coordinate system edge case)
- ✅ Zero-sized shapes (degenerate case)
- ✅ Partial overlap scenarios (common user case)
- ✅ Area-within-area containment (nested containers)

**Edge Cases Covered**:

- Boundary conditions (exact fits)
- Precision errors (1px differences)
- Coordinate system edge cases (negatives, zeros)
- Degenerate shapes (zero size)
- Multiple containment relationships

### 2. Whiteboard Integration Tests (`whiteboard-containment.test.ts`)

**Focus**: Whiteboard-level containment checking behavior

**Test Cases**:

- ✅ Highlighting both shapes during containment
- ✅ No highlighting when no containment exists
- ✅ Resetting highlighting when containment ends
- ✅ Multiple shapes with complex relationships
- ✅ Identical shapes (mutual containment)

**Mock Strategy**:

- Custom MockShape class with highlight tracking
- Verifies actual highlighting calls and state changes
- Tests the checkContainment() method behavior in isolation

### 3. Drag Integration Tests (`drag-integration.test.ts`)

**Focus**: Real user interaction simulation with mouse events

**Test Cases**:

- ✅ Containment checking during drag operations
- ✅ Highlighting when dragged into containment
- ✅ Removing highlighting when dragged out
- ✅ Partial containment handling (no highlighting)
- ✅ Mouse leave event during drag
- ✅ Boundary position dragging (exact edge cases)
- ✅ Multi-container scenarios

**Mouse Event Simulation**:

- Realistic MouseEvent creation with coordinates
- Canvas getBoundingClientRect mocking
- Full drag sequence testing (mousedown → mousemove → mouseup)
- Edge case event handling (mouseleave)

## Key Testing Features

### 🎯 **Comprehensive Edge Cases**

- **Boundary Precision**: Tests exact pixel boundaries and 1px overflow
- **Coordinate Systems**: Negative coordinates and zero-sized shapes
- **Complex Scenarios**: Multiple overlapping containers
- **Event Handling**: Mouse leave, partial drags, boundary positioning

### 🔍 **Behavior Verification**

- **Highlighting State**: Tracks actual `setHighlighted()` calls
- **Timing**: Verifies when containment checks occur (during drag, on mouse up)
- **Multi-shape**: Tests complex scenarios with 3+ shapes
- **Reset Logic**: Ensures highlighting clears properly

### 🎮 **Realistic Interaction Simulation**

- **Mouse Coordinates**: Precise pixel-level positioning
- **Drag Sequences**: Complete user interaction flows
- **Canvas Integration**: Mocked canvas with proper event handling
- **Edge Events**: Mouse leave, boundary dragging

## Running the Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npx jest containment.test.ts
npx jest whiteboard-containment.test.ts
npx jest drag-integration.test.ts
```

## Expected Outcomes

All tests should pass and verify:

- ✅ Correct mathematical containment detection
- ✅ Proper highlighting state management
- ✅ Accurate mouse event handling
- ✅ Edge case robustness
- ✅ Multi-shape scenario handling

The test suite ensures the containment behavior works correctly across all user scenarios and edge cases.
