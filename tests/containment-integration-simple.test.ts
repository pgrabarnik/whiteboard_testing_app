import { Whiteboard } from "../src/whiteboard/Whiteboard";
import { Rectangle } from "../src/shapes/Rectangle";
import { Area } from "../src/shapes/Area";
import { Renderer } from "../src/renderer/Renderer";

describe("Containment Integration Tests (Simplified)", () => {
  let whiteboard: Whiteboard;
  let renderer: Renderer;
  let canvas: HTMLCanvasElement;
  let rectangle: Rectangle;
  let area: Area;

  beforeEach(() => {
    // Setup DOM and canvas
    canvas = document.createElement("canvas");
    canvas.id = "test-canvas";
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    renderer = new Renderer("test-canvas");
    whiteboard = new Whiteboard(renderer);

    // Create test shapes
    area = new Area(
      renderer,
      "test-area",
      { x: 100, y: 100 },
      { width: 200, height: 200 }
    );
    rectangle = new Rectangle(
      renderer,
      "test-rect",
      { x: 50, y: 50 },
      { width: 50, height: 50 }
    );

    whiteboard.addShape(area);
    whiteboard.addShape(rectangle);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Position-based Containment Tests", () => {
    it("should highlight shapes when rectangle is moved into containment", () => {
      // Spy on highlighting methods
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");

      // Move rectangle to be fully contained within area
      // Area is at (100, 100) -> (300, 300) [200x200]
      // Moving rectangle to (150, 150) -> (200, 200) [50x50] (fully contained)
      rectangle.setPosition({ x: 150, y: 150 });

      // Manually trigger containment check (simulating what happens during drag)
      (whiteboard as any).checkContainment();

      // Verify highlighting was triggered
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(true);
      expect(areaHighlightSpy).toHaveBeenCalledWith(true);
    });

    it("should remove highlighting when rectangle is moved out of containment", () => {
      // First, put rectangle in containment
      rectangle.setPosition({ x: 150, y: 150 });
      (whiteboard as any).checkContainment();

      // Spy on highlighting methods after initial setup
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");

      // Move rectangle outside the area
      rectangle.setPosition({ x: 350, y: 350 });

      // Manually trigger containment check
      (whiteboard as any).checkContainment();

      // Verify highlighting was removed
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(false);
      expect(areaHighlightSpy).toHaveBeenCalledWith(false);
    });

    it("should not highlight shapes for partial containment", () => {
      // Spy on highlighting methods
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");

      // Move rectangle to partially overlap with area but not be fully contained
      // Area is at (100, 100) -> (300, 300) [200x200]
      // Moving rectangle to (80, 80) -> (130, 130) [50x50] (partially overlapping)
      rectangle.setPosition({ x: 80, y: 80 });

      // Manually trigger containment check
      (whiteboard as any).checkContainment();

      // Verify no highlighting occurs for partial containment
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(false);
      expect(areaHighlightSpy).toHaveBeenCalledWith(false);
    });

    it("should handle edge case: rectangle exactly at boundary", () => {
      // Spy on highlighting methods
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");

      // Move rectangle to be exactly at the boundary of the area
      // Area is at (100, 100) -> (300, 300) [200x200]
      // Moving rectangle to (250, 250) -> (300, 300) [50x50] (exactly at boundary)
      rectangle.setPosition({ x: 250, y: 250 });

      // Manually trigger containment check
      (whiteboard as any).checkContainment();

      // Verify highlighting occurs for boundary containment
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(true);
      expect(areaHighlightSpy).toHaveBeenCalledWith(true);
    });

    it("should handle multiple containment scenarios", () => {
      // Add another smaller area inside the main area
      const smallArea = new Area(
        renderer,
        "small-area",
        { x: 120, y: 120 },
        { width: 60, height: 60 }
      );
      whiteboard.addShape(smallArea);

      // Spy on highlighting methods
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");
      const smallAreaHighlightSpy = jest.spyOn(smallArea, "setHighlighted");

      // Move rectangle to be contained in both areas
      // Small area is at (120, 120) -> (180, 180) [60x60]
      // Moving rectangle to (130, 130) -> (180, 180) [50x50] (fully contained in both)
      rectangle.setPosition({ x: 130, y: 130 });

      // Manually trigger containment check
      (whiteboard as any).checkContainment();

      // All shapes should be highlighted due to containment relationships
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(true);
      expect(areaHighlightSpy).toHaveBeenCalledWith(true);
      expect(smallAreaHighlightSpy).toHaveBeenCalledWith(true);
    });
  });
});
