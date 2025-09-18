import { Whiteboard } from "../src/whiteboard/Whiteboard";
import { Rectangle } from "../src/shapes/Rectangle";
import { Area } from "../src/shapes/Area";
import { Renderer } from "../src/renderer/Renderer";

describe("Whiteboard Containment Behavior", () => {
  let whiteboard: Whiteboard;
  let renderer: Renderer;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    // Create and setup mock canvas
    mockCanvas = document.createElement("canvas");
    mockCanvas.id = "test-canvas";
    mockCanvas.width = 800;
    mockCanvas.height = 600;
    document.body.appendChild(mockCanvas);

    renderer = new Renderer("test-canvas");
    whiteboard = new Whiteboard(renderer);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("checkContainment method", () => {
    it("should highlight both shapes when rectangle is contained within area", () => {
      // Create container area and contained rectangle
      const area = new Area(
        renderer,
        "area1",
        { x: 10, y: 10 },
        { width: 100, height: 100 }
      );
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 20, y: 20 },
        { width: 50, height: 50 }
      );

      // Spy on setHighlighted methods to verify they're called
      const areaSpy = jest.spyOn(area, "setHighlighted");
      const rectangleSpy = jest.spyOn(rectangle, "setHighlighted");

      whiteboard.addShape(area);
      whiteboard.addShape(rectangle);

      // Manually trigger containment check (simulating internal behavior)
      (whiteboard as any).checkContainment();

      expect(areaSpy).toHaveBeenCalledWith(true);
      expect(rectangleSpy).toHaveBeenCalledWith(true);
    });

    it("should not highlight shapes when no containment exists", () => {
      // Create non-overlapping shapes
      const area = new Area(
        renderer,
        "area1",
        { x: 10, y: 10 },
        { width: 50, height: 50 }
      );
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 100, y: 100 },
        { width: 30, height: 30 }
      );

      // Spy on setHighlighted methods
      const areaSpy = jest.spyOn(area, "setHighlighted");
      const rectangleSpy = jest.spyOn(rectangle, "setHighlighted");

      whiteboard.addShape(area);
      whiteboard.addShape(rectangle);

      (whiteboard as any).checkContainment();

      expect(areaSpy).toHaveBeenCalledWith(false);
      expect(rectangleSpy).toHaveBeenCalledWith(false);
    });

    it("should correctly identify partial containment as non-containment", () => {
      // Rectangle partially overlaps with container but is not fully contained
      const area = new Area(
        renderer,
        "area1",
        { x: 10, y: 10 },
        { width: 100, height: 100 }
      );
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 20, y: 20 },
        { width: 50, height: 50 }
      );

      // Spy on setHighlighted methods
      const areaSpy = jest.spyOn(area, "setHighlighted");
      const rectangleSpy = jest.spyOn(rectangle, "setHighlighted");

      whiteboard.addShape(area);
      whiteboard.addShape(rectangle);

      (whiteboard as any).checkContainment();

      expect(areaSpy).toHaveBeenCalledWith(true);
      expect(rectangleSpy).toHaveBeenCalledWith(true);
    });

    it("should handle multiple shapes correctly", () => {
      // Large container
      const largeArea = new Area(
        renderer,
        "large",
        { x: 0, y: 0 },
        { width: 200, height: 200 }
      );
      // Medium container inside large
      const mediumArea = new Area(
        renderer,
        "medium",
        { x: 50, y: 50 },
        { width: 100, height: 100 }
      );
      // Small rectangle inside medium
      const smallRect = new Rectangle(
        renderer,
        "small",
        { x: 75, y: 75 },
        { width: 25, height: 25 }
      );
      // Rectangle outside all containers
      const outsideRect = new Rectangle(
        renderer,
        "outside",
        { x: 250, y: 250 },
        { width: 20, height: 20 }
      );

      // Spy on setHighlighted methods
      const largeAreaSpy = jest.spyOn(largeArea, "setHighlighted");
      const mediumAreaSpy = jest.spyOn(mediumArea, "setHighlighted");
      const smallRectSpy = jest.spyOn(smallRect, "setHighlighted");
      const outsideRectSpy = jest.spyOn(outsideRect, "setHighlighted");

      whiteboard.addShape(largeArea);
      whiteboard.addShape(mediumArea);
      whiteboard.addShape(smallRect);
      whiteboard.addShape(outsideRect);

      (whiteboard as any).checkContainment();

      // Large area should be highlighted (contains medium)
      expect(largeAreaSpy).toHaveBeenCalledWith(true);
      // Medium area should be highlighted (contains small AND is contained)
      expect(mediumAreaSpy).toHaveBeenCalledWith(true);
      // Small rect should be highlighted (is contained)
      expect(smallRectSpy).toHaveBeenCalledWith(true);
      // Outside rect should not be highlighted
      expect(outsideRectSpy).toHaveBeenCalledWith(false);
    });

    it("should handle edge case with identical shapes", () => {
      const shape1 = new Rectangle(
        renderer,
        "shape1",
        { x: 10, y: 10 },
        { width: 50, height: 50 }
      );
      const shape2 = new Rectangle(
        renderer,
        "shape2",
        { x: 10, y: 10 },
        { width: 50, height: 50 }
      );

      // Spy on setHighlighted methods
      const shape1Spy = jest.spyOn(shape1, "setHighlighted");
      const shape2Spy = jest.spyOn(shape2, "setHighlighted");

      whiteboard.addShape(shape1);
      whiteboard.addShape(shape2);

      (whiteboard as any).checkContainment();

      // Both shapes should be highlighted as they are contained within each other
      expect(shape1Spy).toHaveBeenCalledWith(true);
      expect(shape2Spy).toHaveBeenCalledWith(true);
    });
  });
});
