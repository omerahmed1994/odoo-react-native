import {NativeRouter} from 'react-router-native';
import RootRouter from './routers/RootRouter';
import React from 'react';
// import { AppLoading } from 'expo';
// import * as Font from 'expo-font';
// import { Ionicons } from '@expo/vector-icons';
import {Provider} from 'react-redux';
import store from './store';

const App = () => (
  <Provider store={store}>
    <NativeRouter>
      <RootRouter />
    </NativeRouter>
  </Provider>
);

export default App;
