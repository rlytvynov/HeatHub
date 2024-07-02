import { FormAuthRegisterData } from "../components/Navbar/Auth/Register";
import { iuserExtend, role } from "user";
import fetchData from "../utils/fetcher";
interface UserFetchInterface {
    getUsers: () => Promise<iuserExtend[]>
    createUser: (data: FormAuthRegisterData) => Promise<void>
    getUserById: (id: string) => Promise<iuserExtend>;
    // deleteUserById: (id: string) => Promise<AuthorizedUser[]>;
    // updateUserById: (user: AuthorizedUser, newPassword?: string) => Promise<void>;
}


class UserServiceClass implements UserFetchInterface {
    async getUsers(): Promise<iuserExtend[]> {
        try {
            return fetchData<iuserExtend[]>(`${process.env.REACT_APP_API_URL}/api/users`)
        } catch (error: any) {
            console.error('Error getting users:', error.message);
            throw error;
        }
    }

    async getUserById(id: string): Promise<iuserExtend> {
        try {
            return fetchData<iuserExtend>(`${process.env.REACT_APP_API_URL}/api/users/${id}`)
        } catch (error: any) {
            console.error('Error getting user:', error.message);
            throw error;
        }
    }

    async createUser(data: FormAuthRegisterData): Promise<void> {
        try {
            const options = {
                method: "POST",
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    fullName: data.firstName + " " + data.lastName,
                    role: 'customer' satisfies role
                }),
            }
            return fetchData<void>(`${process.env.REACT_APP_API_URL}/api/auth/register`, options)
        } catch (error: any) {
            console.error('Error creating user:', error.message);
            throw error;
        }
    }
}


const UserService = new UserServiceClass()
export default UserService