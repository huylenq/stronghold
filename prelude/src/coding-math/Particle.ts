import Vector from './Vector';
import * as color from 'color';
import palette from 'palette';

export default class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  gravity: number;
  gravitations: Particle[] = [];
  radius: number;
  friction: number;

  strokeColor = palette.u_white;

  public static create({
    x = 0,
    y = 0,
    speed = 0,
    direction = 0,
    mass = 0,
    gravity = 0,
    radius = 10,
    friction = 0,
  }: {
      x?: number,
      y?: number,
      speed?: number
      direction?: number,
      mass?: number,
      gravity?: number,
      radius?: number,
      friction?: number,
    }) {
    const particle = new Particle();
    particle.x = x;
    particle.y = y;
    particle.vx = Math.cos(direction) * speed;
    particle.vy = Math.sin(direction) * speed;
    particle.mass = mass;
    particle.gravity = gravity;
    particle.radius = radius;
    particle.friction = friction;
    return particle;
  }

  accelerate(v: Vector) {
    const oldV = {vx: this.vx, vy: this.vy};
    this.vx += v.x;
    this.vy += v.y;
    const newV = {vx: this.vx, vy: this.vy};
  }

  get direction() {
    return Math.atan2(this.vy, this.vx);
  }
  set direction(direction: number) {
    const speed = this.speed;
    this.vx = Math.cos(direction) * speed;
    this.vy = Math.sin(direction) * speed;
  }

  get speed() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }
  set speed(speed: number) {
    const direction = this.direction;
    this.vx = Math.cos(direction) * speed;
    this.vy = Math.sin(direction) * speed;
  }

  get position() {
    return Vector.of(this.x, this.y);
  }

  get velocity() {
    return Vector.of(this.vx, this.vy);
  }

  update() {
    for (let gravitation of this.gravitations) {
      const d = gravitation.position.subtract(this.position);
      const r = d.length;
      if (r - gravitation.radius - this.radius > 0) {
        const g = 1;
        const f = g * gravitation.mass / (r * r);
        const force = d.withLength(f);
        this.accelerate(force);
      }
    }

    this.vy += this.gravity;
    this.vx *= 1 - this.friction;
    this.vy *= 1 - this.friction;
    this.x += this.vx;
    this.y += this.vy;
  }

  distanceTo({x, y}: IPosition) {
    return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
  }

  angleTo({x, y}: IPosition) {
    return Math.atan2(y - this.y, x - this.x);
  }

  gravitateTo(p2: Particle) {
    const dx = p2.x - this.x,
    dy = p2.y - this.y,
    dist = this.distanceTo(p2),
    length = p2.mass / (dist * dist),
    gx = dx / dist * length,
    gy = dy / dist * length;

    this.accelerate(Vector.of(gx, gy));
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.strokeStyle = this.strokeColor;
    context.arc(this.x,
                this.y,
                this.radius,
                0, Math.PI * 2,
                false);
    context.stroke();
  }

}
