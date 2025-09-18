import { Renderer } from "../renderer/Renderer";

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Bbox = Size & Point;

export interface Shape {
  id: string;
  position: Point;
  size: Size;

  /**
   * Draw the shape using the renderer
   */
  draw(renderer: Renderer): void;

  /**
   * Update the position of the shape
   */
  setPosition(position: Point): void;

  /**
   * Update the size of the shape
   */
  setSize(size: Size): void;

  /**
   * Check if a point is inside this shape (for mouse hit detection)
   */
  containsPoint(point: Point): boolean;

  /**
   * Toggles the highlighted state of the shape
   */
  setHighlighted(highlighted: boolean): void;

  /**
   * Get the bounding box of the shape
   */
  getBounds(): { x: number; y: number; width: number; height: number };

  /**
   * Check if this shape is fully contained within another shape's bounds
   */
  isFullyContainedWithin(other: Shape): boolean;
}
