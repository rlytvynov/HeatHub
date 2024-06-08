import { FormAuthRegisterData } from "../pages/Auth/Register";
import { UserEntity } from "../global";
import UserService from "./user-services";


interface AuthFetchInterface {
    check: () => Promise<UserEntity.IUser | null>
    register: (data: FormAuthRegisterData) => Promise<void>
    login: (login: string, password: string) => Promise<{token: string, user: UserEntity.IUser}>
    logout: () => Promise<null>;
}

class AuthServiceClass implements AuthFetchInterface {
    async check() : Promise<UserEntity.IUser | null> {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token") || ""
                }
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const user = await response.json()
            return user
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

    async login(email: string, password: string): Promise<{token: string, user: UserEntity.IUser}> {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const {token, user} = await response.json()
            return {token, user};
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token") || ""
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            };
            localStorage.removeItem('token')
            const {message} = await response.json()
            return message
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }
}

const AuthService = new AuthServiceClass()
export default AuthService
