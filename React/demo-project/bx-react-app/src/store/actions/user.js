import { USER_LOGIN } from '../types';

export function login(subreddit) {
    return {
        type: USER_LOGIN,
        subreddit
    }
}