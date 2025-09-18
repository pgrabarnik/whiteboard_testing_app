import { Shape, Point } from "../shapes/Shape";
import { Renderer } from "../renderer/Renderer";

export interface DragState {
  isDragging: boolean;
  draggedShape: Shape | null;
  dragOffset: Point;
  lastMousePosition: Point;
}

export class Whiteboard {
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private shapes: Shape[] = [];
  private dragState: DragState;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.canvas = renderer.getCanvasElement();

    this.dragState = {
      isDragging: false,
      draggedShape: null,
      dragOffset: { x: 0, y: 0 },
      lastMousePosition: { x: 0, y: 0 },
    };

    this.setupEventListeners();
    this.render();
  }

  addShape(shape: Shape): void {
    this.shapes.push(shape);
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
        this.dragState.isDragging = true;
        this.dragState.draggedShape = clickedShape;
        this.dragState.dragOffset = {
          x: mousePos.x - clickedShape.position.x,
          y: mousePos.y - clickedShape.position.y,
        };
        this.dragState.lastMousePosition = mousePos;

        // Change cursor to indicate dragging
        this.canvas.style.cursor = "grabbing";
      }
    });

    // Mouse move event - handle dragging
    this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      const mousePos = this.getMousePosition(event);

      if (this.dragState.isDragging && this.dragState.draggedShape) {
        // Update shape position
        const newPosition: Point = {
          x: mousePos.x - this.dragState.dragOffset.x,
          y: mousePos.y - this.dragState.dragOffset.y,
        };

        this.dragState.draggedShape.setPosition(newPosition);
        this.dragState.lastMousePosition = mousePos;
        this.render();
      } else {
        // Handle cursor changes when hovering over shapes
        const hoveredShape = this.findShapeAtPoint(mousePos);
        this.canvas.style.cursor = hoveredShape ? "grab" : "default";
      }
    });

    // Mouse up event - stop dragging
    this.canvas.addEventListener("mouseup", (event: MouseEvent) => {
      if (this.dragState.isDragging) {
        this.dragState.isDragging = false;
        this.dragState.draggedShape = null;
        this.canvas.style.cursor = "default";
      }
    });

    // Mouse leave event - stop dragging if mouse leaves canvas
    this.canvas.addEventListener("mouseleave", (event: MouseEvent) => {
      if (this.dragState.isDragging) {
        this.dragState.isDragging = false;
        this.dragState.draggedShape = null;
        this.canvas.style.cursor = "default";
      }
    });
  }

  render(): void {
    // Clear canvas
    this.renderer.clear();

    // Draw all shapes, but draw the dragged shape last (on top)
    this.shapes
      .filter((s) => this.dragState.draggedShape !== s)
      .forEach((shape) => shape.draw(this.renderer));

    // Draw the dragged shape last so it appears on top
    this.dragState.draggedShape?.draw(this.renderer);
  }
}
