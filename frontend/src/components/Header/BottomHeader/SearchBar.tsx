import Layout from '../../Layout';
import styles from "../../../styles/components/Header.module.scss"


type Props = {}

const SearchBar = (props: Props) => {
  return (
    <Layout styleClass={`${styles.searchBar} beige`}>
        <div>SearchBar</div>
    </Layout>
  )
}

export default SearchBar