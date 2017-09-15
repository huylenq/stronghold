import * as React from 'react';
import CanvasComponent, { dat, ICanvasComponentProps } from './CanvasComponent';
import Particle from './Particle';
import Spring from './Spring';

export default class Springs extends CanvasComponent<ICanvasComponentProps> {

  root: Particle;
  attachs: {weight: Particle, spring: Spring}[] = [];

  mouseX: number;
  mouseY: number;

  _stiffness: number = .1;
  @dat({min: 0, max: 1})
  get stiffness() {
    return this._stiffness;
  }
  set stiffness(value: number) {
    this._stiffness = value;
    this.attachs.forEach(attach => attach.spring.stiffness = value);
  }

  _springLength: number = 50;
  @dat({min: 0, max: 500})
  get springLength() {
    return this._springLength;
  }
  set springLength(value: number) {
    this._springLength = value;
    this.attachs.forEach(attach => attach.spring.length = value);
  }

  @dat({min: 0, max: 10, step: 0.1})
  gravity: number = 3;

  _friction: number = .2;
  @dat({min: 0, max: 1, step: 0.1})
  get friction() {
    return this._friction;
  }
  set friction(value: number) {
    this._friction = value;
    this.attachs.forEach(attach => attach.weight.friction = value);
  }

  constructor(props: ICanvasComponentProps, state: any) {
    super(props, state);

    this.root = Particle.create({
      x: this.props.width / 2,
      y: this.props.height / 2
    });
    this.root.radius = 4;
    this.attachs.push(this.attachSpring(this.root));
    this.attachs.push(this.attachSpring(this.attachs[0].weight));
    this.attachs.push(this.attachSpring(this.attachs[1].weight));
    /* this.attachs[0].spring.anchor = this.attachs[2].weight;*/
  }

  attachSpring(anchor: IPosition) {
    const weight = Particle.create({ x: anchor.x + Math.random() * 20, y: anchor.y + Math.random() * 20});
    weight.radius = 12;
    weight.gravity = this.gravity;
    weight.friction = this.friction;
    const spring = new Spring(weight, anchor, this.springLength, this.stiffness);
    return { weight, spring };
  }

  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  onMouseDown(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.attachs[0].weight.x = this.mouseX;
    this.attachs[0].weight.y = this.mouseY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.root.x = this.mouseX || this.root.x;
    this.root.y = this.mouseY || this.root.y;
    for (let attach of this.attachs) {
      attach.spring.update();
      attach.weight.gravity = this.gravity;
      attach.weight.update();
    }
    this.root.draw(ctx);
    for (let attach of this.attachs) {
      attach.spring.draw(ctx);
      attach.weight.draw(ctx);
    }
  }

}
