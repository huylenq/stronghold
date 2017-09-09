import * as React from 'react';
import { Component } from 'react';
import {
  Icon,
  Tag,
} from '@blueprintjs/core';
import styled, { keyframes } from 'styled-components';
import { push } from 'react-router-redux';
import { connect, DispatchProp } from 'react-redux';
import Card from 'components/Card';
import Cube from 'three/Cube';

function stopPropagation(event: React.SyntheticEvent<any>) {
  event.stopPropagation();
}

class App extends Component<{
  className?: string,
  onEmitterCardClick: () => void,
  onOdontologyCardClick: () => void,
}, {}> {

  render() {
    return (
      <div className={this.props.className}>
        <Cube width={100} height={100} z={4} />
        <Message>
          {/* <RotateIcon iconName="build" iconSize={Icon.SIZE_LARGE} /> */}
          <Title className="pt-callout">
            It is really nice to see you here!<br/>
            This site is underconstruction and suppose to be the place
            where I dump out my wanders and random little experiments.
          </Title>
          {/* <RotateIcon iconName="build" iconSize={Icon.SIZE_LARGE} /> */}
        </Message>
        <Deck>
          <SLCard onClick={this.props.onEmitterCardClick}>
            <h5><a>Particles Emitter</a></h5>
            <p>A simple particles emitter with some adhoc physics. Inspired by this excellent series{' '}
              <a href="https://www.youtube.com/user/codingmath/about"
                 onClick={stopPropagation}>
                CodingMath
              </a>
            </p>
          </SLCard>
          <SLCard onClick={this.props.onOdontologyCardClick}>
            <h5><a>Odontology</a></h5>
            <p>Odontology planar explanation.</p>
            <Tag>WIP</Tag>
          </SLCard>
        </Deck>

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
padding-top: 5%;
`;

const Deck = styled.div`
display: flex;
flex-flow: row wrap;
justify-content: space-around;
`;

const SLCard = styled(Card)`
margin: 10px;
width: 260px;
`;

export default connect(null, {
  onEmitterCardClick: () => push('/emitter'),
  onOdontologyCardClick: () => push('/odontology'),
})(StyledApp);
