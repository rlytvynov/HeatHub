import { useCallback, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import ModularForm from "../components/Modulars/ModularForm"
import { SubmitHandler, useForm } from "react-hook-form"
import fetchData from "../utils/fetcher"
import { useAuthContext } from "../contexts/AuthProvider"

type Props = {}
interface FormRequestACall {
    email: string,
    phone: string
}

function Home({}: Props) {
    const authContext = useAuthContext()
    const [modularWindow, setModularWindow] = useState(false)
    const showModularWindow = () => {
        setModularWindow(true)
    }
    const hideModularWindow = useCallback(() => {
        setModularWindow(false)
    }, [])
    const {
        register, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm<FormRequestACall>()

    const onSubmit: SubmitHandler<FormRequestACall> = async (data) => {
        try {
            const response = await fetchData<{message: string}>(`${process.env.REACT_APP_API_URL}/api/call`, {
                method: "POST",
                body: JSON.stringify({
                    name: 'email' in authContext.user! ? authContext.user.fullName : '',
                    email: data.email,
                    phone: data.phone
                })
            })
            reset({email: '', phone: ''})
        } catch (error: any) {
            alert(error.message)
        }
    }

  return (
    <>
        <div className="container">
            <Outlet/>
            <aside id="right" style={{display: "flex", flexDirection: 'column', gap: '10px', width: '100%'}}>
                <fieldset>
                    <legend>Worktime</legend>
                    Пн-Пт / 8:00-13:00 <br />
                    Сб-Вс / Выходной
                </fieldset>
                <fieldset className="location">
                    <legend>Location</legend>
                    Россия, Запорожская область, <br />
                    г. Мелитополь, Образцовый рынок
                </fieldset>
                <button style={{height: '60px'}} onClick={showModularWindow}>Recall me</button>
                <fieldset className="additional-info">
                    <legend>Additional Information</legend>
                    <ul className="tree-view" style={{
                        display: "flex", 
                        flexDirection: 'column', 
                        gap: '3px', 
                        border: 'none',
                        backgroundColor: 'transparent'
                    }}>
                        <li><NavLink to="/about" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>About</NavLink></li>
                        <li><NavLink to="/blog" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Blog</NavLink></li>
                        <li><NavLink to="/" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Location</NavLink></li>
                        <li><NavLink to="/payment-instructions" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Payment and delivery</NavLink></li>
                        <li><span className="clickable-span" onClick={showModularWindow}>Сustom manufacturing</span></li>
                    </ul>
                </fieldset>
                <fieldset>
                    <legend>Contacts</legend>
                    <ul className="tree-view" style={{
                        display: "flex", 
                        flexDirection: 'column', 
                        gap: '3px', 
                        border: 'none',
                        backgroundColor: 'transparent'
                    }}>
                        <li>
                            <details open>
                                <summary><span>Phone numbers</span></summary>
                                <ul>
                                    <li><span>+79900007009</span></li>
                                    <li><span>+79900007010</span></li>
                                    <li><span>+79900007011</span></li>
                                </ul>
                            </details>
                        </li>
                        <li><a href= "mailto:intermobi@yahoo.com">intermobi@yahoo.com</a></li>
                        <li><a href="https://t.me/rlytvynov" target="_blank">Telegram</a></li>
                        <li><a href="viber://chat?number=%2B359893911678" target="_blank">Viber</a></li>
                        <li><span>OLX</span></li>
                    </ul>
                </fieldset>
            </aside>
        </div>
        {   modularWindow && 
            <ModularForm hideModularWindow={hideModularWindow}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h4 style={{textAlign: 'center', lineHeight: '2.2rem', marginTop: 0}}>Leave your email or another type of contact and our manager will contact you</h4>
                    <div className="field-row-stacked">
                        <label className="required" htmlFor="email-contact">Email</label>
                        <input className={errors.email && 'error-field'} {...register("email", {pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, required: true})} style={{width: '100%'}} type="email" id="email-contact"/>
                    </div>
                    <div className="field-row-stacked">
                        <label htmlFor="phone-contact">Phone (Optional)</label>
                        <input {...register("phone")} style={{width: '100%'}} type="text" id="phone-contact"/>
                    </div>
                    <button type="submit" style={{marginTop: '1rem', width: '100%'}} >Request a call</button>
                </form>
            </ModularForm>
        }
    </>
  )
}

export default Home