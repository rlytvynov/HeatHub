import { createContext, useContext, useEffect, useReducer } from "react";
import Loader from "../components/Loader";
import AuthService from "../services/auth-services";
import { UserEntity } from "../global";

interface AuthState {
    user: UserEntity.IUser | null;
    loading: boolean;
    error: string | null;
}

export enum AuthActionType {
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',

    REGISTER_REQUEST = 'LOGOUT_REQUEST',
    REGISTER_SUCCESS = 'LOGOUT_SUCCESS',
    REGISTER_FAILURE = 'LOGOUT_FAILURE',

    LOGOUT_REQUEST = 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
    LOGOUT_FAILURE = 'LOGOUT_FAILURE',
}

type AuthAction = {
    type: AuthActionType,
    payload: UserEntity.IUser | string
}

interface AuthContextInterface {
    authState: AuthState
    dispatchAuthState: React.Dispatch<AuthAction>
}
const AuthContext = createContext <AuthContextInterface | undefined> (undefined)
export const useAuthContext = () => useContext(AuthContext);

function authReducer (state: AuthState, action: AuthAction) : AuthState {
    switch (action.type) {
        case AuthActionType.LOGIN_REQUEST:
        case AuthActionType.REGISTER_REQUEST:
        case AuthActionType.LOGOUT_REQUEST:
            return { ...state, loading: true };
        case AuthActionType.LOGIN_SUCCESS:
            return { 
                ...state, 
                loading: false,
                error: null,
                user: action.payload as UserEntity.IUser
            };
        case AuthActionType.LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload as string, user: null };     
        case AuthActionType.REGISTER_SUCCESS:
            return { ...state, loading: false, error: null };
        case AuthActionType.REGISTER_FAILURE:
            return { ...state, loading: false, error: action.payload as string };
        case AuthActionType.LOGOUT_SUCCESS:
            return { ...state, loading: false, error: null, user: null};
        case AuthActionType.LOGOUT_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: "Error while Logout"
            };
        default:
          return state;
      }
}

const initialState = {
    user: null,
    loading: false,
    error: null
}

export const AuthProvider = ({children} : React.PropsWithChildren) => {
    const [authState, dispatchAuthState] = useReducer(authReducer, initialState);

    useEffect(() => {
        async function fetchMe() {
            try {
                dispatchAuthState({type: AuthActionType.LOGIN_REQUEST, payload: ''})
                const user = await AuthService.check()
                // console.log(user)
                dispatchAuthState({type: AuthActionType.LOGIN_SUCCESS, payload: user as UserEntity.IUser})
            } catch (error) {
                localStorage.removeItem("token")
                dispatchAuthState({type: AuthActionType.LOGIN_FAILURE, payload: error as string})
            }
        }
        fetchMe()
    }, [])
    // useEffect(() => {
    //     console.log(authState.user)
    // }, [authState.user])

    return (
        <AuthContext.Provider value={{authState, dispatchAuthState}}>
                {authState.loading ? <Loader/> : children}
        </AuthContext.Provider>
    );
}


