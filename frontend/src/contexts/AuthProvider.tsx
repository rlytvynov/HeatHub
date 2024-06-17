import { createContext, useContext, useEffect, useReducer } from "react";
import AuthService from "../services/auth-services";
import { v4 as uuidv4 } from 'uuid';
import { models } from "../types/models";
import authHandler from "../utils/authHandler";

interface AuthState {
    user: models.UserEntity.Auth.IUser;
    authorized: boolean;
    error: string | null;
}

export enum AuthActionType {
    AUTH_SUCCESS = 'LOGIN_SUCCESS',
    AUTH_FAILURE = 'LOGIN_FAILURE',

    DEAUTH_SUCCESS = 'LOGOUT_SUCCESS',
    DEAUTH_FAILURE = 'LOGOUT_FAILURE',
}

type AuthAction = {
    type: AuthActionType,
    payload?: models.UserEntity.Auth.IUser | string
}

interface AuthContextInterface {
    authState: AuthState
    dispatchAuthState: React.Dispatch<AuthAction>
}
const initialAuthContext: AuthContextInterface = {
    authState: null as unknown as AuthState,
    dispatchAuthState: () => null, // Заглушка для dispatch
};
const AuthContext = createContext <AuthContextInterface> (initialAuthContext)
export const useAuthContext = () => useContext(AuthContext);

function authReducer (state: AuthState, action: AuthAction) : AuthState {
    switch (action.type) {
        case AuthActionType.AUTH_SUCCESS:
            return { 
                user: action.payload as models.UserEntity.Auth.IUser, 
                authorized: true,
                error: null 
            }
        case AuthActionType.AUTH_FAILURE:
            return { 
                ...state, 
                error: action.payload as string 
            };     
        case AuthActionType.DEAUTH_SUCCESS:
            return { 
                user: { 
                    id: localStorage.getItem("default_id") as string, 
                    role: localStorage.getItem("default_role") as models.UserEntity.Auth.Role 
                }, 
                authorized: false,
                error: null 
            }
        case AuthActionType.DEAUTH_FAILURE:
            return { 
                ...state, 
                error: action.payload as string
            };  
        default:
          return state;
      }
}

export const AuthProvider = ({children} : React.PropsWithChildren) => {
    const [authState, dispatchAuthState] = useReducer(authReducer, null as unknown as AuthState);

    async function fetchMe() {
        try {
            const user = await AuthService.check()
            dispatchAuthState({type: AuthActionType.AUTH_SUCCESS, payload: user as models.UserEntity.Auth.IUser})
        } catch (error: any) {
            await authHandler(error.message)
            dispatchAuthState({type: AuthActionType.DEAUTH_SUCCESS})
        }
    }
    useEffect(() => {
        fetchMe()
    }, [])

    return (
        <>
            {
                authState &&
                <AuthContext.Provider value={{authState, dispatchAuthState}}>
                    {children}
                </AuthContext.Provider>
            }
        </>
    );
}


