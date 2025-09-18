import { Shape, Point, Size, Bbox } from "./Shape";
import { Renderer } from "../renderer/Renderer";

export class Area implements Shape {
  public id: string;
  public position: Point;
  public size: Size;

  private fillColor: string = "#FDF6E3";
  private strokeColor: string = "#666666";
  private strokeWidth: number = 1;

  constructor(
    id: string,
    position: Point,
    size: Size,
    fillColor?: string,
    strokeColor?: string
  ) {
    this.id = id;
    this.position = { ...position };
    this.size = { ...size };

    if (fillColor) this.fillColor = fillColor;
    if (strokeColor) this.strokeColor = strokeColor;
  }

  draw(renderer: Renderer): void {
    const bbox: Bbox = {
      x: this.position.x,
      y: this.position.y,
      width: this.size.width,
      height: this.size.height,
    };

    renderer.drawRect(bbox, {
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
    // To be implemented...
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
