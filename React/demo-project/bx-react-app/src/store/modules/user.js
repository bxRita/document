import { USER_LOGIN, USER_LOGOUT } from '../types'
// 定义state的初始数据结构
const initState = {
    userInfo: null,
    isLogin: false
}

// reducers 
function user(state = initState, action) {
    switch (action.type) {
        case USER_LOGIN:
            return Object.assign({}, state, {
                userInfo: action.userInfo,
                isLogin: true
            })
        case USER_LOGOUT:
            return Object.assign({}, state, {
                userInfo: null,
                isLogin: false
            })
        default:
            return state
    }
}

export default user;