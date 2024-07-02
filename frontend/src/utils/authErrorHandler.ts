import {v4 as uuidv4} from 'uuid'
export default async function authErrorHandler() {
    let storedId: string = localStorage.getItem("default_id") as string
    if(!storedId) {
        localStorage.setItem("default_id", uuidv4())
    }

}