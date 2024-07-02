import { createContext, useContext, useEffect, useState } from "react";
import {iuser, iuserExtend, role} from "user"
import AuthService from "../services/auth-services";
import authErrorHandler from "../utils/authErrorHandler";

export type UserState = iuser | iuserExtend | null;
type AuthContext = {
    user: UserState,
    setUser: React.Dispatch<React.SetStateAction<UserState>>
}
export const AuthContext = createContext({} as AuthContext)
export const useAuthContext = () => useContext(AuthContext)
export const AuthProvider = ({children}: React.PropsWithChildren) => {
    const [user, setUser] = useState<UserState>(null);
    useEffect(() => {
        async function fetchMe() {
            try {
                const user = await AuthService.check() as iuserExtend
                console.log(user)
                setUser(user)
            } catch (error: any) {
                await authErrorHandler()
                setUser({id: localStorage.getItem("default_id") as string, role: "customer" as role})
            }
        }
        fetchMe()
    }, [])
    return <AuthContext.Provider value={{user, setUser}}> { user && children} </AuthContext.Provider>
}