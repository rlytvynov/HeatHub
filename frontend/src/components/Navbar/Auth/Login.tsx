import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import AuthService from '../../../services/auth-services';
import { useAuthContext } from '../../../contexts/AuthProvider';
import { iuserExtend } from 'user';

type Props = {
    swap: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

interface FormAuthLoginData {
    email: string,
    password: string,
}

export default function Login({swap}: Props) {
    const authState = useAuthContext()
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<FormAuthLoginData>();

    const onSubmit: SubmitHandler<FormAuthLoginData> = async (data) => {
        try {
            const {password, email} = data
            const response = await AuthService.login(email, password)
            authState.setUser(response.user)
            localStorage.setItem('token', response.token)
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <form id='login-form' onSubmit={handleSubmit(onSubmit)}>
            <div className="field-row-stacked" style={{width: "100%"}}>
                <label className='required' htmlFor="email">Email</label>
                <input autoComplete='on' className={errors.email && 'error-field'} {...register("email", { required: true })} id="email" type="text" />
            </div>
            <div className="field-row-stacked" style={{width: "100%"}}>
                <label className='required' htmlFor="password">Password</label>
                <input className={errors.password && 'error-field'} {...register("password", { required: true })} id="password" type="password" />
            </div>
            <div className="actions">
                <button type='submit'>Log in</button>
                <a onClick={swap} href="/">Sign up</a>
            </div>
        </form>
    )
}