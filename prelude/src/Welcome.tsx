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

export interface IWelcomeOwnProps {
  className?: string;
  onEmitterCardClick: () => any;
  onOdontologyCardClick: () => any;
  onSpringsCardClick: () => any;
  onPetalianCardClick: () => any;
}

export interface IWelcomeStateProps {
  activeCard: string;
}

class Welcome extends Component<IWelcomeOwnProps & IWelcomeStateProps, {}> {
  render() {
    return (
      <div className={this.props.className}>
        <Cube width={100} height={100} z={4} />
        <Message>
          <Title className="pt-callout">
            It is really nice to see you here!<br/>
            This site is underconstruction and suppose to be the place
            where I dump out my wanders and random little experiments.
          </Title>
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
          <SLCard onClick={this.props.onSpringsCardClick}>
            <h5><a>Springs</a></h5>
            <p>Experiments of Springs' physics. Again, inspired by {' '}
              <a href="https://www.youtube.com/user/codingmath/about"
                 onClick={stopPropagation}>
                CodingMath
              </a>
            </p>
            <Tag>WIP</Tag>
          </SLCard>
          <SLCard onClick={this.props.onOdontologyCardClick}>
            <h5><a>Odontology</a></h5>
            <p>Odontology planar explanation.</p>
            <Tag>WIP</Tag>
          </SLCard>
          <SLCard onClick={this.props.onPetalianCardClick}>
            <h5><a>Petalian</a></h5>
            <p>A prototype of a new platformmer game.</p>
            <Tag>WIP</Tag>
            <Tag>Game</Tag>
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

const Title = styled.span`
margin: auto 1em;
text-align: center;
`;

const StyledWelcome = styled(Welcome)`
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
.pt-tag {
  margin: 2px;
}
`;

export default connect(
  (state) => ({
    activeCard: selectors.base(state).activeCard
  }),
  {
    onEmitterCardClick: () => push('/emitter'),
    onOdontologyCardClick: () => push('/odontology'),
    onSpringsCardClick: () => push('/springs'),
    onPetalianCardClick: () => window.location.href = '/petalian',
  })(StyledWelcome);

function activeCard(card: string, width?: number, height?: number) {
  return {
    type: 'ACTIVE_CARD',
    payload: { card }
  };
}

export const reducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ACTIVE_CARD':
      return {...state, active: payload.card};
    default:
      return state;
  }
};

export const selectors = {
  base: (state) => state.cards
};
