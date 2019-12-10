import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as uiActions from '../ducks/ui';
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import Home from './Home';
import PrepList from './PrepList';
import Count from './Count';
import Items from './Items';
import PlayGround from './PlayGround';

class App extends Component {

  render() {
    return this.props.locations.length > 0        
      ? <HashRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/preplist" component={PrepList} />
            <Route exact path="/count" component={Count} />
            <Route exact path="/playground" component={PlayGround} />
            <Route exact path="/items" component={Items} />
            <Redirect to="/" />
          </Switch>
        </HashRouter>
      : <div>loading...</div>
  }
}

export default connect(
  ({ ui }) => ({
    locations: ui.locations,
  }), 
  dispatch => ({
    fetchLocations: () => dispatch(uiActions.fetchLocations()),
  })
)(App);