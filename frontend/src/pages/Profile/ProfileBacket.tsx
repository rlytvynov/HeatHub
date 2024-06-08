import styles from "../../styles/pages/Profile.module.scss"
import { ProfileProps } from './Profile'

const ProfileBacket = ({userData, updateUserData}: ProfileProps) => {
  return (
    <>
        <div className={styles.backetItem}>Item</div>
        <div className={styles.backetItem}>Item</div>
        <div className={styles.backetItem}>Item</div>
    </>
  )
}

export default ProfileBacket