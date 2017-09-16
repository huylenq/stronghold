import * as React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
  Icon,
  Tag,
} from '@blueprintjs/core';
import styled, { keyframes, StyledFunction } from 'styled-components';
import { push } from 'react-router-redux';
import { connect, DispatchProp } from 'react-redux';
import Card from 'components/Card';
import { createSelector } from 'reselect';
import Cube from 'three/Cube';
import Springs from 'coding-math/Springs';

function stopPropagation(event: React.SyntheticEvent<any>) {
  event.stopPropagation();
}

export interface IWelcomeOwnProps {
  className?: string;
  onEmitterCardClick: () => any;
  onOdontologyCardClick: () => any;
  onSpringsCardClick: () => any;
  onPetalienCardClick: () => any;
}

export interface IWelcomeStateProps {
  activeCard?: string;
}

export type IWelcomeProps = IWelcomeOwnProps & IWelcomeStateProps;

class Welcome extends React.Component<IWelcomeProps> {

  render() {
    return (
      <div className={this.props.className}>
        <Cube width={100} height={100} z={4} />
        <div>
          <Deck id="deck">
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
              <p>Experiments of spring physics. Again, inspired by {' '}
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
            <SLCard onClick={this.props.onPetalienCardClick}>
              <h5><a>Petalien</a></h5>
              <p>A prototype of a new platformmer game.</p>
              <Tag>WIP</Tag>
              <Tag>Game</Tag>
            </SLCard>
          </Deck>
        </div>
        <Footer cardActive={!!this.props.activeCard}>
          <div className="pt-callout">
            <i>I make things</i>
            {' - '}
            <a className="pt-icon-standard pt-icon-envelope" href="mailto:huy.lenq@gmail.com"> huy.lenq@gmail.com</a>
          </div>
        </Footer>
      </div>
    );
  }
}

const spinning = keyframes`
from { transform: rotate(360deg); }
to { transform: rotate(0deg);}
`;

interface IFooterProps { cardActive: boolean; }
const Footer = styled.div`
position: ${(props: IFooterProps) => props.cardActive ? 'relative' : 'absolute'};
bottom: ${(props: IFooterProps) => props.cardActive ? 'none' : '12px'};
margin-top: 10px;
margin-bottom: 10px;
align-items: center;
text-align: center;
`;

const StyledWelcome = styled(Welcome)`
display: flex;
flex-grow: 1;
flex-direction: column;
align-items: center;
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
  null,
  {
    onEmitterCardClick: () => push('/emitter'),
    onOdontologyCardClick: () => push('/odontology'),
    onSpringsCardClick: () => push('/springs'),
    onPetalienCardClick: () => window.location.href = '/petalien',
  })(StyledWelcome);
