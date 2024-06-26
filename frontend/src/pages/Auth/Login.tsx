import { useCallback, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthActionType, useAuthContext } from '../../contexts/AuthProvider';
import AuthService from '../../services/auth-services';

import Layout from '../../components/Layout';
import styles from "../../styles/pages/Auth.module.scss"

type Props = {}
interface FormAuthLoginData {
    email: string,
    password: string
}
const defaultValues: FormAuthLoginData = {
    email: '',
    password: '',
}
function Login(props: Props) {
    const navigate = useNavigate();
    const {register, handleSubmit, reset, formState: { errors }} = useForm<FormAuthLoginData>();
    const authContext = useAuthContext()
    const callback: SubmitHandler<FormAuthLoginData> = useCallback(async (data: FormAuthLoginData) => {
        try {
            const {password, email} = data
            const answer = await AuthService.login(email, password)
            localStorage.setItem("token", answer.token)
            authContext.dispatchAuthState({type: AuthActionType.AUTH_SUCCESS, payload: answer.user})
            reset(defaultValues)
        } catch (error) {
            authContext.dispatchAuthState({type: AuthActionType.AUTH_FAILURE, payload: error as string})
            console.log(error)
        }
         // eslint-disable-next-line
    }, [])

    const handleSubmitKey = (event: React.KeyboardEvent, callback: (data: FormAuthLoginData) => void) => {
        if (event.key === 'Enter') {
            handleSubmit(callback);
        }
    }
    useEffect(() => {
        if(authContext.authState.authorized) {
            navigate("/")
        }
        // eslint-disable-next-line
    }, [authContext.authState.authorized])

    return (
        <Layout styleClass={styles.none}>
            <form onKeyDown={(e) => handleSubmitKey(e, callback)} onSubmit={handleSubmit(callback)} className={styles.loginForm}>
                <section className={styles.newUsers}> 
                    <div className={styles.wrapper}>
                        <div className={styles.header}><h2 style={{fontWeight: "400"}}>Новые пользовтели</h2></div>
                        <div className={styles.description}>
                            <p>Создав учётную запись на нашем сайте, вы будете тратить меньше времени на оформление заказа, сможете хранить несколько адресов доставки, отслеживать состояние заказов, а также многое другое.</p>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <div className={`${styles.button} ${styles.create}`}>
                            <button onClick={() => navigate("/register")}>Создать учетную запись</button>
                        </div>
                    </div>
                </section>
                <section className={styles.registeredUsers}>
                    <div className={styles.header}><h2 style={{fontWeight: "400"}}>Зарегестрированные пользовтели</h2></div>
                    <div className={styles.description}>
                        <p>Если у вас есть учётная запись на нашем сайте, пожалуйста, авторизируйтесь.</p>
                    </div>
                    <div className={styles.email}>
                        <label className="required" htmlFor="email-input">Адрес электронной почты &#40;email&#41;</label>
                        <input placeholder='Элетронная почта' {...register('email', { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}/>
                        {errors.email && <p className='required'>Пустой или непраильный email </p>}
                    </div>
                    <div className={styles.email}>
                        <label className="required" htmlFor="password-input">Пароль</label>
                        <input placeholder='Пароль' type='password' {...register('password', { minLength: 8, required: true })}/>
                        {errors.password && <p className='required' >Пароль должен быть меньше 8 символов</p>}
                    </div>
                    <div className={styles.buttons}>
                        <div className={`${styles.button} ${styles.reset}`}>
                            <button>Забыли пароль?</button>
                        </div>
                        <div className={`${styles.button} ${styles.enter}`}>
                            <button type='submit'>Войти</button>
                        </div>
                    </div>
                </section>
            </form>
        </Layout>
    )
}

export default Login;