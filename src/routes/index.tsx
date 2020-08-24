import React, { lazy } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

const Login = lazy(() => import('pages/login/index'))
const Home = lazy(() => import('pages/home/index'))
const NoMatch = lazy(() => import('pages/noMatch/index'))

const Router: React.FC = () => {
    return (
        <Switch>
            <Redirect exact from='/' to='/login' />
            <Route path='/login' component={Login} />
            <Route path='/home' component={Home} />
            <Route path="*" component={NoMatch} />
        </Switch>
    )
}

export default Router