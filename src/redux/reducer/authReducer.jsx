import { UPDATE_PATIENTS, LOGIN, LOGOUT, STATE_PERSIST, UPDATE_LOADER } from "../constants"


const initialState = {
    isAuthorized: false,
    user: null,
    patients: [],
    loader: false
}


const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                isAuthorized: true,
                user: action.payload
            }
        }

        case LOGOUT: {
            return {
                ...initialState
            }
        }

        case UPDATE_LOADER: {
            return {
                ...state,
                loader: action.payload
            }
        }

        case UPDATE_PATIENTS: {
            return {
                ...state,
                patients: action.payload
            }
        }

        case STATE_PERSIST: {
            return {
                ...state,
                ...(action?.payload?.auth ?? {})
            }
        }

        default:
            return {...state}
    }
}

export default authReducer;