import * as React from 'react';
import SpringsCanvas from './SpringsCanvas';
import FloatingHelp from 'components/FloatingHelp';

interface ISpringProps {
  width: number;
  height: number;
}

export default class Springs extends React.Component
<ISpringProps,
{
  canvasMouseDowned: boolean
}> {

  constructor(props: ISpringProps, context: {}) {
    super(props, context);
    this.state = { canvasMouseDowned: false };
  }

  onCanvasMouseDown = () => {
    this.setState({canvasMouseDowned: true});
  }

  render() {
    return (
      <div>
        <SpringsCanvas
          dat stats
          width={this.props.width}
          height={this.props.height}
          onMouseDown={this.onCanvasMouseDown}
        />
        {
          !this.state.canvasMouseDowned &&
          <FloatingHelp>
            Click to add a new spring
          </FloatingHelp>
        }
      </div>
    );
  }

}
