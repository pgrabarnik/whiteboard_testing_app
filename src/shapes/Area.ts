import { Shape, Point, Size, Bbox } from "./Shape";
import { Renderer } from "../renderer/Renderer";

const FILL_COLOR = "#FDF6E3";
const IDLE_STROKE_COLOR = "#666666";
const IDLE_STROKE_WIDTH = 1;
const HIGHLIGHTED_STROKE_COLOR = "#0758ee";
const HIGHLIGHTED_STROKE_WIDTH = 3;
export class Area implements Shape {
  private fillColor: string = FILL_COLOR;
  private strokeColor: string = IDLE_STROKE_COLOR;
  private strokeWidth: number = IDLE_STROKE_WIDTH;

  constructor(
    private renderer: Renderer,
    public id: string,
    public position: Point,
    public size: Size,
    public zIndex: number
  ) {
    this.id = id;
    this.position = { ...position };
    this.size = { ...size };
    this.zIndex = zIndex;
  }

  draw(): void {
    const bbox: Bbox = {
      x: this.position.x,
      y: this.position.y,
      width: this.size.width,
      height: this.size.height,
    };

    this.renderer.drawRect(bbox, {
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
    });
  }

  setPosition(position: Point): void {
    this.position = { ...position };
  }

  setSize(size: Size): void {
    this.size = { ...size };
  }

  setHighlighted(highlighted: boolean): void {
    if (highlighted) {
      this.strokeColor = HIGHLIGHTED_STROKE_COLOR;
      this.strokeWidth = HIGHLIGHTED_STROKE_WIDTH;
    } else {
      this.strokeColor = IDLE_STROKE_COLOR;
      this.strokeWidth = IDLE_STROKE_WIDTH;
    }

    this.draw();
  }

  containsPoint(point: Point): boolean {
    return (
      point.x >= this.position.x &&
      point.x <= this.position.x + this.size.width &&
      point.y >= this.position.y &&
      point.y <= this.position.y + this.size.height
    );
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.width,
      height: this.size.height,
    };
  }
}
