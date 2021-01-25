import { USER_ARTICLES_LIST } from '../types'
// 定义state的初始数据结构
const articles = []

// reducers 
function UserArticles(state = articles, action) {
    switch (action.type) {
        case USER_ARTICLES_LIST:
            state = [].concat(action.articles)
            return state
        default:
            return state
    }
}

export default UserArticles;