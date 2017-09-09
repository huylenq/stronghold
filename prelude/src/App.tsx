import * as React from 'react';
import { Route, Switch } from 'react-router';
import Emitter from './coding-math/Emitter';
import Odontology from './odontology/Odontology';
import Welcome from './Welcome';
import Cube from 'three/Cube';

export default class App extends React.Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/emitter" component={Emitter} />
        <Route
          path="/odontology"
          render={() =>
            <Odontology width={innerWidth} height={innerHeight} controls />
          }
        />
        <Route
          path="/cube"
          render={() =>
            <Cube width={innerWidth} height={innerHeight} rotationSpeed={3} />
          }
        />
      </Switch>
    );

  }
}
