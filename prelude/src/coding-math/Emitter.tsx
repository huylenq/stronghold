import * as React from 'react';
import Particle from './Particle';
import CanvasComponent, { dat, ICanvasComponentProps } from './CanvasComponent';

export default class Emitter extends CanvasComponent {
  particles: Particle[] = [];

  massParticle: Particle;

  @dat({min: 1, max: 20})
  initVelocity = 6;

  @dat({min: Math.PI * 0.05, max: Math.PI * .5})
  angle = Math.PI * 0.1;

  _particlesNum = 100;
  @dat({min: 1, max: 1000, step: 1})
  get particlesNum() { return this._particlesNum; }
  set particlesNum(n: number) {
    if (n < this._particlesNum) {
      this.decreaseParticles(this._particlesNum - n);
    } else {
      this.increaseParticles(n - this._particlesNum);
    }
    this._particlesNum = n;
  }

  _gravity = 0.1;
  @dat({min: 0, max: 1})
  get gravity() { return this._gravity; }
  set gravity(gravity: number) {
    this._gravity = gravity;
    this.particles.forEach(p => {
      p.gravity = gravity;
    });
  }

  @dat()
  bounce = false;

  @dat({min: 0, max: 1, step: 0.1})
  bounceFactor = 0.8;

  randomDirection() {
    return (-Math.PI / 2 + this.angle / 2) - Math.random() * this.angle;
  }

  initParticles(n: number) {
    this.particles.length = 0;
    this.increaseParticles(n);
    /* if (this.massParticle) {*/
    /* for (let p of this.particles) {*/
    /* p.gravitations = [this.massParticle];*/
    /* }*/
    /* }*/
  }

  increaseParticles(increment: number) {
    for (let i = 0; i < increment; i++) {
      this.particles.push(Particle.create({
        x: this.props.width * 0.5,
        y: this.props.height,
        direction: this.randomDirection(),
        gravity: this.gravity,
        radius: 2 + Math.random() * 10,
        speed: this.randomSpeed()
      }));
    }
  }

  decreaseParticles(decrement: number) {
    this.particles = this.particles.slice(0, this.particles.length - decrement);
  }

  randomSpeed() {
    return this.initVelocity + Math.random() * 6;
  }

  bounceParticles() {
    const width = this.props.width,
          height = this.props.height;
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      if (p.x - p.radius < 0) {
        p.x = p.radius;
        p.vx = - this.bounceFactor * p.vx;
        p.vy = this.bounceFactor * p.vy;
      }
      if (p.x + p.radius > width) {
        p.x = width - p.radius;
        p.vx = - this.bounceFactor * p.vx;
        p.vy = this.bounceFactor * p.vy;
      }
      if (p.y - p.radius < 0) {
        p.y = p.radius;
        p.vx = this.bounceFactor * p.vx;
        p.vy = - this.bounceFactor * p.vy;
      }
      if (p.y + p.radius > height) {
        p.y = height - p.radius;
        p.vx = this.bounceFactor * p.vx;
        p.vy = - this.bounceFactor * p.vy;
      }
    }
  }

  collectDeadParticles() {
    const width = this.props.width,
          height = this.props.height;
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      if (p.x + p.radius < 0
          || p.x - p.radius > width
          || p.y + p.radius < 0
          || p.y - p.radius > height) {
        p.x = width / 2;
        p.y = height;
        p.direction =  this.randomDirection();
        p.speed = this.randomSpeed();
      }
    }
  }

  removeDeadParticles() {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      if (p.x + p.radius < 0
          || p.x - p.radius > this.props.width
          || p.y + p.radius < 0
          || p.y - p.radius > this.props.height) {
        this.particles.splice(i, 1);
      }
    }
  }

  componentDidMount() {
    super.componentDidMount();

    /* this.massParticle = Particle.create({*/
    /* x: this.props.width / 2,*/
    /* y: this.props.height / 3,*/
    /* mass: 100,*/
    /* radius: 20,*/
    /* });*/
    /* this.massParticle.strokeColor = 'yellow';*/

    this.initParticles(this.particlesNum);
  }

  draw(context: CanvasRenderingContext2D) {
    /* this.massParticle.draw(context);*/
    for (let p of this.particles) {
      p.update();
      if (this.bounce) {
        this.bounceParticles();
      } else {
        this.collectDeadParticles();
      }
      // removeDeadParticles();
      p.draw(context);
    }
  }

}
