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

      // Move rectangle to be fully contained within area
      // Area is at (400, 150) with size (350, 300)
      // Rectangle is at (200, 260) with size (120, 80)
      // Move rectangle to (450, 200) to be inside area
      rect.setPosition({ x: 450, y: 200 });

      // Trigger containment check (this would be called during drag operations)
      // Note: This test assumes the implementation will call some method to check containment
      // The actual implementation details are not tested here

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });

    test("should highlight both shapes when rectangle is exactly at area boundaries", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle exactly at the top-left corner of area
      // Area: (400, 150) with size (350, 300)
      // Rectangle: (120, 80) size
      rect.setPosition({ x: 400, y: 150 });

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });

    test("should highlight both shapes when rectangle is at bottom-right boundary", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle at bottom-right corner of area
      // Area: (400, 150) with size (350, 300) -> ends at (750, 450)
      // Rectangle: (120, 80) size
      // Position rectangle so it ends exactly at area boundary: (750-120, 450-80) = (630, 370)
      rect.setPosition({ x: 630, y: 370 });

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });
  });

  describe("Partial Containment Scenarios", () => {
    test("should not highlight when rectangle is partially outside area (left edge)", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle so it's partially outside the left edge
      // Area: (400, 150) with size (350, 300)
      // Rectangle: (120, 80) size
      // Position at (350, 200) so left edge is outside area
      rect.setPosition({ x: 350, y: 200 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should not highlight when rectangle is partially outside area (right edge)", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle so it's partially outside the right edge
      // Area: (400, 150) with size (350, 300) -> ends at (750, 450)
      // Rectangle: (120, 80) size
      // Position at (700, 200) so right edge extends beyond area
      rect.setPosition({ x: 700, y: 200 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should not highlight when rectangle is partially outside area (top edge)", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle so it's partially outside the top edge
      // Area: (400, 150) with size (350, 300)
      // Rectangle: (120, 80) size
      // Position at (500, 100) so top edge is outside area
      rect.setPosition({ x: 500, y: 100 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should not highlight when rectangle is partially outside area (bottom edge)", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle so it's partially outside the bottom edge
      // Area: (400, 150) with size (350, 300) -> ends at (750, 450)
      // Rectangle: (120, 80) size
      // Position at (500, 400) so bottom edge extends beyond area
      rect.setPosition({ x: 500, y: 400 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });
  });

  describe("No Containment Scenarios", () => {
    test("should not highlight when rectangle is completely outside area", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle far from area
      rect.setPosition({ x: 50, y: 50 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should not highlight when rectangle is adjacent to area but not overlapping", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle just to the left of area (touching but not overlapping)
      // Area: (400, 150) with size (350, 300)
      // Rectangle: (120, 80) size
      // Position at (280, 200) so right edge touches left edge of area
      rect.setPosition({ x: 280, y: 200 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    test("should handle zero-sized rectangle", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Set rectangle size to zero
      rect.setSize({ width: 0, height: 0 });
      rect.setPosition({ x: 500, y: 200 }); // Center of area

      // A zero-sized rectangle should be considered contained
      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });

    test("should handle rectangle with same size as area", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Make rectangle same size as area and position it exactly on top
      rect.setSize({ width: 350, height: 300 });
      rect.setPosition({ x: 400, y: 150 }); // Same position as area

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });

    test("should handle rectangle larger than area", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Make rectangle larger than area
      rect.setSize({ width: 400, height: 350 });
      rect.setPosition({ x: 400, y: 150 }); // Same position as area

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should handle negative coordinates", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle at negative coordinates
      rect.setPosition({ x: -50, y: -50 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should handle very large coordinates", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle at very large coordinates
      rect.setPosition({ x: 10000, y: 10000 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });
  });

  describe("Multiple Containment Checks", () => {
    test("should maintain highlighting state across multiple containment checks", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // First, position rectangle inside area
      rect.setPosition({ x: 500, y: 200 });

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);

      // Move rectangle outside area
      rect.setPosition({ x: 50, y: 50 });

      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);

      // Move rectangle back inside area
      rect.setPosition({ x: 500, y: 200 });

      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });

    test("should handle rapid position changes", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      const positions = [
        { x: 500, y: 200 }, // Inside
        { x: 50, y: 50 }, // Outside
        { x: 450, y: 180 }, // Inside
        { x: 800, y: 500 }, // Outside
        { x: 500, y: 200 }, // Inside
      ];

      const expectedResults = [
        { rect: true, area: true },
        { rect: false, area: false },
        { rect: true, area: true },
        { rect: false, area: false },
        { rect: true, area: true },
      ];

      positions.forEach((position, index) => {
        rect.setPosition(position);
        expect(rect.isHighlighted()).toBe(expectedResults[index].rect);
        expect(area.isHighlighted()).toBe(expectedResults[index].area);
      });
    });
  });

  describe("Shape State Management", () => {
    test("should reset highlighting when shapes are moved to non-contained positions", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // First, establish containment
      rect.setPosition({ x: 500, y: 200 });
      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);

      // Move to non-contained position
      rect.setPosition({ x: 50, y: 50 });
      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);
    });

    test("should handle shape size changes affecting containment", () => {
      const rect = app.getShapeById("rect")!;
      const area = app.getShapeById("area")!;

      // Position rectangle inside area
      rect.setPosition({ x: 500, y: 200 });
      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);

      // Make rectangle larger so it's no longer contained
      rect.setSize({ width: 400, height: 350 });
      expect(rect.isHighlighted()).toBe(false);
      expect(area.isHighlighted()).toBe(false);

      // Make rectangle smaller so it's contained again
      rect.setSize({ width: 50, height: 50 });
      expect(rect.isHighlighted()).toBe(true);
      expect(area.isHighlighted()).toBe(true);
    });
  });
});
