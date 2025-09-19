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
    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      const mousePos = this.getMousePosition(event);
      const clickedShape = this.findShapeAtPoint(mousePos);

      if (clickedShape) {
        this.dragState.startDrag(clickedShape, mousePos);

        this.canvas.style.cursor = "grabbing";
      }
    });

    this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      const mousePos = this.getMousePosition(event);

      if (this.dragState.getIsDragging()) {
        this.dragState.updateDrag(mousePos);

        this.render();
      } else {
        this.canvas.style.cursor = !!this.findShapeAtPoint(mousePos)
          ? "grab"
          : "default";
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      if (this.dragState.getIsDragging()) {
        this.dragState.endDrag();
        this.canvas.style.cursor = "default";

        this.render();
      }
    });

    this.canvas.addEventListener("mouseleave", () => {
      if (this.dragState.getIsDragging()) {
        this.dragState.endDrag();
        this.canvas.style.cursor = "default";

        this.render();
      }
    });
  }

  render(): void {
    this.renderer.clear();

    this.shapes
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((shape) => shape.draw(this.renderer));
  }
}
