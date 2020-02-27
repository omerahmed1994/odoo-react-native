import React from 'react';
import {Route, Switch} from 'react-router-native';
import {View, Text} from 'react-native';

import Home from '../pages/Home';
import Attendance from '../pages/Attendance';

const NotFound = () => (
  <View>
    <Text>404 NotFound</Text>
  </View>
);

const ModulesRouters = () => (
  <Route>
    <Switch>
      <Route path="/attendance" component={Attendance} />
      <Route path="/home" component={Home} />
      <Route path="/" component={Attendance} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Route>
);
export default ModulesRouters;
