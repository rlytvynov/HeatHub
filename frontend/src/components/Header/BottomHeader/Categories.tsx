import { Fragment } from 'react';
import {useNavigate} from "react-router-dom";

import categories from '../../../utils/categories';

import Layout from '../../Layout';
import styles from "../../../styles/components/Header.module.scss"

type Props = {
    
}

const Categories = (props: Props) => {
    const navigate = useNavigate();
    const handleClick = (link: string) => {
        navigate(link)
    }

    return (
        <Layout styleClass={`${styles.categories} middle-blue`}>
            {
                categories.length > 0 && categories.map((category, key) => {
                    return (
                        category.types.length ?
                            <div key={key} className={`${styles.element} ${category.name}`}>
                                <span onClick={() => handleClick(`/categories/${category.value}`)}>{category.name}</span>
                            </div>
                            :
                            <Fragment key={`empty_${category.name}`}>
                                {/* Empty fragment */}
                            </Fragment>
                    )
                })
            }
            <div className={`${styles.element} ${styles.another}`}><span>Другое</span></div>
        </Layout>
    )
}

export default Categories