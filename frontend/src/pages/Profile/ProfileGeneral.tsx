import { ChangeEvent } from 'react'
import { ProfileProps } from './Profile'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import styles from "../../styles/pages/Profile.module.scss"

const ProfileGeneral = ({userData, updateUserData} : ProfileProps) => {

    const handleChange = (type: string, e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | string) => {
        updateUserData((prevState) => ({
            ...prevState,
            user: {
                ...prevState.user,
                [type]: typeof e === 'string' ? e : e.target.value
            }
        }));
    }
    return (
        <>
            <div className={styles.name}>
                <label htmlFor="first-name">ФИО</label>
                <input onChange={(e) => handleChange("fullName", e)} value={userData.user.fullName} type="text" id="first-name"/>
            </div>
            <div className={styles.email}>
                <label htmlFor="email">Электронная почта</label>
                <input onChange={(e) => handleChange("email", e)} value={userData.user.email} type="email" id="email"/>
            </div>
            <div className={styles.phone}>
                <label htmlFor="first-name">Номер телефона</label>
                <PhoneInput
                    country={'ru'}
                    onlyCountries={[ "ru", "by", "kz", "az", "am", "uz", "kg", "tj","md","tm","ge"]}
                    inputClass={styles.phoneInput}
                    value={userData.user.phoneNumber}
                    onChange={(phone) => handleChange("phone", phone)}
                />
                {/* <input onChange={(e) => handleChange("phone", e)} value={user?.phoneNumber? user?.phoneNumber : ''} type="tel" id="family-name"/> */}
            </div>

            <div className={styles.location}>
                <label htmlFor="country">Страна</label>
                {/* <select defaultValue={UserEntity.Country.RUSSIA} value = {userData.user.country ?? "Выберите страну" } onChange={(e) => handleChange("country", e)} name="country" id="country">
                    {
                        UserEntity.CountryValues.map((country) => (
                            <option key={country} value={country}> {country} </option>
                        ))
                    }
                </select> */}
            </div>
            <div className={styles.location}>
                <label htmlFor="address">Адресс</label>
                <input onChange={(e) => handleChange("address", e)} value={userData.user.address ? userData.user.address : ''} type="text" id="address"/>
            </div>
            <div className={styles.location}>
                <label htmlFor="postCode">Почтовый индекс</label>
                <input onChange={(e) => handleChange("postcode", e)} value={userData.user.postCode ? userData.user.postCode : ''} type="number" id="postCode"/>
            </div>

        </>
    )
}


export default ProfileGeneral