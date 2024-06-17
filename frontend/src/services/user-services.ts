import { FormAuthRegisterData } from "../pages/Auth/Register";
import { models } from "../types/models";
import fetchData from "./zFetcher";
interface UserFetchInterface {
    getUsers: () => Promise<models.UserEntity.Data.IUserData[]>
    createUser: (data: FormAuthRegisterData) => Promise<void>
    getUserById: (id: string) => Promise<models.UserEntity.Data.IUserData>;
    // deleteUserById: (id: string) => Promise<AuthorizedUser[]>;
    // updateUserById: (user: AuthorizedUser, newPassword?: string) => Promise<void>;
}


class UserServiceClass implements UserFetchInterface {
    async getUsers() : Promise<models.UserEntity.Data.IUserData[]> {
        try {
            return fetchData<models.UserEntity.Data.IUserData[]>(`${process.env.REACT_APP_API_URL}/api/users`)
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: string) :Promise<models.UserEntity.Data.IUserData> {
        try {
            return fetchData<models.UserEntity.Data.IUserData>(`${process.env.REACT_APP_API_URL}/api/users/${id}`)
        } catch (error) {
            throw error;
        }
    }

    async createUser(data: FormAuthRegisterData) {
        try {
            const options = {
                method: "POST",
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    fullName: data.lastName + " " + data.firstName + " " + data.familyName,
                    role: "CUSTOMER"
                }),
            }
            return fetchData<void>(`${process.env.REACT_APP_API_URL}/api/auth/register`, options)
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}


const UserService = new UserServiceClass()
export default UserService
