import { FormAuthRegisterData } from "../components/Navbar/Auth/Register";
import { iuserExtend } from "user";
import fetchData from "../utils/fetcher";
import UserService from "./user-services";

interface AuthFetchInterface {
    check: () => Promise<iuserExtend>
    register: (data: FormAuthRegisterData) => Promise<void>
    login: (login: string, password: string) => Promise<{token: string, user: iuserExtend}>
}

class AuthServiceClass implements AuthFetchInterface {
    async check() : Promise<iuserExtend> {
        try {
            const options = {
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                }
            };
            return await fetchData<iuserExtend>(`${process.env.REACT_APP_API_URL}/api/auth/me`, options);
        } catch (error) {
            throw error;
        }
    }
    async register(data: FormAuthRegisterData) {
        try {
            await UserService.createUser(data)
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<{token: string, user: iuserExtend}> {
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                })
            };
            const response = await fetchData<{token: string, user: iuserExtend}>(`${process.env.REACT_APP_API_URL}/api/auth/login`, options)
            return {token: response.token, user: response.user};

        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
}

const AuthService = new AuthServiceClass()
export default AuthService