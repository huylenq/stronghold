import * as React from 'react';
import TrigonometryCanvas from './TrigonometryCanvas';
import styled from 'styled-components';
import {
  Switch,
  Tooltip,
  Position,
}
from '@blueprintjs/core';
import { Table } from '@blueprintjs/table';

export default class Trigonometry extends React.Component<
{},
{
  angle: number,
  /* pi: string,*/
  dragToChange: boolean,
  dragToChangeTooltip: boolean,
}
> {

  tooltipTimer: number;

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      angle: 0,
      /* pi: '0.00',*/
      dragToChange: false,
      dragToChangeTooltip: false,
    };
  }

  onAngleChange = (radian: number): void => {
    this.setState({angle: radian});
    /* this.setState({pi: (radian / Math.PI).toFixed(2)});*/
  }

  onSwitchDragToChange = () => {
    this.setState(prev => {
      const newVal = !prev.dragToChange;
      if (newVal) {
        if (this.tooltipTimer) {
          window.clearTimeout(this.tooltipTimer);
        }
        this.tooltipTimer = window.setTimeout(
          () => {
            this.setState({dragToChangeTooltip: false});
          },
          3000);
      }
      return {...prev,
              dragToChange: newVal,
              dragToChangeTooltip: newVal,
      };
    });
  }

  render() {
    return (
      <div onMouseDown={event => event.preventDefault()}>
        <Controls>
          <Switch
            checked={!this.state.dragToChange}
            onChange={this.onSwitchDragToChange}
          >
            <Tooltip isOpen={this.state.dragToChangeTooltip}
                     content="Drag to change"
                     position={Position.RIGHT} >
              Follow mouse
            </Tooltip>
          </Switch>
        </Controls>
        <TrigonometryCanvas
          drag={this.state.dragToChange}
          onAngleChange={this.onAngleChange}
          width={window.innerWidth}
          height={window.innerHeight}
        />
        <SimpleTable className="pt-table pt-bordered">
          <thead>
            <tr>
              <th>Radian</th>
              <th>Degree</th>
            </tr>
          </thead>
          <tbody>
          <tr>
            <FixedTd>{(this.state.angle / Math.PI).toFixed(2)} π</FixedTd>
            <FixedTd>{(this.state.angle * 180).toFixed(2)}°</FixedTd>
          </tr>
          </tbody>
        </SimpleTable>
      </div>
    );
  }

}

const FixedTd = styled.td`
  width: 90px;
`;

const Controls = styled.div`
position: absolute;
top: 1.5em;
left: 1.5em;
`;

const SimpleTable = styled.table`
position: absolute;
right: 1em;
bottom: 1em;
`;
