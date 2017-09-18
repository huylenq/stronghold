import * as React from 'react';
import EmitterCanvas from './EmitterCanvas';
import styled from 'styled-components';
import FloatingHelp from 'components/FloatingHelp';
import {
  ContextMenuTarget,
  Menu,
  MenuItem,
} from '@blueprintjs/core';

/* @ContextMenuTarget*/
export default class Emitter extends React.Component<{},
{
  canvasMouseDowned: number
}>  {

  constructor(props: any, context: {}) {
    super(props, context);
    this.state = { canvasMouseDowned: 0 };
  }

  onCanvasMouseDown = () => {
    this.setState(prev => ({...prev, canvasMouseDowned: prev.canvasMouseDowned + 1}));
  }

  helpText() {
    switch (this.state.canvasMouseDowned) {
      case 0:
        return "Click anywhere to add a sun"
      case 1:
        return "Click on it again to remove"
      default:
        return null;
    }
  }

  render() {
    const helpText = this.helpText();
    return (
      <div>
        <EmitterCanvas
          dat stats
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={this.onCanvasMouseDown}
        />
        {
          helpText &&
          <FloatingHelp>
            {helpText}
          </FloatingHelp>
        }
      </div>
    );
  }

  renderContextMenu() {
    return (
      <Menu>
        <MenuItem text="Save" />
        <MenuItem text="Delete" />
      </Menu>
    );
  }

}
