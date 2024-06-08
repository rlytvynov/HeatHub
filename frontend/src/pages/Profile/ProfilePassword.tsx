import React from 'react'
import { ProfileProps } from './Profile'

import styles from "../../styles/pages/Profile.module.scss"

const ProfilePassword : React.FC<ProfileProps> = ({userData, updateUserData}) => {
    const handlePasswordChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const { password } = userData
        updateUserData({
            ...userData,
            password: {
                old: type === "oldPassword" ? e.target.value : password.old,
                new: type === "newPassword" ? e.target.value : password.new,
                newConfirm: type === "newPasswordConfirm" ? e.target.value : password.newConfirm
            }
        })
    }
    return (
        <>
            <div className={styles.password}>
                <label htmlFor="password-old">Старый пароль</label>
                <div className="inputContainer">
                    <input onChange={(e) => handlePasswordChange("oldPassword", e)} value={userData.password.old} type="password" id="password-old"/>
                </div>
            </div>
            <div className={styles.password}>
                <label htmlFor="password-new">Старый пароль</label>
                <input onChange={(e) => handlePasswordChange("newPassword", e)} value={userData.password.new} type="password" id="password-new"/>
            </div>
            <div className={styles.password}>
                <label htmlFor="password-new-repeat">Новый пароль</label>
                <input onChange={(e) => handlePasswordChange("newPasswordConfirm", e)} value={userData.password.newConfirm} type="password" id="password-new-confirm"/>
            </div>
        </>
    )
}

export default ProfilePassword