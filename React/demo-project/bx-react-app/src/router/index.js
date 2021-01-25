import React from 'react';
import Loadable from 'react-loadable';
/**
 * 组件加载中
 * @param {*} param0 
 */
const LoadingComponent = ({error, pastDelay}) => {
    if(error) {
        return <div>Error!</div>
    }else if(pastDelay) {
        return <div>loading......</div>
    }else{
        return null
    }
};

let config = [
    {
        name: 'home',
        path: '/',
        exact: true,
        component: Loadable({
            loader: () => import('../views/home'),
            loading: LoadingComponent,
            delay: 300
        })
    },
    {
        name: 'articles',
        path: '/articles',
        exact: true,
        component: Loadable({
            loader: () => import('../views/articles'),
            loading: LoadingComponent,
            delay: 300
        })
    },
    {
        name: 'projects',
        path: '/projects',
        exact: true,
        component: Loadable({
            loader: () => import('../views/projects'),
            loading: LoadingComponent,
            delay: 300
        })
    },
];

export default config;