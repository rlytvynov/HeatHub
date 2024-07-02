import  {useEffect, useSyncExternalStore } from 'react'
import { cartStore } from '../../../../data/cartStore';
import ItemShortCard from '../../../ItemShortCard';

type Props = {}

export default function ProfileBasket({}: Props) {
    const items = useSyncExternalStore(cartStore.subscribe.bind(cartStore), cartStore.getSnapshot.bind(cartStore));
    const handleIncrement = (id: string) => {
        cartStore.updateCartWithItem(id, 'increment')
    };
    const handleDecrement = (id: string) => {
        cartStore.updateCartWithItem(id, 'decrement')
    };
    const saveCart = () => {
        cartStore.isChanged && cartStore.save()
    }

    return (
        <article className="profile basket" role="tabpanel" id="tab-notifications">
            <fieldset style={{maxHeight: '24rem', overflowY: 'scroll'}}>
                <legend>Basket</legend>
                {   items.length !== 0 &&
                    items.map((item, index) => {
                        return (
                            <ItemShortCard key={index} item={item} onIncrement={() => handleIncrement(item.id)} onDecrement={() => handleDecrement(item.id)}/>
                        )
                    })
                }
                {
                    items.length === 0 && "No items yet"
                }
            </fieldset>
            <button onClick = {saveCart}>Save</button>
        </article>
    )
}