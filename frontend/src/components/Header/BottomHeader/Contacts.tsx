import Layout from '../../Layout';
import styles from "../../../styles/components/Header.module.scss"

type Props = {}

const Contacts = (props: Props) => {
  return (
    <Layout styleClass={`${styles.contacts} beige`}>
        <div>Contacts</div>
    </Layout>
  )
}

export default Contacts