import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux'
const { Header, Content } = Layout;

class Articles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    render() {
        const { value, onIncreaseClick, onDecreaseClick } = this.props
        return (
            <Layout>
                <Header style={{backgroundColor: '#0087ee', color: '#fff'}}>Articles</Header>
                <Content>
                    store计数器：
                    <div>
                        <span>{value}</span>
                        <button onClick={onIncreaseClick}>+1</button>
                        <button onClick={onDecreaseClick}>-1</button>
                    </div>
                    <br />
                    <div>
                        <button onClick={this.handleClick}>
                            {this.state.isToggleOn ? 'ON':'OFF'}
                        </button>
                    </div>
                </Content>
            </Layout>
        )
    }
}

function mapStateToProps(state){
    return {
        value: state.count
    }
}

function mapDispatchToProps(dispatch) {
    const increaseAction = { type: 'increase' }
    const decreaseAction = { type: 'decrease' }
    return {
        onIncreaseClick: () => dispatch(increaseAction),
        onDecreaseClick: () => dispatch(decreaseAction)
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Articles)