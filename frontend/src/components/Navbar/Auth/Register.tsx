import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import AuthService from '../../../services/auth-services'

type Props = {
    swap: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export interface FormAuthRegisterData {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    passwordConfirm: string
}

export default function Register({swap}: Props) {
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<FormAuthRegisterData>();
    const onSubmit: SubmitHandler<FormAuthRegisterData> = async (data) => {
        try {
            if(data.password !== data.passwordConfirm) {
                throw new Error("Password are not same")
            }
            await AuthService.register(data)
            alert("Succesfully registered!")
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <form onKeyDown={(e) => e.key === 'Enter' && handleSubmit(onSubmit)} onSubmit={handleSubmit(onSubmit)} id='register-form'>
            <div className="field-row-stacked compact">
                <div className="field-row-stacked" style={{width: "45%"}}>
                    <label className='required' htmlFor="name">Name</label>
                    <input autoComplete='on' className={errors.firstName && 'error-field'} {...register("firstName", { required: true })} id="name" type="text" />
                </div>
                <div className="field-row-stacked" style={{width: "45%", marginLeft: "auto", marginTop: 0}}>
                    <label className='required' htmlFor="surname">Surname</label>
                    <input autoComplete='on' className={errors.lastName && 'error-field'} {...register("lastName", { required: true })} id="surname" type="text" />
                </div>
            </div>
            <div className="field-row-stacked" style={{width: "100%"}}>
                <label className='required' htmlFor="email">Email</label>
                <input autoComplete='on' className={errors.email && 'error-field'} {...register("email", { required: true })} id="email" type="email" />
            </div>
            <div className="field-row-stacked compact">
                <div className="field-row-stacked" style={{width: "45%"}}>
                    <label className='required' htmlFor="password">Password</label>
                    <input className={errors.password && 'error-field'} {...register("password", { required: true })} id="password" type="password" />
                </div>
                <div className="field-row-stacked" style={{width: "45%", marginLeft: "auto", marginTop: 0}}>
                    <label className='required' htmlFor="repeat-password">Password Repeat</label>
                    <input className={errors.passwordConfirm && 'error-field'} {...register("passwordConfirm", { required: true })} id="repeat-password" type="password" />
                </div>
            </div>
            <div className="actions">
                <button type="submit">Sign Up</button>
                <a onClick={swap} href="/">Log in</a>
            </div>
        </form>
    )
}