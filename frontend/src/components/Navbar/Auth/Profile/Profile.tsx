import { useEffect, useState, useSyncExternalStore } from "react"
import ProfileGeneral from "./ProfileGeneral"
import ProfileNotifications from "./ProfileNotifications"
import ProfilePassword from "./ProfilePassword"
import ProfileBasket from "./ProfileBasket"
import ProfileOrders from "./ProfileOrders"
import { cartStore } from "../../../../data/cartStore"

const enum Tab {
    general, notifications, password, basket, orders
}

export default function Profile() {
    const [currentTab, setCurrentTab] = useState(Tab.general)
    useSyncExternalStore(cartStore.subscribe.bind(cartStore), cartStore.getSnapshot.bind(cartStore));
    useEffect(() => {
        const uploadStore = async () => {
            await cartStore.loadBagItems()
        }
        if(!cartStore.uploaded) {
            uploadStore()
        }
    }, [])
    return (
        <section className="tabs" style={{maxWidth: "500px"}}>
            <menu role="tablist" aria-label="Sample Tabs">
                <button role="tab" onClick={() => setCurrentTab(Tab.general)} aria-selected={currentTab === Tab.general} aria-controls="tab-general">General</button>
                <button role="tab" onClick={() => setCurrentTab(Tab.notifications)} aria-selected={currentTab === Tab.notifications} aria-controls="tab-notifications">Notifications</button>
                <button role="tab" onClick={() => setCurrentTab(Tab.password)} aria-selected={currentTab === Tab.password} aria-controls="tab-password">Password</button>
                <button role="tab" onClick={() => setCurrentTab(Tab.basket)} aria-selected={currentTab === Tab.basket} aria-controls="tab-basket">Basket</button>
                <button role="tab" onClick={() => setCurrentTab(Tab.orders)} aria-selected={currentTab === Tab.orders} aria-controls="tab-orders">Orders</button>
            </menu>
            {currentTab === Tab.general && <ProfileGeneral/>}
            {currentTab === Tab.notifications && <ProfileNotifications/>}
            {currentTab === Tab.password && <ProfilePassword/>}
            {currentTab === Tab.basket && <ProfileBasket/>}
            {currentTab === Tab.orders && <ProfileOrders/>}
        </section>
    )
}