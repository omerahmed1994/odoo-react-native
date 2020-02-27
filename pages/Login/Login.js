import React from 'react';
import {
  Container,
  Content,
  Item,
  Input,
  Icon,
  Label,
  Button,
  Text,
} from 'native-base';
import {StyleSheet, Image, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useFormik} from 'formik';
import Odoo from '../../odoo';
import logo from '../../assets/odoo_logo.png';

const Login = props => {
  const formik = useFormik({
    initialValues: {
      host: '',
      database: '',
      username: '',
      password: '',
      sid: '',
    },
    onSubmit: values => {
      const odoo = new Odoo({...values});
      odoo
        .connect()
        .then(response => {
          AsyncStorage.setItem('@odoo:SID', response.data.session_id);
          AsyncStorage.setItem('@odoo:HOST', JSON.stringify(values.host));
          AsyncStorage.setItem('@odoo:DB', JSON.stringify(values.database));
          AsyncStorage.setItem('@odoo:UID', JSON.stringify(response.data.uid));
          console.log('response =>', response);
          props.history.replace('/home');
        })
        .catch(e => {
          console.log('error =>', e);
        });
    },
  });
  return (
    <Container style={styles.container}>
      <Content>
        <View style={styles.content}>
          <Image source={logo} style={{height: 95, width: 300}} />
        </View>
        <Item>
          <Icon style={styles.odooColor} active name="planet" />
          <Input
            style={styles.odooColor}
            placeholderTextColor="#875a7b70"
            placeholder="http://example.com"
            id="host"
            name="host"
            onChangeText={formik.handleChange('host')}
            value={formik.values.host}
          />
        </Item>
        <Item>
          <Icon style={styles.odooColor} active name="link" />
          <Input
            style={styles.odooColor}
            placeholderTextColor="#875a7b70"
            placeholder="database name"
            id="database"
            name="database"
            onChangeText={formik.handleChange('database')}
            value={formik.values.database}
          />
        </Item>
        <Item>
          <Icon style={styles.odooColor} active name="person" />
          <Input
            style={styles.odooColor}
            placeholderTextColor="#875a7b70"
            placeholder="username"
            id="username"
            name="username"
            onChangeText={formik.handleChange('username')}
            value={formik.values.username}
          />
        </Item>
        <Item>
          <Icon style={styles.odooColor} active name="lock" />
          <Input
            style={styles.odooColor}
            placeholderTextColor="#875a7b70"
            placeholder="password"
            id="password"
            name="password"
            secureTextEntry={true}
            onChangeText={formik.handleChange('password')}
            value={formik.values.password}
          />
        </Item>
        <Button
          onPress={formik.handleSubmit}
          style={{backgroundColor: '#875a7b', marginTop: 30}}
          block
        >
          <Text>login</Text>
        </Button>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  odooColor: {
    color: '#875a7b',
  },
});

export default Login;
