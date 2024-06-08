import { FormAuthRegisterData } from "../pages/Auth/Register";
import { UserEntity } from "../global";

interface UserFetchInterface {
    getUsers: () => Promise<UserEntity.IUser[]>
    createUser: (data: FormAuthRegisterData) => Promise<void>
    getUserById: (id: string) => Promise<UserEntity.IUser>;
    // deleteUserById: (id: string) => Promise<AuthorizedUser[]>;
    // updateUserById: (user: AuthorizedUser, newPassword?: string) => Promise<void>;
}


class UserServiceClass implements UserFetchInterface {
    async getUsers() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, { 
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                } 
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const users = await response.json();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async getUserById(id: string) {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, { 
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }, 
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    async createUser(data: FormAuthRegisterData) {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, { 
                method: "POST",
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    fullName: data.lastName + " " + data.firstName + " " + data.familyName,
                    role: "CUSTOMER"
                }),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            await response.json()
            return;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}


const UserService = new UserServiceClass()
export default UserService
