import React, {Component, useState} from 'react';
import {Route, Switch} from 'react-router-native';
import AsyncStorage from '@react-native-community/async-storage';

// base containers
import Login from '../pages/Login';
import ModulesRouters from './ModulesRouters';
import RedirectRoute from './RedirectRoute';

const RootRouter = () => {
  const [state, setState] = useState({isLogged: false});

  AsyncStorage.getItem('@odoo:SID').then(value => {
    setState({isLogged: !!value});
  });

  return (
    <Route>
      <Switch>
        <RedirectRoute
          path="/login"
          component={Login}
          condition={!state.isLogged}
          redirect="/home"
        />
        <RedirectRoute
          path="/"
          component={ModulesRouters}
          condition={state.isLogged}
          redirect="/login"
        />
      </Switch>
    </Route>
  );
};

export default RootRouter;
