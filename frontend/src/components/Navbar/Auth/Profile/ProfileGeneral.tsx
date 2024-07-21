import { country, iuserExtend, role } from "user"
import { useAuthContext } from "../../../../contexts/AuthProvider"
import authErrorHandler from "../../../../utils/authErrorHandler"
import { useSyncExternalStore } from "react"
import { cartStore } from "../../../../data/cartStore"
import { SubmitHandler, useForm } from "react-hook-form"
import profile from "../../../../assets/profile.png"

type Props = {}
interface FormUserData {
    email: string,
    fullName: string,
    phoneNumber: string,
    country: country,
    postCode: number,
    address: string
}
export default function ProfileGeneral({}: Props) {
    const authContext = useAuthContext()
    const cartItems = useSyncExternalStore(cartStore.subscribe.bind(cartStore), cartStore.getSnapshot.bind(cartStore));
    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<FormUserData>({
        defaultValues: {
            email: (authContext.user as iuserExtend).email,
            fullName: (authContext.user as iuserExtend).fullName,
            phoneNumber: (authContext.user as iuserExtend).phoneNumber,
            country: (authContext.user as iuserExtend).country ? (authContext.user as iuserExtend).country : 'Russia',
            postCode: (authContext.user as iuserExtend).postCode,
            address: (authContext.user as iuserExtend).address
        }
    });

    const handleLogout = async () => {
        try {
            await authErrorHandler()
            localStorage.removeItem('token')
            authContext.setUser({id: localStorage.getItem("default_id") as string, role: "customer" as role})
        } catch (error: any) {
            alert(error.message)
        }
    }
    const onSubmit: SubmitHandler<FormUserData> = async (data) => {
        try {
            console.log(data)
        } catch (error: any) {
            alert(error.message)
        }
    }
    return (
        <article className="profile general" role="tabpanel" id="tab-general">
            <form onSubmit={handleSubmit(onSubmit)} className="content">
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                    <img src={profile} alt="avatar" style={{width: '6.4rem', height: '6.4rem'}}/>
                    <button onClick={handleLogout}>Log out</button>
                    <button type='submit'>Save</button>
                </div>
                <fieldset>
                    <legend>General</legend>
                    <div className="field-row-stacked" style={{width: "100%"}}>
                        <label className='required' htmlFor="fullName">Name</label>
                        <input autoComplete="off" className={errors.fullName && 'error-field'} id="fullName" type="text" {...register("fullName", { required: true })}/>
                    </div>
                    <div className="field-row-stacked" style={{width: "100%"}}>
                        <label className='required' htmlFor="email">Email</label>
                        <input autoComplete="off" className={errors.email && 'error-field'} id="email" type="email" {...register("email", { required: true })}/>
                    </div>
                    <div className="field-row-stacked" style={{width: "100%"}}>
                        <label htmlFor="phoneNumber">Phone number</label>
                        <input autoComplete="off" id="phoneNumber" type="text" {...register("phoneNumber")}/>
                    </div>
                    <div className="field-row-stacked compact">
                        <div className="field-row-stacked country" style={{width: "45%"}}>
                            <label htmlFor="country">Country</label>
                            <select {...register("country")} name="country" id="country">
                                <option value={"Russia" satisfies country}>Россия</option>
                                <option value={"Belarus" satisfies country}>Беларусь</option>
                                <option value={"Kazakhstan" satisfies country}>Казахстан</option>
                            </select>
                        </div>
                        <div className="field-row-stacked postCode" style={{width: "45%", marginLeft: "auto", marginTop: 0}}>
                            <label htmlFor="postCode">Post Code</label>
                            <input autoComplete="off" id="postCode" type="number" {...register("postCode")}/>
                        </div>
                    </div>
                    <div className="field-row-stacked" style={{width: "100%"}}>
                        <label htmlFor="address">Address</label>
                        <input autoComplete="off" id="address" type="text" {...register("address")}/>
                    </div>
                </fieldset>
            </form>
        </article>
    )
}