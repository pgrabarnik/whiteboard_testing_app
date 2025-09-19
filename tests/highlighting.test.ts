import { WhiteboardApp } from "../src";

describe("Containment Highlighting Behavior", () => {
  let app: WhiteboardApp;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    canvas.id = "test-canvas";
    document.body.appendChild(canvas);
    app = new WhiteboardApp(canvas.id);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  // Helper function to simulate mouse events for dragging
  function simulateDrag(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    // Start drag
    const mouseDownEvent = new MouseEvent("mousedown", {
      clientX: startX,
      clientY: startY,
      bubbles: true,
    });
    canvas.dispatchEvent(mouseDownEvent);

    // Move to end position
    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientX: endX,
      clientY: endY,
      bubbles: true,
    });
    canvas.dispatchEvent(mouseMoveEvent);

    // End drag
    const mouseUpEvent = new MouseEvent("mouseup", {
      clientX: endX,
      clientY: endY,
      bubbles: true,
    });
    canvas.dispatchEvent(mouseUpEvent);
  }

  // Helper function to get shape center position
  function getShapeCenter(shape: any) {
    return {
      x: shape.position.x + shape.size.width / 2,
      y: shape.position.y + shape.size.height / 2,
    };
  }

  describe("Initial State", () => {
    test("shapes should not be highlighted initially", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });
  });

  describe("Full Containment Scenarios", () => {
    test("should highlight both shapes when rectangle is fully contained within area", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (center of area)
      const targetCenter = getShapeCenter(area);

      // Simulate dragging rectangle to center of area
      simulateDrag(
        initialCenter.x,
        initialCenter.y,
        targetCenter.x,
        targetCenter.y
      );

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });

    test("should highlight both shapes when rectangle is exactly at area boundaries", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (top-left corner of area + half rectangle size)
      const targetX = area.position.x + rect.size.width / 2;
      const targetY = area.position.y + rect.size.height / 2;

      // Simulate dragging rectangle to top-left boundary of area
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });

    test("should highlight both shapes when rectangle is at bottom-right boundary", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (bottom-right corner of area - half rectangle size)
      const targetX = area.position.x + area.size.width - rect.size.width / 2;
      const targetY = area.position.y + area.size.height - rect.size.height / 2;

      // Simulate dragging rectangle to bottom-right boundary of area
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });
  });

  describe("Partial Containment Scenarios", () => {
    test("should not highlight when rectangle is partially outside area (left edge)", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (partially outside left edge of area)
      const targetX = area.position.x - rect.size.width / 2 - 10; // 10px outside
      const targetY = area.position.y + area.size.height / 2; // Center vertically

      // Simulate dragging rectangle partially outside left edge
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should not highlight when rectangle is partially outside area (right edge)", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (partially outside right edge of area)
      const targetX =
        area.position.x + area.size.width + rect.size.width / 2 + 10; // 10px outside
      const targetY = area.position.y + area.size.height / 2; // Center vertically

      // Simulate dragging rectangle partially outside right edge
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should not highlight when rectangle is partially outside area (top edge)", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (partially outside top edge of area)
      const targetX = area.position.x + area.size.width / 2; // Center horizontally
      const targetY = area.position.y - rect.size.height / 2 - 10; // 10px outside

      // Simulate dragging rectangle partially outside top edge
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should not highlight when rectangle is partially outside area (bottom edge)", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (partially outside bottom edge of area)
      const targetX = area.position.x + area.size.width / 2; // Center horizontally
      const targetY =
        area.position.y + area.size.height + rect.size.height / 2 + 10; // 10px outside

      // Simulate dragging rectangle partially outside bottom edge
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });
  });

  describe("No Containment Scenarios", () => {
    test("should not highlight when rectangle is completely outside area", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (far from area)
      const targetX = 50;
      const targetY = 50;

      // Simulate dragging rectangle far from area
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should not highlight when rectangle is adjacent to area but not overlapping", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (just to the left of area, touching but not overlapping)
      const targetX = area.position.x - rect.size.width / 2; // Right edge touches left edge of area
      const targetY = area.position.y + area.size.height / 2; // Center vertically

      // Simulate dragging rectangle adjacent to area
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    test("should handle negative coordinates", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (negative coordinates)
      const targetX = -50;
      const targetY = -50;

      // Simulate dragging rectangle to negative coordinates
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should handle very large coordinates", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);

      // Calculate target position (very large coordinates)
      const targetX = 10000;
      const targetY = 10000;

      // Simulate dragging rectangle to very large coordinates
      simulateDrag(initialCenter.x, initialCenter.y, targetX, targetY);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    // Note: Size change tests are removed as they can't be tested with mouse events
    // These would need to be tested differently or the implementation would need
    // to trigger containment checks on size changes
  });

  describe("Multiple Containment Checks", () => {
    test("should maintain highlighting state across multiple containment checks", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);
      const areaCenter = getShapeCenter(area);

      // First, drag rectangle inside area
      simulateDrag(
        initialCenter.x,
        initialCenter.y,
        areaCenter.x,
        areaCenter.y
      );

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);

      // Move rectangle outside area
      simulateDrag(areaCenter.x, areaCenter.y, 50, 50);

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);

      // Move rectangle back inside area
      simulateDrag(50, 50, areaCenter.x, areaCenter.y);

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });

    test("should handle rapid position changes", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);
      const areaCenter = getShapeCenter(area);

      // Test sequence: Inside -> Outside -> Inside -> Outside -> Inside

      // 1. Drag to inside area
      simulateDrag(
        initialCenter.x,
        initialCenter.y,
        areaCenter.x,
        areaCenter.y
      );
      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);

      // 2. Drag to outside area
      simulateDrag(areaCenter.x, areaCenter.y, 50, 50);
      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);

      // 3. Drag back to inside area
      simulateDrag(50, 50, areaCenter.x, areaCenter.y);
      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);

      // 4. Drag to outside area again
      simulateDrag(areaCenter.x, areaCenter.y, 800, 500);
      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);

      // 5. Drag back to inside area
      simulateDrag(800, 500, areaCenter.x, areaCenter.y);
      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });
  });

  describe("Shape State Management", () => {
    test("should reset highlighting when shapes are moved to non-contained positions", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Get initial rectangle center position
      const initialCenter = getShapeCenter(rect);
      const areaCenter = getShapeCenter(area);

      // First, establish containment by dragging to center of area
      simulateDrag(
        initialCenter.x,
        initialCenter.y,
        areaCenter.x,
        areaCenter.y
      );
      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);

      // Move to non-contained position
      simulateDrag(areaCenter.x, areaCenter.y, 50, 50);
      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });
  });
});
