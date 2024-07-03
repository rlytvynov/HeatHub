import { country, iuserExtend, role } from "user"
import { useAuthContext } from "../../../../contexts/AuthProvider"
import authErrorHandler from "../../../../utils/authErrorHandler"
import { useSyncExternalStore } from "react"
import { cartStore } from "../../../../data/cartStore"
import CartService from "../../../../services/cart-services"
type Props = {}

export default function ProfileGeneral({}: Props) {
    const authContext = useAuthContext()
    const cartItems = useSyncExternalStore(cartStore.subscribe.bind(cartStore), cartStore.getSnapshot.bind(cartStore));
    const handleLogout = async () => {
        try {
            await CartService.updateCart(cartItems)
            await authErrorHandler()
            localStorage.removeItem('token')
            authContext.setUser({id: localStorage.getItem("default_id") as string, role: "customer" as role})
        } catch (error: any) {
            alert(error.message)
        }
    }
    return (
        <article className="profile general" role="tabpanel" id="tab-general">
            <div className="content">
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
                    <img src="/favicon.ico" alt="avatar" style={{width: '6.4rem', height: '6.4rem'}}/>
                    <button onClick={handleLogout}>Log out</button>
                </div>
                <fieldset>
                    <legend>General</legend>
                    <div className="field-row-stacked" style={{width: "100%"}}>
                        <label htmlFor="text23">Name</label>
                        <input id="text23" type="text" value={(authContext.user as iuserExtend).fullName}/>
                    </div>
                    <div className="field-row-stacked" style={{width: "100%"}}>
                        <label htmlFor="text22">Email</label>
                        <input id="text22" type="email" value={(authContext.user as iuserExtend).email}/>
                    </div>
                    <div className="field-row-stacked" style={{width: "100%"}}>
                        <label htmlFor="text23">Phone number</label>
                        <input id="text23" type="text" value={(authContext.user as iuserExtend).phoneNumber}/>
                    </div>
                    <div className="field-row-stacked compact">
                        <div className="field-row-stacked country" style={{width: "45%"}}>
                            <label htmlFor="country">Country</label>
                            <select value={(authContext.user as iuserExtend).country} name="country" id="country">
                                <option value={"Russia" satisfies country}>Россия</option>
                                <option value={"Belarus" satisfies country}>Беларусь</option>
                                <option value={"Kazakhstan" satisfies country}>Казахстан</option>
                            </select>
                        </div>
                        <div className="field-row-stacked postCode" style={{width: "45%", marginLeft: "auto", marginTop: 0}}>
                            <label htmlFor="text22">Post Code</label>
                            <input id="text22" type="number" value={(authContext.user as iuserExtend).postCode}/>
                        </div>
                    </div>
                    <div className="field-row-stacked" style={{width: "100%"}}>
                        <label htmlFor="text23">Address</label>
                        <input id="text23" type="text" value={(authContext.user as iuserExtend).address}/>
                    </div>
                </fieldset>
            </div>
        </article>
    )
}