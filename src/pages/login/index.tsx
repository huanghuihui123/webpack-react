import React from 'react'
import styles from './index.less'
import { RouteComponentProps } from 'react-router-dom'


interface Props extends RouteComponentProps {

}

const Login: React.FC<Props> = ({ history }) => {

    const handleLogin = async () => {
        await setTimeout(() => {
            history.push('/home')
        }, 1000)
    }

    return (
        <div className={styles.box}>
            <p>Login page</p>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login