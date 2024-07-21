import { itemCart } from "../data/cartStore"
import fetchData from "../utils/fetcher";

interface CartInterface {
    getCart: () => Promise<itemCart[]>
    updateCart: (item: itemCart | itemCart[]) => Promise<void>
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
        } catch (error: any) {
            console.log(error)
            throw error
        }
    }
    async updateCart(item: itemCart | itemCart[]) : Promise<void> {
        try {
            const options = {
                method: "PUT",
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                },
                body: JSON.stringify(item)
            };
            fetchData<{message: 'ok'}>(`${process.env.REACT_APP_API_URL}/api/cart`, options)
        } catch (error: any) {
            console.log(error.message)
            throw error
        }
    }
    async clearCart(): Promise<void> {
        try {
            const options = {
                method: "DELETE",
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                }
            };
            fetchData<{message: 'ok'}>(`${process.env.REACT_APP_API_URL}/api/cart`, options)
        } catch (error: any) {
            console.log(error.message)
            throw error
        }
    }
    async makeOrder(items: itemCart[]): Promise<void> {
        try {
            const options = {
                method: "POST",
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                },
                body: JSON.stringify(items)
            };
            fetchData<{message: 'ok'}>(`${process.env.REACT_APP_API_URL}/api/order`, options)
        } catch (error: any) {
            console.log(error.message)
            throw error
        }
    }
}

const CartService = new CartServiceClass()
export default CartService
