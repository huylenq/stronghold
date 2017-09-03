import * as React from 'react';
import { Component } from 'react';
import {
  Icon,
} from '@blueprintjs/core';
import styled, { keyframes } from 'styled-components';
import { push } from 'react-router-redux';
import { connect, DispatchProp } from 'react-redux';
import Card from './components/Card';

function stopPropagation(event: React.SyntheticEvent<any>) {
  event.stopPropagation();
}

class App extends Component<{
  className?: string,
  onEmitterCardClick: () => void
}, {}> {

  render() {
    return (
      <div className={this.props.className}>
        <Message>
          <RotateIcon iconName="build" iconSize={Icon.SIZE_LARGE} />
          <Title className="pt-callout">
            It is really nice to see you here!<br/>
            This site is still underconstruction and suppose to be the place<br/>
            where I dump out my wanders and random litle experiments.
          </Title>
          <RotateIcon iconName="build" iconSize={Icon.SIZE_LARGE} />
        </Message>
        <Card onClick={this.props.onEmitterCardClick}>
          <h5><a>Particles Emitter</a></h5>
          <p>
            A simple particles emitter <br/>
            with some adhoc physics. Inspired <br/>
            by this excellent series{' '}
            <a
              href="https://www.youtube.com/user/codingmath/about"
              onClick={stopPropagation}
            >
              CodingMath
            </a>
          </p>
        </Card>

      </div>
    );
  }

}

const spinning = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg);}
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  margin-top: 20%;
  margin-left: 12px;
  margin-right: 12px;
`;

const RotateIcon = styled(Icon)`
  animation: ${spinning} infinite 2s linear;
`;

const Title = styled.span`
  margin: auto 1em;
  text-align: center;
`;

const StyledApp = styled(App)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

export default connect(null, {
  onEmitterCardClick: () => push('/emitter')
})(StyledApp);
