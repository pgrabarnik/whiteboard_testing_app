import { Whiteboard } from "./whiteboard/Whiteboard";
import { Rectangle } from "./shapes/Rectangle";
import { Area } from "./shapes/Area";
import { Renderer } from "./renderer/Renderer";

import "../styles.css";

const CANVAS_SIZE = { width: 800, height: 600 };
const CANVAS_BG_COLOR = "#d7d7d7";

export class WhiteboardApp {
  private whiteboard: Whiteboard;
  private renderer: Renderer;

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
    const area = new Area(
      this.renderer,
      "area-1",
      { x: 400, y: (CANVAS_SIZE.height - 300) / 2 },
      { width: 350, height: 300 },
      0
    );

    // Create one rectangle (left, vertically centered)
    const rectangle = new Rectangle(
      this.renderer,
      "rect-1",
      { x: 200, y: (CANVAS_SIZE.height - 80) / 2 },
      { width: 120, height: 80 },
      1
    );

    this.whiteboard.addShape(area);
    this.whiteboard.addShape(rectangle);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WhiteboardApp("whiteboard-canvas");
});
