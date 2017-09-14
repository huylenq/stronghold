import * as React from 'react';

export interface ICanvasComponentProps {
  width: number;
  height: number;
}

export default
abstract class CanvasComponent<T extends ICanvasComponentProps = ICanvasComponentProps>
extends React.Component<T, {}> {

  private ref: HTMLCanvasElement;
  private _requestAnimationFrameId: number;

  abstract draw(context: CanvasRenderingContext2D, delta: number);

  componentDidMount() {
    const canvas = this.ref;
    const context = canvas.getContext('2d')!;

    canvas.width = this.props.width as number * window.devicePixelRatio;
    canvas.height = this.props.height as number * window.devicePixelRatio;
    canvas.style.width = this.props.width + 'px';
    canvas.style.height = this.props.height + 'px';
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    let previous;
    const callDraw: FrameRequestCallback = (now) => {
      context.clearRect(0, 0, this.props.width, this.props.height);
      context.save();
      this.draw(context, (now - previous) / 1000);
      context.restore();
      previous = now;
      this._requestAnimationFrameId = requestAnimationFrame(callDraw);
    };
    // leap to next 'cycle' to avoid null access in subclasses
    window.setTimeout(() => callDraw(previous = performance.now()), 0);

    if (this['onMouseMove']) {
      this.ref.addEventListener('mousemove', this['onMouseMove'].bind(this));
    }
  }

  componentWillUnmount() {
    if (this['onMouseMove']) {
      this.ref.removeEventListener('mousemove', this['onMouseMove']);
    }
    cancelAnimationFrame(this._requestAnimationFrameId);
  }

  render() {
    return <canvas ref={this.captureRef} />;
  }

  captureRef = (ref) => {
    this.ref = ref;
  }

}
