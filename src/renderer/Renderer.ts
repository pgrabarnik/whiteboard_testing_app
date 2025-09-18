import { Bbox } from "../shapes/Shape";

export type RectOptions = Partial<{
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}>;

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas with id '${canvasId}' not found`);
    }

    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2D context from canvas");
    }
    this.ctx = ctx;
  }

  /**
   * Initialize the canvas with dimensions and background
   */
  init(
    width: number,
    height: number,
    backgroundColor: string = "#f5f5f5"
  ): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.backgroundColor = backgroundColor;
  }

  /**
   * Draw a rectangle on the canvas
   */
  drawRect(bbox: Bbox, options: RectOptions = {}): void {
    const {
      fillColor = "#FDF6E3",
      strokeColor = "#000000",
      strokeWidth = 1,
    } = options;

    this.ctx.save();

    // Fill rectangle
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(bbox.x, bbox.y, bbox.width, bbox.height);

    // Stroke rectangle
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);

    this.ctx.restore();
  }

  /**
   * Clear the entire canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Render method - placeholder for now, can be extended
   */
  render(): void {
    // This method can be extended to handle more complex rendering logic
    // For now it's a no-op as shapes handle their own rendering
  }

  /**
   * Get canvas dimensions
   */
  getDimensions(): { width: number; height: number } {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    };
  }

  /**
   * Get the canvas element (for external integrations)
   */
  getCanvasElement(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get the 2D context (for advanced operations when needed)
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
