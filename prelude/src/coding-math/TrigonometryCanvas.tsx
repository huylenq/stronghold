import CanvasComponent, { dat, ICanvasComponentProps } from './CanvasComponent';
import Vector from './Vector';
import palette from 'palette';
import * as color from 'color';
import { Colors } from '@blueprintjs/core';

export interface ITrigonometryCanvasProps extends ICanvasComponentProps {
  drag: boolean;
  onAngleChange: (radian: number) => void;
}

export default class TrigonometryCanvas extends CanvasComponent<ITrigonometryCanvasProps> {

  origin: IPosition;
  mouse: IPosition;
  dragging: boolean;

  onMouseMove(pos: IPosition) {
    if (!this.props.drag || this.dragging) {
      this.mouse = pos;
      this.props.onAngleChange(
        Math.atan2(pos.y - this.origin.y,
                   pos.x - this.origin.x));
    }
  }

  onMouseDown(pos: IPosition) {
    if (this.props.drag) {
      this.dragging = true;
      this.mouse = pos;
      this.props.onAngleChange(
        Math.atan2(pos.y - this.origin.y,
                   pos.x - this.origin.x));
    }
  }

  onMouseUp(pos: IPosition) {
    if (this.props.drag) {
      this.dragging = false;
      this.mouse = pos;
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.origin = { x: this.width / 2, y: this.height / 2 };
    this.mouse = this.origin;
  }

  draw(ctx: CanvasRenderingContext2D) {

    const RADIUS = 120,
          origin = this.origin;

    const vector = Vector.of(
      this.mouse.x - this.origin.x,
      this.mouse.y - this.origin.y);
    vector.length = RADIUS;
    const degreePoint = {
      x: this.origin.x + vector.x,
      y: this.origin.y + vector.y
    };

    // Draw coordinates;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, this.height);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = color(palette.u_white).alpha(.1).string();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(this.width, origin.y);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = color(palette.u_white).alpha(.4).string();
    ctx.strokeText('- x', 20, origin.y - 10);
    ctx.strokeText('+ x', this.width - 30, origin.y - 10);
    ctx.strokeText('- y', origin.x + 10, 20);
    ctx.strokeText('+ y', origin.x + 10, this.height - 30);

    ctx.restore();

    // Circle
    ctx.beginPath();
    ctx.arc(this.origin.x, this.origin.y, RADIUS, 0, Math.PI * 2);
    ctx.stroke();

    // Base line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(this.origin.x + RADIUS, this.origin.y);
    ctx.strokeStyle = color(palette.u_white).alpha(0.2).string();
    ctx.stroke();
    ctx.restore();

    // Degree line
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(this.origin.x + vector.x, this.origin.y + vector.y);
    ctx.stroke();

    // Degree segment
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(this.origin.x + RADIUS, this.origin.y);
    ctx.arc(this.origin.x, this.origin.y,
            RADIUS,
            0, vector.angle);
    ctx.moveTo(this.origin.x + vector.x, this.origin.y + vector.y);
    ctx.lineTo(this.origin.x, this.origin.y);
    ctx.fillStyle = color(palette.u_white).alpha(0.1).string();
    ctx.fill();
    ctx.restore();

    // Cosine
    const cosPoint = {
      x: origin.x + vector.cos * RADIUS,
      y: origin.y
    };

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(cosPoint.x, cosPoint.y);
    ctx.strokeStyle = Colors.RED3;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeText(`cos = ${vector.cos.toFixed(2)}`, cosPoint.x - 10, cosPoint.y + 12);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(cosPoint.x, cosPoint.y);
    ctx.lineTo(degreePoint.x, degreePoint.y);
    ctx.strokeStyle = color(Colors.GREEN3).alpha(0.8).string();
    ctx.stroke();
    ctx.restore();

    // Sine
    const sinPoint = {
      x: origin.x,
      y: origin.y + vector.sin * RADIUS
    };

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(sinPoint.x, sinPoint.y);
    ctx.strokeStyle = Colors.GREEN3;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.strokeText(`sin = ${vector.sin.toFixed(2)}`,
                   sinPoint.x - 10,
                   sinPoint.y + (vector.sin > 0 ? 12 : -12));
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sinPoint.x, sinPoint.y);
    ctx.lineTo(degreePoint.x, degreePoint.y);
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = color(Colors.RED3).alpha(0.8).string();
    ctx.stroke();

    ctx.restore();

  }

}
