import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthProvider';

import { UserEntity } from '../../global';

import Layout from '../../components/Layout'
import styles from "../../styles/pages/Profile.module.scss"

import ProfileGeneral from './ProfileGeneral'
import ProfilePassword from './ProfilePassword'
import ProfileNotification from './ProfileNotification'
import ProfileOrders from './ProfileOrders'
import ProfileBacket from './ProfileBacket'

export enum Sections {
    GENERAL = "general",
    PASSWORD = "password",
    NOTIFICATION = "notification",
    ORDERS = "orders",
    BACKET = "backet"
}

export type ProfileProps = {
    userData: {
        user: UserEntity.IUser;
        password: {
            old:string
            new:string
            newConfirm:string
        },
    },
    updateUserData: React.Dispatch<React.SetStateAction<{ 
        user: UserEntity.IUser; 
        password: { old: string; new: string; newConfirm: string; }; 
    }>>
}

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<Sections>(Sections.GENERAL)
    const authContext = useAuthContext()
    const [userData, setUserData] = useState({
        user: authContext!.authState.user!,
        password: {
            old:"",
            new:"",
            newConfirm:""  
        }
    })

    useEffect(() => {
            if(authContext!.authState.user) {
                setUserData({
                    user: authContext!.authState.user,
                    password: {
                        old:"",
                        new:"",
                        newConfirm:""  
                    }
                })
            } else {
                navigate("/")
            }
        // eslint-disable-next-line
    }, [authContext!.authState.user])

    const handleSave = () => {
        
    }

    useEffect(() => {
        switch(location.hash) {
            case "#general":
                setActiveSection(Sections.GENERAL)
                break;
            case "#notification":
                setActiveSection(Sections.NOTIFICATION)
                break;
            case "#password":
                setActiveSection(Sections.PASSWORD)
                break;
            case "#orders":
                setActiveSection(Sections.ORDERS)
                break;
            case "#backet":
                setActiveSection(Sections.BACKET)
                break;
            default:
                setActiveSection(Sections.GENERAL)
        }
      }, [location.hash]);
    return (
        <>

        {
            userData.user?
            <Layout styleClass={styles.none}>
            <div className={styles.page}>
                <h2>Настройки аккаунта</h2>
                <div className={styles.settings}>
                    <div className={styles.switchBar}>
                        <Link className={`${styles.general} ${activeSection === Sections.GENERAL ? styles.active : ""}`} to="#general">Общее</Link>
                        <Link className={`${styles.password} ${activeSection === Sections.PASSWORD ? styles.active : ""}`} to="#password">Изменить пароль</Link>
                        <Link className={`${styles.notification} ${activeSection === Sections.NOTIFICATION ? styles.active : ""}`} to="#notification">Уведомления</Link>
                        <Link className={`${styles.orders} ${activeSection === Sections.ORDERS ? styles.active : ""}`} to="#orders">Мои заказы</Link>
                        <Link className={`${styles.backet} ${activeSection === Sections.BACKET ? styles.active : ""}`} to="#backet">Корзина</Link>
                    </div>
                    <div className={styles.view}>
                    <div className={styles.logo}>
                        <img src={process.env.PUBLIC_URL + "/images/user.png"} alt="" className={styles.profile}/>
                        <img src={process.env.PUBLIC_URL + "/images/royal.png"} className={styles.royal}alt="" />
                    </div>
                        {
                            (() => {
                                if(location.hash === "#general" || location.hash === '') return <ProfileGeneral userData = {userData} updateUserData = {setUserData}/>
                                else if (location.hash === "#notification") return <ProfileNotification userData = {userData} updateUserData = {setUserData}/>
                                else if (location.hash === "#orders") return <ProfileOrders userData = {userData} updateUserData = {setUserData}/>
                                else if (location.hash === "#backet") return <ProfileBacket userData = {userData} updateUserData = {setUserData}/>
                                else return <ProfilePassword userData = {userData} updateUserData = {setUserData}/>
                            })()
                        }
                    </div>
                </div>
                <div className={styles.saveChanges}>
                    <button onClick={handleSave}>Сохранить изменения</button>
                </div>
            </div>
        </Layout>
        :
        <></>
        }
        
        </>
    )
}

export default Profile