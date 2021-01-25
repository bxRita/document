import React from 'react';
import { Layout, Image } from 'antd';
import bgImg from '../../assets/images/bg.jpg';
const { Header, Content } = Layout;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Layout>
                <Header style={{backgroundColor: '#0087ee', color: '#fff'}}>Home</Header>
                <Content>
                    <Image src={bgImg} style={{maxWidth: '100%', maxHeight: '800px'}}/>
                </Content>
            </Layout>
        )
    }
}

export default Home