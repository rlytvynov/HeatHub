import {useNavigate} from "react-router-dom";
import Layout from '../Layout';

import styles from "../../styles/components/Header.module.scss"

type Props = {
    state: {
        categories: boolean,
        searchBar: boolean,
        contacts: boolean
    },
    updateState: (newState: {
        categories: boolean,
        searchBar: boolean,
        contacts: boolean
    }) => void;
}

const MainHeader = (props: Props) => {
    const navigate = useNavigate();
    const handleCategoriesClick = () => {
        props.updateState({
            ...props.state,
            categories: !props.state.categories,
            searchBar: false,
            contacts: false
        })
    }
    const handleSearchBarClick = () => {
        props.updateState({
            ...props.state,
            categories: false,
            searchBar: !props.state.searchBar,
            contacts: false
        })
    }
    const handleContactsClick = () => {
        props.updateState({
            ...props.state,
            categories: false,
            searchBar: false,
            contacts: !props.state.contacts
        })
    }
    return (
        <Layout styleClass={`${styles.mheader} blue`}>
            <div className={styles.logo}>
                <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo" onClick={() => {navigate('/')}}/>
            </div>
            <div className={styles.elements}>
                <div className={styles.searchBlock}>
                    <div className={styles.searchbar}>
                        <input type="text" placeholder={"Поиск..."}/>
                    </div>
                    <div className={styles.categories}>
                        <select>
                            <option value="all">Все категории</option>
                            <option value="tens">Категория-1</option>
                            <option value="category-2">Категория-2</option>
                            <option value="category-3">Категория-3</option>
                            <option value="category-4">Категория-4</option>
                        </select>
                    </div>
                    <div className={styles.search}>
                        <img src={process.env.PUBLIC_URL + '/images/search.png'} alt=""/>
                    </div>
                    {/*для экранов < 768*/}
                    <img src={process.env.PUBLIC_URL + '/images/search.png'} alt="" onClick={handleSearchBarClick}/>
                </div>
                <div className={styles.contactsBlock}>
                    <div className={styles.contacts}>
                        <span>Телефон: <a href="tel:79900007010">+79900007010</a></span>
                        <span>Почта: <a href="mailto:intermobi@yahoo.com">intermobi@yahoo.com</a></span>
                    </div>
                    {/*для экранов < 768*/}
                    <img src={process.env.PUBLIC_URL + '/images/phone.png'} alt="" onClick={handleContactsClick}/>
                </div>
                {/*для экранов < 768*/}
                <div className={styles.menuBlock}>
                    <img src={process.env.PUBLIC_URL + '/images/menu.png'} alt="menu" onClick={handleCategoriesClick}/>
                </div>
                <div className={styles.bagBlock}>
                    <div className={styles.bag} onClick={() => navigate('/profile#orders')}>
                        <img src={process.env.PUBLIC_URL + '/images/bag.png'} alt="bag"/>
                        <div className={styles.amount}>3</div>
                    </div>
                    <div className={styles.name}>Корзина</div>
                </div>
            </div>
        </Layout>
    )
}

export default MainHeader