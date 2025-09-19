import { Shape, Point, Size, Bbox } from "./Shape";
import { Renderer } from "../renderer/Renderer";

const IDLE_FILL_COLOR = "#FFB6C1";
const HIGHLIGHTED_FILL_COLOR = "rgba(58, 115, 249, 0.66)";
const STROKE_COLOR = "#000000";
const STROKE_WIDTH = 2;
export class Rectangle implements Shape {
  private fillColor: string = IDLE_FILL_COLOR;
  private strokeColor: string = STROKE_COLOR;
  private strokeWidth: number = STROKE_WIDTH;

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
      this.fillColor = HIGHLIGHTED_FILL_COLOR;
    } else {
      this.fillColor = IDLE_FILL_COLOR;
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

  isFullyContainedWithin(other: Shape): boolean {
    const myBounds = this.getBounds();
    const otherBounds = other.getBounds();

    return (
      myBounds.x >= otherBounds.x &&
      myBounds.y >= otherBounds.y &&
      myBounds.x + myBounds.width <= otherBounds.x + otherBounds.width &&
      myBounds.y + myBounds.height <= otherBounds.y + otherBounds.height
    );
  }
}
