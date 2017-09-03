import * as React from 'react';
import { Route, Switch } from 'react-router';
import Emitter from './coding-math/Emitter';
import Dentistry from './dentistry/Dentistry';
import Welcome from './Welcome';

export default class App extends React.Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/emitter" component={Emitter} />
        <Route path="/dentistry" component={Dentistry} />
      </Switch>
    );

  }
}
