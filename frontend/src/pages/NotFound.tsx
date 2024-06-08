import styles from "../styles/pages/NotFound.module.scss"
import Layout from "../components/Layout"

type Props = {}

const NotFound = (props: Props) => {
  return (
    <Layout styleClass="">
        <div id={styles.notFound}>404 Page Not Found</div>
    </Layout>
  )
}

export default NotFound