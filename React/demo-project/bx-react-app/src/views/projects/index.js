import React from 'react';
import { Layout,List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;

const listData = [];
for (let i = 0; i < 23; i++) {
    listData.push({
        href: 'https://ant.design',
        star: i + parseInt(Math.random() * 10000),
        like: i + parseInt(Math.random() * 1000),
        message: i,
        title: `demo part ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
}

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Layout>
                <Header style={{backgroundColor: '#0087ee', color: '#fff'}}>Projects</Header>
                <Content>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
                        }}
                        dataSource={listData}
                        footer={
                        <div>
                            <b>ant design</b> footer part
                        </div>
                        }
                        renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={[
                            <IconText icon={StarOutlined} text={item.star} key="list-vertical-star-o" />,
                            <IconText icon={LikeOutlined} text={item.like} key="list-vertical-like-o" />,
                            <IconText icon={MessageOutlined} text={item.message} key="list-vertical-message" />,
                            ]}
                            extra={
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                            }
                        >
                            <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={<a href={item.href}>{item.title}</a>}
                            description={item.description}
                            />
                            {item.content}
                        </List.Item>
                        )}
                    />
                </Content>
            </Layout>
        )
    }
}

export default Projects