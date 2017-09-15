import Particle from './Particle';
import Vector from './Vector';

export default class Spring {

  constructor(public particle: Particle,
              public anchor: {x: number, y: number},
              public length: number,
              public stiffness: number) {}

  update() {
    const distance = new Vector(this.anchor.x, this.anchor.y).subtract(this.particle.position);
    distance.length -= this.length;
    const force = distance.multiply(this.stiffness);
    this.particle.accelerate(force);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.anchor.x, this.anchor.y);
    ctx.lineTo(this.particle.x, this.particle.y);
    ctx.stroke();
  }

}
