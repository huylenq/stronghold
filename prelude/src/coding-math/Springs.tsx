import * as React from 'react';
import SpringsCanvas from './SpringsCanvas';
import FloatingHelp from 'components/FloatingHelp';

export default class Springs extends React.Component<
{},
{ canvasMouseDowned: boolean }
> {

  constructor(props: {}, context: {}) {
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
          dat
          width={innerWidth}
          height={innerHeight}
          onMouseDown={this.onCanvasMouseDown}
        />
        {
          !this.state.canvasMouseDowned &&
          <FloatingHelp>
            Click to add new spring!
          </FloatingHelp>
        }
      </div>
    );
  }

}
