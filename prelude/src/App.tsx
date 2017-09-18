import * as React from 'react';
import { Route, Switch } from 'react-router';

import Trigonometry from 'coding-math/Trigonometry';
import Emitter from 'coding-math/Emitter';
import Odontology from 'odontology/Odontology';
import Welcome from 'Welcome';
import Springs from 'coding-math/Springs';

export default class App extends React.Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/trigonometry"
               render={() => <Trigonometry />}
        />
        <Route path="/emitter"
               component={Emitter}
        />
        <Route
          path="/odontology"
          render={() =>
            <Odontology
              controls
              width={innerWidth} height={innerHeight}
            />
          }
        />
        <Route
          path="/springs"
          render={() => <Springs width={window.innerWidth} height={window.innerHeight} />}
        />
      </Switch>
    );

  }
}
