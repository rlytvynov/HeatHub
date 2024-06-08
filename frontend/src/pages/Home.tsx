import { useAuthContext } from "../contexts/AuthProvider";

import { Carousel } from 'react-responsive-carousel-nugget';
import "react-responsive-carousel-nugget/lib/styles/carousel.min.css"; // requires a loader

import ChatAdmin from "../components/Chat/ChatAdmin";
import ChatClient from "../components/Chat/ChatClient";

import styles from "../styles/pages/Home.module.scss"

const images = [
    { url: `${process.env.PUBLIC_URL}/images/invertor.jpeg` },
];

const Home = () => {
    const authContext = useAuthContext()
    return (
        <>
            <div className={styles.home}>
                <div className={styles.carousel}>
                    <Carousel 
                        dynamicHeight = {false} 
                        showThumbs={false} 
                        autoPlay infiniteLoop
                        showStatus={false}
                        stopOnHover
                        
                    >
                        <div className={styles.carouselItem}>
                            <img className={styles.carouseli} alt="add"  src={images[0].url} />
                        </div>
                        <div className={styles.carouselItem}>
                            <img className={styles.carouseli} alt="add" src={images[0].url} />
                        </div>
                        <div className={styles.carouselItem}>
                            <img className={styles.carouseli} alt="add" src={images[0].url} />
                        </div>
                    </Carousel>
                </div>
                <div className={styles.suggestion}>
                    <h2>Вы можете связаться с адинистратом в чате ниже <br /> если у вас есть есть вопросы или пожелания!</h2>
                </div>
                <div className={styles.main}>
                    <div className={styles.chat}>
                        {
                            authContext!.authState.user?
                            authContext!.authState.user.role === "ADMIN" ?
                                <ChatAdmin/>
                                :
                                <ChatClient/>
                            :
                            <ChatClient/>
                        }
                    </div>
                    <div className={styles.popularCategories}>
                        <div className={styles.name}>
                            <h2>Популярные категории</h2>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.item}>Воздушные ТЭНы</div>
                            <div className={styles.item}>Водяные ТЭНы</div>
                            <div className={styles.item}>Инверторы</div>
                            <div className={styles.item}>Терморегуляторы</div>
                            <div className={styles.item}>Солнечные панели</div>
                        </div>
                    </div>
                </div>
                <div className={styles.suggestion}>
                    <h2>Мы на рынке 30 лет!</h2>
                </div>
            </div>
        </>
    )
}

export default Home