import { Shape, Point } from "../shapes/Shape";
import { Renderer } from "../renderer/Renderer";
import { DragState } from "./DragState";

export class Whiteboard {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private shapes: Shape[] = [];
  private dragState: DragState;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.canvas = renderer.getCanvasElement();
    this.dragState = new DragState();

    this.setupEventListeners();
    this.render();
  }

  addShape(shape: Shape): void {
    this.shapes.push(shape);
    this.checkContainment(); // Check containment when new shapes are added
    this.render();
  }

  private getMousePosition(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private findShapeAtPoint(point: Point): Shape | null {
    // Search from top to bottom (last drawn shape first)
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i].containsPoint(point)) {
        return this.shapes[i];
      }
    }
    return null;
  }

  private setupEventListeners(): void {
    // Mouse down event - start dragging
    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      const mousePos = this.getMousePosition(event);
      const clickedShape = this.findShapeAtPoint(mousePos);

      if (clickedShape) {
        this.dragState.startDrag(clickedShape, mousePos);

        // Change cursor to indicate dragging
        this.canvas.style.cursor = "grabbing";
      }
    });

    // Mouse move event - handle dragging
    this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      const mousePos = this.getMousePosition(event);

      if (this.dragState.getIsDragging()) {
        // Update shape position using DragState
        this.dragState.updateDrag(mousePos);

        // Check containment after position update
        this.checkContainment();

        this.render();
      } else {
        // Handle cursor changes when hovering over shapes
        const hoveredShape = this.findShapeAtPoint(mousePos);
        this.canvas.style.cursor = hoveredShape ? "grab" : "default";
      }
    });

    // Mouse up event - stop dragging
    this.canvas.addEventListener("mouseup", (event: MouseEvent) => {
      if (this.dragState.getIsDragging()) {
        this.dragState.endDrag();
        this.canvas.style.cursor = "default";

        // Final containment check after drag ends
        this.checkContainment();
        this.render();
      }
    });

    // Mouse leave event - stop dragging if mouse leaves canvas
    this.canvas.addEventListener("mouseleave", (event: MouseEvent) => {
      if (this.dragState.getIsDragging()) {
        this.dragState.endDrag();
        this.canvas.style.cursor = "default";

        // Final containment check after drag ends
        this.checkContainment();
        this.render();
      }
    });
  }

  /**
   * Check containment between shapes and update highlighting accordingly
   */
  private checkContainment(): void {
    // Reset all highlighting first
    this.shapes.forEach((shape) => shape.setHighlighted(false));

    // Check containment for all shape pairs
    for (let i = 0; i < this.shapes.length; i++) {
      for (let j = 0; j < this.shapes.length; j++) {
        if (i === j) continue; // Skip self

        const shapeA = this.shapes[i];
        const shapeB = this.shapes[j];

        // Check if shapeA is fully contained within shapeB
        if (shapeA.isFullyContainedWithin(shapeB)) {
          shapeA.setHighlighted(true);
          shapeB.setHighlighted(true);
        }
      }
    }
  }

  render(): void {
    // Clear canvas
    this.renderer.clear();

    // Draw all shapes, but draw the dragged shape last (on top)
    this.shapes
      .filter((s) => this.dragState.getDraggedShape() !== s)
      .forEach((shape) => shape.draw(this.renderer));

    // Draw the dragged shape last so it appears on top
    this.dragState.getDraggedShape()?.draw(this.renderer);
  }
}
