import { Shape, Point } from "../shapes/Shape";

export class DragState {
  private isDragging: boolean = false;
  private draggedShape: Shape | null = null;
  private dragOffset: Point = { x: 0, y: 0 };
  private lastMousePosition: Point = { x: 0, y: 0 };

  constructor() {}

  getIsDragging(): boolean {
    return this.isDragging;
  }

  getDraggedShape(): Shape | null {
    return this.draggedShape;
  }

  getDragOffset(): Point {
    return this.dragOffset;
  }

  getLastMousePosition(): Point {
    return this.lastMousePosition;
  }

  startDrag(shape: Shape, mousePosition: Point): void {
    this.isDragging = true;
    this.draggedShape = shape;
    this.dragOffset = {
      x: mousePosition.x - shape.position.x,
      y: mousePosition.y - shape.position.y,
    };
    this.lastMousePosition = mousePosition;
  }

  updateDrag(mousePosition: Point): void {
    if (this.isDragging && this.draggedShape) {
      const newPosition: Point = {
        x: mousePosition.x - this.dragOffset.x,
        y: mousePosition.y - this.dragOffset.y,
      };
      this.draggedShape.setPosition(newPosition);
      this.lastMousePosition = mousePosition;
    }
  }

  endDrag(): void {
    this.isDragging = false;
    this.draggedShape = null;
  }

  reset(): void {
    this.isDragging = false;
    this.draggedShape = null;
    this.dragOffset = { x: 0, y: 0 };
    this.lastMousePosition = { x: 0, y: 0 };
  }
}
