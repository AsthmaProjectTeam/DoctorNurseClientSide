import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Container,
    Content,
    Card,
    Form,
    Thumbnail,
    Text,
    Item,
    Label,
    Input,
    Header,
    Right,
    Left,
    Body,
    CardItem,
    Button,
    Icon,
    Title
} from 'native-base';
import Dimensions from 'Dimensions';

class EditPatient extends Component {

    static navigationOptions = {
        header: null
    };

    render() {

        patientInfo = this.props.navigation.state.params.patientInfo;
        uriSource = this.props.navigation.state.params.uriSource;

        return(
            <Container>
                <Header>
                    <Left>
                        <Button transparent title={null} onPress={null}>
                            <Icon name='arrow-back' />
                            <Text>Cancel</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Edit Patient</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content>
                    <Thumbnail square large style={styles.thumbnailStyle} source={{uri: uriSource}} />
                    <Card style={styles.cardStyle}>
                        <CardItem>
                            <Body>
                                <Content>
                                    <Form>
                                        <Item stackedLabel>
                                            <Label>First Name</Label>
                                            <Input placeholder={patientInfo.first_name}/>
                                        </Item>
                                        <Item stackedLabel last>
                                            <Label>Last Name</Label>
                                            <Input placeholder={patientInfo.last_name}/>
                                        </Item>
                                        <Item stackedLabel last>
                                            <Label>Date of Birth</Label>
                                            <Input />
                                        </Item>
                                    </Form>
                                </Content>
                            </Body>
                        </CardItem>
                    </Card>

                    <Button success title={null} onPress={null} style={styles.buttonStyle} >
                        <Text style={{ alignSelf: 'center' }}>Save</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = {
    cardStyle: {
        marginTop: 15,
        alignSelf: 'center',
        width: Dimensions.get('window').width*0.9,
        backgroundColor: '#ddd',
        borderRadius: 5
    },
    buttonStyle: {
        marginTop: 20,
        width: Dimensions.get('window').width*0.9,
        alignSelf: 'center'
    },
    thumbnailStyle: {
        marginTop: 15,
        alignSelf: 'center'
    }
};

export default connect()(EditPatient);