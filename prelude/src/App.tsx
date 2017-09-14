import * as React from 'react';
import { Route, Switch } from 'react-router';

import Emitter from 'coding-math/Emitter';
import Odontology from 'odontology/Odontology';
import Welcome from 'Welcome';
import Springs from 'coding-math/Springs';

export default class App extends React.Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/emitter" component={Emitter} />
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
          render={() =>
            <Springs width={innerWidth} height={innerHeight} dat />
          }
        />
      </Switch>
    );

  }
}
