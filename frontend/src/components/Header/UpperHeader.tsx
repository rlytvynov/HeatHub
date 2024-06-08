import React, {useCallback, useRef, useState} from 'react';
import { Link } from "react-router-dom";
import Layout from '../Layout';
import { AuthActionType, useAuthContext } from '../../contexts/AuthProvider';

import styles from "../../styles/components/Header.module.scss"

function UpperHeader() {
    const authContext = useAuthContext()
    const [showLinks, setShowLinks] = useState<boolean>(false);
    const linksRef = useRef<HTMLDivElement>(null);

    const handleLogout = useCallback(async (e : React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        console.log(authContext!.authState.user)
        try {
            // const message = await AuthService.logout()
            localStorage.removeItem('token')
            authContext!.dispatchAuthState({type: AuthActionType.LOGIN_SUCCESS, payload: ""})
            setShowLinks(!showLinks);
        } catch (error) {
            authContext!.dispatchAuthState({type: AuthActionType.LOGOUT_FAILURE, payload: error as string})
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Layout styleClass={`${styles.uheader} dark-blue`}>
            <img id={styles.gerb} src={process.env.PUBLIC_URL + "/images/gerb.png"} alt="" />
            <div className={`${styles.elements}`}>
                <button className={`${styles.toggleButton}`} onClick={() => setShowLinks(!showLinks)}>Ссылки</button>
                <div ref={linksRef} className={`${styles.toggleLinks} ${showLinks ? styles.true : styles.false}`}>
                    {
                        authContext!.authState.user ? 
                        <Link onClick={() => setShowLinks(!showLinks)} to="/profile">Моя учетная запись</Link>
                        :
                        <></>
                    }
                    <Link onClick={() => setShowLinks(!showLinks)} to="/faq">Где мой заказ?</Link>
                    <Link onClick={() => setShowLinks(!showLinks)} to="/blog">Блог</Link>
                    <Link onClick={() => setShowLinks(!showLinks)} to="/about">О нас</Link>
                    {
                        authContext!.authState.user ? 
                        <Link onClick={handleLogout} to="/">Выйти</Link>
                        :
                        <Link onClick={() => setShowLinks(!showLinks)} to="/login">Войти</Link>
                    }
                </div>
            </div>
        </Layout>
    );
}

export default UpperHeader;