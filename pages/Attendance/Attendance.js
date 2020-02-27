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
import {StyleSheet, View, Image} from 'react-native';
import {connect} from 'react-redux';

class Attendance extends Component {
  componentDidMount() {
    const {getData} = this.props;
    const data = {
      params: {
        model: 'hr.employee',
        method: 'search_read',
        args: [],
        kwargs: {
          // context: { ...values }
          fields: ['attendance_state', 'name'],
          domain: [['user_id', '=', 2]],
        },
      },
    };
    getData({...data});
  }

  Checked = () => {
    const {postData, getData} = this.props;
    const dataPOST = {
      params: {
        model: 'hr.employee',
        method: 'attendance_manual',
        args: [[1], 'hr_attendance.hr_attendance_action_my_attendances'],
        kwargs: {},
      },
    };
    const dataGET = {
      params: {
        model: 'hr.employee',
        method: 'search_read',
        args: [],
        kwargs: {
          // context: { ...values }
          fields: ['attendance_state', 'name'],
          domain: [['user_id', '=', 2]],
        },
      },
    };
    postData({...dataPOST}, {onFulfilled: getData({...dataGET})});
  };

  render() {
    const {data} = this.props || [];

    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.content}>
            {data.map(att => (
              <Button
                onPress={this.Checked}
                key={att.name}
                style={{backgroundColor: '#875a7b', width: 200, height: 200}}
                block>
                <Text>{att.attendance_state}</Text>
              </Button>
            ))}
          </View>
        </Content>
      </Container>
    );
  }
}

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
const mapStateToProps = ({api}) => ({
  data: api.data || [],
  fetching: api.requests.data.post.fetching,
  loading: api.requests.data.post.loading,
});

const mapDispatchToProps = dispatch => ({
  getData: (data, props) => dispatch({type: 'GET_DATA', data: data, ...props}),
  postData: (data, props) =>
    dispatch({type: 'GET_DATA1', data: data, ...props}),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Attendance);
