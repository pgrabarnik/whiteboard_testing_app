# TypeScript Whiteboard App

A canvas-based whiteboard application built with TypeScript featuring draggable shapes with customizable highlighting effects.

## Features

- **Shape Management**: Rectangle and circular Area shapes with the Shape interface
- **Interactive Controls**: Click and drag shapes around the canvas
- **Visual Feedback**: Different highlighting styles for each shape type
  - Rectangle: Transparent light blue fill when highlighted
  - Area (Circle): Solid blue border (wider) when highlighted
- **Dynamic Shape Creation**: Add new rectangles and circles with random colors and positions
- **Canvas Management**: Clear all shapes, export canvas as image
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
src/
├── Shape.ts          # Shape interface and type definitions
├── Rectangle.ts      # Rectangle implementation
├── Area.ts           # Circular area implementation
├── Whiteboard.ts     # Canvas manager and event handling
└── index.ts          # Main application entry point
index.html            # HTML template
styles.css            # Styling
package.json          # Dependencies and scripts
tsconfig.json         # TypeScript configuration
```

## Getting Started

### Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Serve locally:
   ```bash
   npm run serve
   ```

### CodeSandbox Import

This project is designed to be easily imported into CodeSandbox:

1. Upload the project files to CodeSandbox
2. CodeSandbox will automatically detect the TypeScript configuration
3. The project will build automatically
4. Open the generated `index.html` in the preview

### Manual Setup in CodeSandbox

If you prefer to set it up manually:

1. Create a new "Static" sandbox in CodeSandbox
2. Copy all files from this project
3. Install TypeScript: Add `typescript` to devDependencies in package.json
4. Build the project using the terminal: `npx tsc`
5. The compiled JavaScript will be in the `dist/` folder

## Usage

### Basic Interaction

- **Drag Shapes**: Click and hold on any shape to drag it around
- **Highlight Shapes**: Click on a shape to toggle its highlight state
- **Clear Highlights**: Click on empty canvas area to clear all highlights
- **Add Shapes**: Use the "Add Rectangle" and "Add Circle" buttons
- **Clear Canvas**: Use the "Clear All" button to remove all shapes
- **Export**: Use the "Export Image" button to download the canvas as PNG

### Programmatic Usage

```typescript
import { WhiteboardApp, Rectangle, Area } from "./src/index";

// Initialize the app
const app = new WhiteboardApp("canvas-id");

// Add custom shapes
const customRect = new Rectangle(
  "my-rect",
  { x: 100, y: 100 },
  { width: 150, height: 100 },
  "#FF5722"
);

app.addShape(customRect);

// Access the whiteboard directly
const whiteboard = app.getWhiteboard();
whiteboard.render();
```

### Shape Customization

Both Rectangle and Area classes support customization:

```typescript
// Rectangle customization
const rect = new Rectangle("id", position, size, fillColor, strokeColor);
rect.setFillColor("#FF0000");
rect.setStrokeColor("#000000");
rect.setStrokeWidth(3);

// Area (Circle) customization
const area = new Area("id", position, size, fillColor, strokeColor);
area.setFillColor("#00FF00");
area.setStrokeColor("#000000");
area.setStrokeWidth(2);
```

## Architecture

### Shape Interface

The `Shape` interface defines the contract for all drawable objects:

- `draw()`: Render the shape on canvas
- `setPosition()`: Update shape position
- `setSize()`: Update shape dimensions
- `containsPoint()`: Hit detection for mouse events
- `setHighlight()`: Toggle highlight state
- `getBounds()`: Get bounding rectangle

### Whiteboard Manager

The `Whiteboard` class handles:

- Canvas rendering and management
- Mouse event handling (drag, click, hover)
- Shape collection management
- Hit detection and selection

### Event System

Mouse events are handled with proper state management:

- **MouseDown**: Start dragging if clicking on a shape
- **MouseMove**: Update position during drag, update cursor on hover
- **MouseUp**: End drag operation
- **Click**: Toggle shape highlighting

## Browser Compatibility

- Modern browsers supporting ES2020
- Canvas API support required
- Mouse and touch events supported

## Contributing

The project is structured for easy extension:

1. Implement new shapes by extending the `Shape` interface
2. Add new interaction modes by extending the `Whiteboard` class
3. Customize rendering by modifying the `draw()` methods

## License

MIT License - feel free to use in your own projects!
