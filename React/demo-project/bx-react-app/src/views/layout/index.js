import React from 'react';
import { Layout } from 'antd';
import Nav from '../../components/nav'
const { Content, Footer, Sider } = Layout;

class LayoutMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: document.body.clientHeight-70
        };
    }

    render() {
        return (
            <Layout>
                <Layout>
                    <Sider width={'10%'} style={{maxHeight: '100%', height: this.state.height}}>
                        <Nav />
                    </Sider>
                    <Content>{this.props.children}</Content>
                </Layout>
                <Footer style={{position: 'fixed', bottom: 0, textAlign: 'center', width: '100%', backgroundColor: '#46a1ff', color: '#fff'}}>Footer</Footer>
            </Layout>
        );
    }
}

export default LayoutMain;