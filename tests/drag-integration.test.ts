import { Whiteboard } from "../src/whiteboard/Whiteboard";
import { Rectangle } from "../src/shapes/Rectangle";
import { Area } from "../src/shapes/Area";
import { Renderer } from "../src/renderer/Renderer";

// Helper to create mouse events
function createMouseEvent(
  type: string,
  clientX: number,
  clientY: number,
  bubbles = true
): MouseEvent {
  return new MouseEvent(type, {
    clientX,
    clientY,
    bubbles,
    cancelable: true,
  });
}

describe("Drag and Drop Containment Integration", () => {
  let whiteboard: Whiteboard;
  let renderer: Renderer;
  let mockCanvas: HTMLCanvasElement;
  let whiteboardCanvas: HTMLCanvasElement;
  let rectangle: Rectangle;
  let area: Area;

  beforeEach(() => {
    // Setup DOM and canvas
    mockCanvas = document.createElement("canvas");
    mockCanvas.id = "test-canvas";
    mockCanvas.width = 800;
    mockCanvas.height = 600;

    // Mock getBoundingClientRect for mouse position calculation
    jest.spyOn(mockCanvas, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    document.body.appendChild(mockCanvas);

    renderer = new Renderer("test-canvas");
    whiteboard = new Whiteboard(renderer);
    whiteboardCanvas = renderer.getCanvasElement();

    // Create test shapes
    // Area: (100, 100) -> (300, 300) [200x200]
    area = new Area(
      renderer,
      "test-area",
      { x: 100, y: 100 },
      { width: 200, height: 200 }
    );
    // Rectangle: (50, 50) -> (100, 100) [50x50] - initially outside
    rectangle = new Rectangle(
      renderer,
      "test-rect",
      { x: 50, y: 50 },
      { width: 50, height: 50 }
    );

    // Add shapes to whiteboard
    whiteboard.addShape(area);
    whiteboard.addShape(rectangle);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Mouse Drag Simulation", () => {
    it("should trigger containment check during drag operation", () => {
      // Spy on the internal checkContainment method
      const checkContainmentSpy = jest.spyOn(
        whiteboard as any,
        "checkContainment"
      );

      // Start drag on rectangle (center of rectangle at 75, 75)
      const mouseDownEvent = createMouseEvent("mousedown", 75, 75);
      whiteboardCanvas.dispatchEvent(mouseDownEvent);

      // Verify drag started
      expect((whiteboard as any).dragState.getIsDragging()).toBe(true);
      expect((whiteboard as any).dragState.getDraggedShape()).toBe(rectangle);

      // Clear the spy call count from initial setup
      checkContainmentSpy.mockClear();

      // Drag rectangle to be contained within area (move to 150, 150)
      // This means rectangle will be at (125, 125) -> (175, 175) [50x50]
      const mouseMoveEvent = createMouseEvent("mousemove", 150, 150);
      whiteboardCanvas.dispatchEvent(mouseMoveEvent);

      // Verify containment check was called
      expect(checkContainmentSpy).toHaveBeenCalled();

      // End drag
      const mouseUpEvent = createMouseEvent("mouseup", 150, 150);
      whiteboardCanvas.dispatchEvent(mouseUpEvent);

      // Verify final containment check
      expect(checkContainmentSpy).toHaveBeenCalledTimes(2); // During move and on mouse up
    });

    it("should highlight shapes when dragged into containment", () => {
      // Mock the setHighlighted methods to track calls
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");

      // Start drag on rectangle
      const mouseDownEvent = createMouseEvent("mousedown", 75, 75);
      whiteboardCanvas.dispatchEvent(mouseDownEvent);

      // Drag rectangle to be fully contained within area
      // Rectangle center was at (75, 75), move it to (175, 175)
      // This will place rectangle at (150, 150) -> (200, 200) [50x50]
      // Which is fully within area bounds (100, 100) -> (300, 300)
      const mouseMoveEvent = createMouseEvent("mousemove", 175, 175);
      whiteboardCanvas.dispatchEvent(mouseMoveEvent);

      // End drag
      const mouseUpEvent = createMouseEvent("mouseup", 175, 175);
      whiteboardCanvas.dispatchEvent(mouseUpEvent);

      // Verify highlighting was triggered
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(true);
      expect(areaHighlightSpy).toHaveBeenCalledWith(true);
    });

    it("should remove highlighting when dragged out of containment", () => {
      // First, position rectangle inside area
      rectangle.setPosition({ x: 150, y: 150 }); // (150, 150) -> (200, 200) [50x50]

      // Mock highlighting methods
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");

      // Start drag on the contained rectangle
      const mouseDownEvent = createMouseEvent("mousedown", 175, 175);
      whiteboardCanvas.dispatchEvent(mouseDownEvent);

      // Drag rectangle outside area bounds
      // Move rectangle center to (400, 400), placing rectangle at (375, 375) -> (425, 425)
      const mouseMoveEvent = createMouseEvent("mousemove", 400, 400);
      whiteboardCanvas.dispatchEvent(mouseMoveEvent);

      // End drag
      const mouseUpEvent = createMouseEvent("mouseup", 400, 400);
      whiteboardCanvas.dispatchEvent(mouseUpEvent);

      // Verify highlighting was removed
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(false);
      expect(areaHighlightSpy).toHaveBeenCalledWith(false);
    });

    it("should handle partial containment correctly (not highlighting)", () => {
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");

      // Start drag
      const mouseDownEvent = createMouseEvent("mousedown", 75, 75);
      whiteboardCanvas.dispatchEvent(mouseDownEvent);

      // Drag to position where rectangle partially overlaps but is not fully contained
      // Move to (120, 120) so rectangle is at (95, 95) -> (145, 145) [50x50]
      // This partially overlaps area (100, 100) -> (300, 300) but is not fully contained
      const mouseMoveEvent = createMouseEvent("mousemove", 120, 120);
      whiteboardCanvas.dispatchEvent(mouseMoveEvent);

      // End drag
      const mouseUpEvent = createMouseEvent("mouseup", 120, 120);
      whiteboardCanvas.dispatchEvent(mouseUpEvent);

      // Verify no highlighting occurs for partial containment
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(false);
      expect(areaHighlightSpy).toHaveBeenCalledWith(false);
    });

    it("should handle mouse leave event during drag", () => {
      const checkContainmentSpy = jest.spyOn(
        whiteboard as any,
        "checkContainment"
      );

      // Start drag
      const mouseDownEvent = createMouseEvent("mousedown", 75, 75);
      whiteboardCanvas.dispatchEvent(mouseDownEvent);

      // Verify drag is active
      expect((whiteboard as any).dragState.getIsDragging()).toBe(true);

      // Trigger mouse leave
      const mouseLeaveEvent = createMouseEvent("mouseleave", 0, 0);
      whiteboardCanvas.dispatchEvent(mouseLeaveEvent);

      // Verify drag ended and containment check was performed
      expect((whiteboard as any).dragState.getIsDragging()).toBe(false);
      expect(checkContainmentSpy).toHaveBeenCalled();
    });

    it("should handle edge case: dragging exactly to boundary", () => {
      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");

      // Start drag
      const mouseDownEvent = createMouseEvent("mousedown", 75, 75);
      whiteboardCanvas.dispatchEvent(mouseDownEvent);

      // Drag to exact boundary position where rectangle touches area boundary from inside
      // Move to (125, 125) so rectangle is at (100, 100) -> (150, 150) [50x50]
      // This should be fully contained within area (100, 100) -> (300, 300)
      const mouseMoveEvent = createMouseEvent("mousemove", 125, 125);
      whiteboardCanvas.dispatchEvent(mouseMoveEvent);

      // End drag
      const mouseUpEvent = createMouseEvent("mouseup", 125, 125);
      whiteboardCanvas.dispatchEvent(mouseUpEvent);

      // Verify highlighting occurs for boundary containment
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(true);
      expect(areaHighlightSpy).toHaveBeenCalledWith(true);
    });
  });

  describe("Multi-shape Drag Scenarios", () => {
    it("should handle containment with multiple potential containers", () => {
      // Add a second, smaller area
      const smallArea = new Area(
        renderer,
        "small-area",
        { x: 120, y: 120 },
        { width: 60, height: 60 }
      );
      whiteboard.addShape(smallArea);

      const rectangleHighlightSpy = jest.spyOn(rectangle, "setHighlighted");
      const areaHighlightSpy = jest.spyOn(area, "setHighlighted");
      const smallAreaHighlightSpy = jest.spyOn(smallArea, "setHighlighted");

      // Start drag
      const mouseDownEvent = createMouseEvent("mousedown", 75, 75);
      whiteboardCanvas.dispatchEvent(mouseDownEvent);

      // Drag rectangle to be contained within both areas
      // Move to (150, 150) so rectangle is at (125, 125) -> (175, 175) [50x50]
      // This is within both area (100, 100) -> (300, 300) and smallArea (120, 120) -> (180, 180)
      const mouseMoveEvent = createMouseEvent("mousemove", 150, 150);
      whiteboardCanvas.dispatchEvent(mouseMoveEvent);

      // End drag
      const mouseUpEvent = createMouseEvent("mouseup", 150, 150);
      whiteboardCanvas.dispatchEvent(mouseUpEvent);

      // All shapes should be highlighted due to containment relationships
      expect(rectangleHighlightSpy).toHaveBeenCalledWith(true);
      expect(areaHighlightSpy).toHaveBeenCalledWith(true);
      expect(smallAreaHighlightSpy).toHaveBeenCalledWith(true);
    });
  });
});
