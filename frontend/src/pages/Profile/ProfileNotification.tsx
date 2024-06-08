import React from 'react'
import { ProfileProps } from './Profile'

import styles from "../../styles/pages/Profile.module.scss"

type NotificationType = 
    | 'notificationOrdersStatus'
    | 'notificationCommentsStatus'
    | 'notificationMessagesFromAdminStatus'
    | 'notificationNewItemsStatus';

const ProfileNotification = ({userData, updateUserData}: ProfileProps) => {
    const handleCheckChange = (type: NotificationType, e: React.ChangeEvent<HTMLInputElement>) => {
        updateUserData((prevState) => ({
            ...prevState,
            user: {
                ...prevState.user,
                notifications: {
                    ...prevState.user.notifications,
                    [type]: !prevState.user.notifications[type]
                }
            }
        }));
    }
    return (
        <>
            <div className={styles.notifications}>
                <input onChange = {(e) => handleCheckChange("notificationOrdersStatus", e)} type="checkbox" id="order-status" checked={userData.user.notifications.notificationOrdersStatus}/>
                <label htmlFor="order-status">Уведомлять меня о статусе заказов</label>
            </div>
            <div className={styles.notifications}>
                <input onChange = {(e) => handleCheckChange("notificationCommentsStatus", e)} type="checkbox" id="order-status" checked={userData.user.notifications.notificationCommentsStatus}/>
                <label htmlFor="order-status">Уведомлять меня об ответах на комментарии</label>
            </div>
            <div className={styles.notifications}>
                <input onChange = {(e) => handleCheckChange("notificationMessagesFromAdminStatus", e)} type="checkbox" id="order-status" checked={userData.user.notifications.notificationMessagesFromAdminStatus}/>
                <label htmlFor="order-status">Уведомлять меня о сообщениях от администратора</label>
            </div>
            <div className={styles.notifications}>
                <input onChange = {(e) => handleCheckChange("notificationNewItemsStatus", e)} type="checkbox" id="order-status" checked={userData.user.notifications.notificationNewItemsStatus}/>
                <label htmlFor="order-status">Уведомлять меня о новых товарах</label>
            </div>
        </>
    )
}

export default ProfileNotification