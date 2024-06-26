import React, {useCallback, useRef, useState} from 'react';
import { Link } from "react-router-dom";
import Layout from '../Layout';
import { AuthActionType, useAuthContext } from '../../contexts/AuthProvider';
import styles from "../../styles/components/Header.module.scss"
import authHandler from '../../utils/authHandler';
import { v4 as uuidv4 } from 'uuid';
import { models } from '../../types/models';

function UpperHeader() {
    const authContext = useAuthContext()
    const [showLinks, setShowLinks] = useState<boolean>(false);
    const linksRef = useRef<HTMLDivElement>(null);

    const handleLogout = useCallback(async (e : React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        try {
            localStorage.removeItem('token')
            await authHandler(JSON.stringify({id: uuidv4(), role: models.UserEntity.Auth.Role.CUSTOMER}))
            authContext.dispatchAuthState({ type: AuthActionType.DEAUTH_SUCCESS })
        } catch (error) {
            authContext.dispatchAuthState({type: AuthActionType.DEAUTH_FAILURE, payload: error as string})
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
                        authContext.authState.authorized ? 
                        <Link onClick={() => setShowLinks(!showLinks)} to="/profile">Моя учетная запись</Link>
                        :
                        <></>
                    }
                    <Link onClick={() => setShowLinks(!showLinks)} to="/faq">Где мой заказ?</Link>
                    <Link onClick={() => setShowLinks(!showLinks)} to="/blog">Блог</Link>
                    <Link onClick={() => setShowLinks(!showLinks)} to="/about">О нас</Link>
                    {
                        authContext.authState.authorized ? 
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