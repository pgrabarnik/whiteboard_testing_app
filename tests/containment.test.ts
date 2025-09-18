import { Rectangle } from "../src/shapes/Rectangle";
import { Area } from "../src/shapes/Area";
import { Renderer } from "../src/renderer/Renderer";

describe("Shape Containment Logic", () => {
  let renderer: Renderer;

  beforeEach(() => {
    // Mock canvas element
    const mockCanvas = document.createElement("canvas");
    mockCanvas.id = "test-canvas";
    document.body.appendChild(mockCanvas);

    renderer = new Renderer("test-canvas");
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Rectangle.isFullyContainedWithin", () => {
    it("should return true when rectangle is fully inside area", () => {
      // Area: (10, 10) -> (110, 110) [100x100]
      const area = new Area(
        renderer,
        "area1",
        { x: 10, y: 10 },
        { width: 100, height: 100 }
      );

      // Rectangle: (20, 20) -> (70, 70) [50x50] - fully inside
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 20, y: 20 },
        { width: 50, height: 50 }
      );

      expect(rectangle.isFullyContainedWithin(area)).toBe(true);
    });

    it("should return false when rectangle extends beyond area boundaries", () => {
      // Area: (10, 10) -> (110, 110) [100x100]
      const area = new Area(
        renderer,
        "area1",
        { x: 10, y: 10 },
        { width: 100, height: 100 }
      );

      // Rectangle: (50, 50) -> (150, 100) [100x50] - extends right
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 50, y: 50 },
        { width: 100, height: 50 }
      );

      expect(rectangle.isFullyContainedWithin(area)).toBe(false);
    });

    it("should return false when rectangle is completely outside area", () => {
      // Area: (10, 10) -> (110, 110) [100x100]
      const area = new Area(
        renderer,
        "area1",
        { x: 10, y: 10 },
        { width: 100, height: 100 }
      );

      // Rectangle: (150, 150) -> (200, 200) [50x50] - completely outside
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 150, y: 150 },
        { width: 50, height: 50 }
      );

      expect(rectangle.isFullyContainedWithin(area)).toBe(false);
    });

    it("should handle edge case: rectangle touching area boundary from inside", () => {
      // Area: (0, 0) -> (100, 100) [100x100]
      const area = new Area(
        renderer,
        "area1",
        { x: 0, y: 0 },
        { width: 100, height: 100 }
      );

      // Rectangle: (0, 0) -> (100, 100) [100x100] - exactly same size
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 0, y: 0 },
        { width: 100, height: 100 }
      );

      expect(rectangle.isFullyContainedWithin(area)).toBe(true);
    });

    it("should handle edge case: rectangle extending by 1 pixel", () => {
      // Area: (0, 0) -> (100, 100) [100x100]
      const area = new Area(
        renderer,
        "area1",
        { x: 0, y: 0 },
        { width: 100, height: 100 }
      );

      // Rectangle: (0, 0) -> (101, 100) [101x100] - 1px too wide
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 0, y: 0 },
        { width: 101, height: 100 }
      );

      expect(rectangle.isFullyContainedWithin(area)).toBe(false);
    });

    it("should handle negative coordinates", () => {
      // Area: (-50, -50) -> (50, 50) [100x100]
      const area = new Area(
        renderer,
        "area1",
        { x: -50, y: -50 },
        { width: 100, height: 100 }
      );

      // Rectangle: (-30, -30) -> (-10, -10) [20x20] - fully inside
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: -30, y: -30 },
        { width: 20, height: 20 }
      );

      expect(rectangle.isFullyContainedWithin(area)).toBe(true);
    });

    it("should handle zero-sized shapes", () => {
      // Area: (10, 10) -> (110, 110) [100x100]
      const area = new Area(
        renderer,
        "area1",
        { x: 10, y: 10 },
        { width: 100, height: 100 }
      );

      // Rectangle: (50, 50) -> (50, 50) [0x0] - point inside
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 50, y: 50 },
        { width: 0, height: 0 }
      );

      expect(rectangle.isFullyContainedWithin(area)).toBe(true);
    });

    it("should handle partial overlap scenarios", () => {
      // Area: (10, 10) -> (60, 60) [50x50]
      const area = new Area(
        renderer,
        "area1",
        { x: 10, y: 10 },
        { width: 50, height: 50 }
      );

      // Rectangle: (5, 15) -> (55, 45) [50x30] - partial left overlap
      const rectangle = new Rectangle(
        renderer,
        "rect1",
        { x: 5, y: 15 },
        { width: 50, height: 30 }
      );

      expect(rectangle.isFullyContainedWithin(area)).toBe(false);
    });
  });

  describe("Area.isFullyContainedWithin", () => {
    it("should allow area to be contained within larger area", () => {
      // Large area: (0, 0) -> (200, 200) [200x200]
      const largeArea = new Area(
        renderer,
        "large",
        { x: 0, y: 0 },
        { width: 200, height: 200 }
      );

      // Small area: (50, 50) -> (150, 150) [100x100] - inside large area
      const smallArea = new Area(
        renderer,
        "small",
        { x: 50, y: 50 },
        { width: 100, height: 100 }
      );

      expect(smallArea.isFullyContainedWithin(largeArea)).toBe(true);
    });
  });
});
