import React, {Component} from 'react';
import {
  Container,
  Header,
  Body,
  ListItem,
  Thumbnail,
  Right,
  List,
  Left,
  Title,
  Button,
  Content,
  Text,
  Footer,
  FooterTab,
  Icon,
} from 'native-base';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import CookieManager from 'react-native-cookies';

class Home extends Component {
  logout = async () => {
    const sid = await AsyncStorage.removeItem('@odoo:SID');
    const cookies = await CookieManager.clearAll();
    this.props.history.replace('/login');
  };

  test = () => {
    const {userLogin, userLogout, getPartner} = this.props;

    const values = {
      login: 'admin',
      db: 'noda',
      password: '123',
    };
    // console.log("=== values ===>", values)
    // userLogin({params:{...values}},{ onFulfilled: this.onSuccessLogin })

    const data = {
      params: {
        model: 'res.partner',
        method: 'search_read',
        args: [],
        kwargs: {
          // context: { ...values }
          fields: ['name', 'lang', 'company_id', 'image_small'],
          domain: [],
          limit: 10,
        },
      },
    };

    // if the form is accessed by an external third party(e.g.REST API
    // endpoint, payment gateway callback) you will need to disable CSRF
    // protection(and implement your own protection if necessary) by
    // passing the`csrf=False` parameter to the`route` decorator.

    // userLogout({ csrf:false },{ onFulfilled: this.onSuccessLogin, onFaild:this.onFaild })

    getPartner(
      {...data},
      {onFulfilled: this.onSuccessLogin, onFaild: e => console.log('e', e)},
    );
  };

  onFaild = err => {
    // localStorage.setItem('token', response.data.data.user.auth_token)
    // localStorage.setItem('name', response.data.data.user.name)
    // localStorage.setItem('role', response.data.data.user.role)

    // localStorage.setItem('role', response.data.data.user.role)
    console.log('\n\n\n\n ==== start err====> \n', err);
    console.log('\n\n\n\n ====end err   ====> \n');

    // window.location.reload()
  };

  onSuccessLogin = response => {
    // localStorage.setItem('token', response.data.data.user.auth_token)
    // localStorage.setItem('name', response.data.data.user.name)
    // localStorage.setItem('role', response.data.data.user.role)

    // localStorage.setItem('role', response.data.data.user.role)
    console.log('\n\n\n\n ==== start response====> \n', response);
    console.log('\n\n\n\n ====end response   ====> \n');

    // window.location.reload()
  };

  componentDidMount() {
    const {userLogin, userLogout, getPartner} = this.props;

    const data = {
      params: {
        model: 'res.partner',
        method: 'search_read',
        args: [],
        kwargs: {
          // context: { ...values }
          fields: ['name', 'lang', 'country_id', 'image_small'],
          domain: [],
          limit: 20,
        },
      },
    };
    getPartner(
      {...data},
      {
        onFulfilled: this.onSuccessLogin,
        onFaild: e => console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeee', e),
      },
    );
  }

  render() {
    const {partners} = this.props;
    return (
      <Container>
        <Button
          onPress={this.logout}
          style={{backgroundColor: '#875a7b'}}
          block
        >
          <Text>logout</Text>
        </Button>
        <Button onPress={this.test} style={{backgroundColor: '#875a7b'}} block>
          <Text>TEST</Text>
        </Button>
        <Content>
          <List>
            {partners.map(partner => (
              <ListItem key={partner.name} avatar>
                <Left>
                  <Thumbnail
                    source={{
                      uri: `data:image/jpeg;base64,${partner.image_small}`,
                    }}
                  />
                </Left>
                <Body>
                  <Text>{partner.name}</Text>
                  <Text note>{partner.lang}</Text>
                </Body>
              </ListItem>
            ))}
          </List>
        </Content>
        <Footer>
          <FooterTab>
            <Button>
              <Icon name="apps" />
            </Button>
            <Button>
              <Icon name="camera" />
            </Button>
            <Button active>
              <Icon active name="apps" />
            </Button>
            <Button>
              <Icon name="navigate" />
            </Button>
            <Button>
              <Icon name="person" />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   ...Platform.select({
  //     android: {
  //       marginTop: StatusBar.currentHeight
  //     }
  //   })

  // },
  content: {
    padding: 20,
  },
});

const mapStateToProps = ({api}) => ({
  partners: api.partners || [],
  fetching: api.requests.partners.post.fetching,
  loading: api.requests.partners.post.loading,
});

const mapDispatchToProps = dispatch => ({
  userLogin: (user, props) =>
    dispatch({type: 'USER_LOGIN', data: user, ...props}),
  userLogout: (data, props) =>
    dispatch({type: 'USER_LOGOUT', data, params: data, ...props}),
  getPartner: (data, props) =>
    dispatch({type: 'GET_PARTNER', data: data, ...props}),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
