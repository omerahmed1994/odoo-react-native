/*
 RedirectRoute: Statless Componet
 to render component by condition
 else redirect to another URL

 - use this component under react-router-dom V4
*/

import React from 'react';
import {Redirect, Route} from 'react-router-native';

const RedirectRoute = ({component, redirect, path, condition}) => {
  const Component = component;

  return condition ? (
    <Route path={path} component={Component} />
  ) : (
    <Redirect to={redirect} />
  );
};

export default RedirectRoute;
