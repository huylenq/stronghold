import * as React from 'react';
import CanvasComponent, {ICanvasComponentProps} from './CanvasComponent';
import Particle from './Particle';

const K = .1;

export default class Springs extends CanvasComponent<ICanvasComponentProps> {

  weight: Particle;
  springPoint: Particle;

  mouseX: number;
  mouseY: number;

  constructor(props, state){
    super(props, state);
  }

  componentDidMount() {
    super.componentDidMount();
    this.weight = Particle.create({
      x: 150,
      y: 150
    });
    this.weight.friction = 0.1;
    this.springPoint = Particle.create({
      x: this.props.width / 2,
      y: this.props.height / 2
    });
    this.springPoint.radius = 4;
  }

  onMouseMove(event) {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
  }

  componentWillUnMount() {
    super.componentWillUnmount();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const springForce = this.springPoint.position.subtract(this.weight.position).multiplyBy(K);

    this.springPoint.x = this.mouseX;setInterval
    this.springPoint.y = this.mouseY;
    this.springPoint.draw(ctx);

    this.weight.accelerate(springForce);
    this.weight.update();
    this.weight.draw(ctx);
    ctx.beginPath();
    ctx.moveTo(this.weight.x, this.weight.y);
    ctx.lineTo(this.springPoint.x, this.springPoint.y);
    ctx.stroke();
  }

}
