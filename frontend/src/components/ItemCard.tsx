import { BPS, Tubular} from "item"
import diameter from "../assets/diameter.png"
import { useAuthContext } from "../contexts/AuthProvider"
import { useCallback, useState, useSyncExternalStore } from "react"
import ModularForm from "./Modulars/ModularForm"
import ItemShortCard from "./ItemShortCard"
import { cartStore } from "../data/cartStore"
import fetchData from "../utils/fetcher"
import { SubmitHandler, useForm } from "react-hook-form"
import CartService from "../services/cart-services"

type ItemTypes = Tubular.itubular | BPS.ibps
interface FormRequestACall {
    email: string,
    phone: string
}
export default function ItemCard(props: ItemTypes) {
    const authContext = useAuthContext()
    const [modularWindows, setModularWindows] = useState({cart: false, call: false})
    const [itemsToCart, setItemsToCart] = useState(1)
    const items = useSyncExternalStore(cartStore.subscribe.bind(cartStore), cartStore.getSnapshot.bind(cartStore));
    const {
        register, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm<FormRequestACall>()

    const onSubmit: SubmitHandler<FormRequestACall> = async (data) => {
        try {
            const response = await fetchData<{message: string}>(`${process.env.REACT_APP_API_URL}/api/call-order`, {
                method: "POST",
                body: JSON.stringify({
                    name: 'email' in authContext.user! ? authContext.user.fullName : '',
                    email: data.email,
                    phone: data.phone,
                    item: {
                        name:  props.name,
                        price: props.price,
                        model: props.model,
                        amount: itemsToCart
                    }
                })
            })
            reset({email: '', phone: ''})
        } catch (error: any) {
            alert(error.message)
        }
    }
    const showModularWindowCart = () => {
        setModularWindows(prev => ({...prev, cart: true}))
    }

    const hideModularWindowCart = useCallback(() => {
        setModularWindows(prev => ({...prev, cart: false}))
    }, [])

    const showModularWindowCall = () => {
        setModularWindows(prev => ({...prev, call: true}))
    }

    const hideModularWindowCall = useCallback(() => {
        setModularWindows(prev => ({...prev, call: false}))
    }, [])

    const handleIncrement = () => {
        setItemsToCart(prev => prev + 1)
    }
    const handleDecrement = () => {
        if(itemsToCart !== 1) {
            setItemsToCart(prev => prev - 1)
        }
    }
    const handleAddToCart = async () => {
        try {
            cartStore.updateCartWithNewItem({id: props.id, name: props.name, price: props.price, image: props.image, model: props.model, amount: itemsToCart})
            hideModularWindowCart()
            setItemsToCart(0)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <fieldset className="item-card">
                <div style={{marginBottom: '5px'}} className="image-container">
                    <img src={props.image} alt="image" />
                </div>
                <div style={{marginBottom: '5px'}} className="description">
                    <h4 style={{marginBottom: '5px'}}>{props.name}</h4>
                    <div  style={{marginBottom: '5px', display: 'flex', gap: '1rem', alignItems: 'center'}} className="characteristics">
                        <span style={{color: 'red', fontWeight: 700}}>{props.model}</span>
                        {
                            props.type === 'tubular' && 
                            <>
                                <span style={{color: 'darkblue', fontWeight: 700}}>{(props as Tubular.itubular).wattage}W</span>
                                <fieldset style={{display: 'flex', alignItems: 'center', padding: '2px 5px', gap: '0.5rem'}}> <img style={{height: '1rem'}} src={diameter} alt="pipe" /> <span style={{fontSize: '1rem'}}>{(props as Tubular.itubular).tubeDiameter}</span></fieldset>
                            </>
                        }
                        {
                            props.type === 'bps' && 
                            <>
                                <span style={{color: 'darkblue', fontWeight: 700}}>{(props as BPS.ibps).wattage}W</span>
                                <span style={{color: 'darkorange', fontWeight: 700}}>{(props as BPS.ibps).voltage}</span>
                                <span style={{color: 'darkcyan', fontWeight: 700}}>{(props as BPS.ibps).ampers}A</span>
                                <fieldset style={{display: 'flex', alignItems: 'center', padding: '2px 5px', gap: '0.5rem'}}> <img style={{height: '1rem'}} src={diameter} alt="pipe" /> <span style={{fontSize: '1rem'}}>{(props as BPS.ibps).size}m</span></fieldset>
                            </>
                        }

                    </div>
                    <div className="price-container">
                        <span id="price">{props.price}₽</span>
                    </div>
                    <span className="item-description">{props.description}</span>
                    {props.tags && <div style={{display: 'flex', gap: '0.3rem', flexWrap: 'wrap'}}>{props.tags.map((tag, index) => index < 3 && <fieldset key={index} style={{padding: '2px 5px'}}>#{tag}</fieldset>)}</div>}
                </div>
                <div className="item-card-buttons" style={{display: 'flex', gap: '1rem', justifyContent: 'flex-start'}}>
                    {
                        'email' in authContext.user! ? 
                        <button onClick = {showModularWindowCart}>Buy</button>
                        :
                        <button onClick = {showModularWindowCall}>Buy</button>
                    }
                </div>
            </fieldset>
            {
                modularWindows.call &&
                <ModularForm hideModularWindow={hideModularWindowCall}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ItemShortCard 
                            item={
                                {id: props.id, name: props.name, price: props.price, image: props.image, model: props.model, amount: itemsToCart}
                            }
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                        />
                        <h4 style={{textAlign: 'center', lineHeight: '2.2rem', marginTop: 0}}>Leave your contacts and admin will contact you</h4>
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
            {   modularWindows.cart && 
                <ModularForm hideModularWindow={hideModularWindowCart}>
                    <h4 style={{textAlign: 'center', lineHeight: '2.2rem', marginTop: 0}}>Save items to cart</h4>
                    <ItemShortCard 
                        item={
                            {id: props.id, name: props.name, price: props.price, image: props.image, model: props.model, amount: itemsToCart}
                        }
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                    />
                    <button onClick={handleAddToCart} style={{marginTop: '1rem', width: '100%'}} >Confirm</button>
                </ModularForm>
            }
        </>
    )
}