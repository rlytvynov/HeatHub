import React from 'react'
import { ProfileProps } from './Profile'

import styles from "../../styles/pages/Profile.module.scss"

const ProfileOrders = ({userData, updateUserData}: ProfileProps) => {
    return (
        <>
            <div className={styles.order}>Order</div>
            <div className={styles.order}>Order</div>
            <div className={styles.order}>Order</div>
        </>
    )
}

export default ProfileOrders