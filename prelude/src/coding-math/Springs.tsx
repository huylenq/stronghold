import * as React from 'react';
import CanvasComponent, { dat, ICanvasComponentProps } from './CanvasComponent';
import Particle from './Particle';
import Spring from './Spring';

export default class Springs extends CanvasComponent<ICanvasComponentProps> {

  weight: Particle;
  springPoint: Particle;

  spring: Spring;

  mouseX: number;
  mouseY: number;

  @dat({min: 0, max: 1})
  get stiffness() {
    return this.spring.stiffness;
  }
  set stiffness(value: number) {
    this.spring.stiffness = value;
  }

  @dat({min: 0, max: 500})
  get springLength() {
    return this.spring.length;
  }
  set springLength(value: number) {
    this.spring.length = value;
  }

  @dat({min: 0, max: 5, step: 0.1})
  get gravity() {
    return this.weight.gravity;
  }
  set gravity(value: number) {
    this.weight.gravity = value;
  }

  constructor(props: ICanvasComponentProps, state: any) {
    super(props, state);
    this.weight = Particle.create({
      x: this.props.width / 2,
      y: this.props.height / 2 + 100
    });
    this.weight.radius = 14;
    this.weight.gravity = 1;
    this.weight.friction = 0.1;

    this.springPoint = Particle.create({
      x: this.props.width / 2,
      y: this.props.height / 2
    });
    this.springPoint.radius = 4;

    this.spring = new Spring(this.weight, this.springPoint, 50, .1);
  }

  onMouseMove(event: MouseEvent) {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.springPoint.x = this.mouseX;
    this.springPoint.y = this.mouseY;
    this.spring.update();
    this.weight.update();

    this.springPoint.draw(ctx);
    this.weight.draw(ctx);
    this.spring.draw(ctx);

  }

}
