import { Whiteboard } from "./whiteboard/Whiteboard";
import { Rectangle } from "./shapes/Rectangle";
import { Area } from "./shapes/Area";
import { Renderer } from "./renderer/Renderer";

import "../styles.css";
import { Shape } from "./shapes/Shape";

const CANVAS_SIZE = { width: 800, height: 600 };
const CANVAS_BG_COLOR = "#d7d7d7";

export class WhiteboardApp {
  private whiteboard: Whiteboard;
  private renderer: Renderer;
  private shapes: Shape[] = [];

  constructor(canvasId: string) {
    this.renderer = new Renderer(canvasId);
    this.whiteboard = new Whiteboard(this.renderer);
    this.setupCanvas();
    this.addSampleShapes();
  }

  private setupCanvas(): void {
    this.renderer.init(CANVAS_SIZE.width, CANVAS_SIZE.height, CANVAS_BG_COLOR);
  }

  private addSampleShapes(): void {
    // Create one area (right, vertically centered)
    this.shapes.push(
      new Area(
        this.renderer,
        "area",
        { x: 400, y: (CANVAS_SIZE.height - 300) / 2 },
        { width: 350, height: 300 },
        0
      )
    );

    // Create one rectangle (left, vertically centered)
    this.shapes.push(
      new Rectangle(
        this.renderer,
        "rect",
        { x: 200, y: (CANVAS_SIZE.height - 80) / 2 },
        { width: 120, height: 80 },
        1
      )
    );

    this.shapes.forEach((shape) => this.whiteboard.addShape(shape));
  }

  public getShapes(): Shape[] {
    return this.shapes;
  }

  public getShapeById(id: string): Shape | undefined {
    return this.shapes.find((shape) => shape.id === id);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WhiteboardApp("whiteboard-canvas");
});
