import { FormAuthRegisterData } from "../pages/Auth/Register";
import { models } from "../types/models";
import UserService from "./user-services";
import fetchData from "./zFetcher";

interface AuthFetchInterface {
    check: () => Promise<models.UserEntity.Auth.IUser>
    register: (data: FormAuthRegisterData) => Promise<void>
    login: (login: string, password: string) => Promise<{token: string, user: models.UserEntity.Auth.IUser}>
}

class AuthServiceClass implements AuthFetchInterface {
    async check() : Promise<models.UserEntity.Auth.IUser> {
        try {
            const options = {
                headers: {
                    'Authorization': localStorage.getItem("token") || ""
                }
            };
            return fetchData<models.UserEntity.Auth.IUser>(`${process.env.REACT_APP_API_URL}/api/auth/me`, options);
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

    async login(email: string, password: string): Promise<{token: string, user: models.UserEntity.Auth.IUser}> {
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                })
            };
            const response = await fetchData<{token: string, user: models.UserEntity.Auth.IUser}>(`${process.env.REACT_APP_API_URL}/api/auth/login`, options)
            return {token: response.token, user: response.user};

        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
}

const AuthService = new AuthServiceClass()
export default AuthService
