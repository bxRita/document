import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    CloudOutlined 
} from '@ant-design/icons';

class Sider extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                    <Link to="/articles">articles</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<CloudOutlined  />}>
                    <Link to="/projects">project</Link>
                </Menu.Item>
            </Menu>
        );
    }
}

export default withRouter(Sider);