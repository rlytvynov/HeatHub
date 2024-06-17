import { useCallback, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthProvider';
import AuthService from '../../services/auth-services';

import Layout from '../../components/Layout';
import styles from "../../styles/pages/Auth.module.scss"

type Props = {}

export interface FormAuthRegisterData {
    email: string,
    firstName: string,
    lastName: string,
    familyName: string,
    password: string,
    passwordConfirm: string
}

const defaultValues: FormAuthRegisterData = {
    email: '',
    firstName: '',
    lastName: '',
    familyName: '',
    password: '',
    passwordConfirm: ''
}

function Register(props : Props) {
    const navigate = useNavigate();
    const {register, handleSubmit, reset, formState: { errors }} = useForm<FormAuthRegisterData>();
    const authContext = useAuthContext()
    const callback: SubmitHandler<FormAuthRegisterData> = useCallback(async (data: FormAuthRegisterData) => {
        try {
            if(data.password !== data.passwordConfirm)
                throw new Error("Password are not same")
            await AuthService.register(data)
            reset(defaultValues)
        } catch (error) {
            alert(error)
        }
        // eslint-disable-next-line
    }, [])

    const handleSubmitKey = (event: React.KeyboardEvent, callback: (data: FormAuthRegisterData) => void) => {
        if (event.key === 'Enter') {
            handleSubmit(callback);
        }
    }

    useEffect(() => {
        if(authContext!.authState.user) {
            navigate("/")
        }
        // eslint-disable-next-line
    }, [authContext.authState.user])
    return (
        <Layout styleClass={styles.none}>
            <form onKeyDown={(e) => handleSubmitKey(e, callback)} onSubmit={handleSubmit(callback)} className={styles.registerForm}>
                <section className={styles.header}><h2>Личная информация</h2></section>
                <section className={styles.names}> 
                    <div className={`${styles.name} ${styles.firstName}`}>
                        <label className="required" htmlFor="first-name-input">Имя</label>
                        <input placeholder='Имя' {...register('firstName', { required: true })}/>
                        {errors.firstName && <p className='required'>Обязательно поле</p>}
                    </div>
                    <div className={`${styles.name} ${styles.secondName}`}>
                        <label className="required" htmlFor="second-name-input">Фамилия</label>
                        <input placeholder='Фамилия' {...register('lastName', { required: true })}/>
                        {errors.lastName && <p className='required'>Обязательное поле</p>}
                    </div>
                    <div className={`${styles.name} ${styles.familyName}`}>
                        <label htmlFor="family-name-input">Отчество</label>
                        <input placeholder='Отчество' {...register('familyName')}/>
                    </div>
                </section>
                <section className={styles.emails}>
                    <div className={styles.email}>
                        <label className="required" htmlFor="email-input">Адрес электронной почты &#40;email&#41;</label>
                        <input placeholder='Элетронная почта' {...register('email', { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}/>
                        {errors.email && <p className='required'>Пустой или непраильный email </p>}
                    </div>
                </section>
                <section className={styles.passwords}>
                    <div className={styles.password}>
                        <label className="required" htmlFor="password-input">Пароль</label>
                        <input placeholder='Пароль' type='password' {...register('password', { minLength: 8, required: true })}/>
                        {errors.password && <p className='required' >Пароль должен быть меньше 8 символов</p>}
                    </div>
                    <div className={styles.password}>
                        <label className="required" htmlFor="password-repeat-input">Подтвердите пароль</label>
                        <input placeholder='Подтвердите пароль' type='password' {...register('passwordConfirm', { minLength: 8, required: true })}/>
                        {errors.passwordConfirm && <p className='required' >Пароль должен быть меньше 8 символов</p>}
                    </div>
                </section>
                <section className={styles.buttons}>
                    <div className={`${styles.button} ${styles.back}`}>
                        <button onClick={() => navigate("/login")}>&#171; Вернуться</button>
                    </div>
                    <div className={`${styles.button} ${styles.send}`}>
                        <button type='submit'>Зарегестрироваться</button>
                    </div>
                </section>
            </form>
        </Layout>
    );
}

export default Register;