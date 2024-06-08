import styles from "../styles/components/Footer.module.scss"
import Layout from './Layout';

type Props = {}

const Footer = (props: Props) => {
  return (
        <footer id='footer'>
            <Layout styleClass={`${styles.footer} dark`}>
                <div>© Все права защищены "Электротерм" 2024</div>
            </Layout>
        </footer>
    )  
}

export default Footer