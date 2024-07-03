import { itemCart } from "../data/cartStore"
import fetchData from "../utils/fetcher";

interface CartInterface {
    getCart: () => Promise<itemCart[]>
    updateCart: (items: itemCart[]) => Promise<void>
}

class CartServiceClass implements CartInterface {
    async getCart() : Promise <itemCart[]> {
        try {
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token") || ""
                }
            };
            const bagItems = await fetchData<itemCart[]>(`${process.env.REACT_APP_API_URL}/api/cart`, options)
            return bagItems
        } catch (error) {
            throw error
        }
    }
    async updateCart(items: itemCart[]) : Promise<void> {
        try {
            const options = {
                method: "PUT",
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                },
                body: JSON.stringify(items)
            };
            fetchData<{message: 'ok'}>(`${process.env.REACT_APP_API_URL}/api/cart`, options)
        } catch (error: any) {
            console.log(error)
            throw error
        }
    }
}

const CartService = new CartServiceClass()
export default CartService
