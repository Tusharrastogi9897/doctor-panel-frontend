import customAxios from "../../axios"
import { LOGOUT, LOGIN, UPDATE_LOADER, UPDATE_PATIENTS } from "../constants"
import {toast} from 'react-toastify';



export const getPatients = () => {

    return (dispatch) => {
        customAxios.get('patient/list').then(res => {

            dispatch({type: UPDATE_PATIENTS, payload: res?.data?.data});
            dispatch({type: UPDATE_LOADER, payload: false});
            
        }).catch(err => {
            toast.error(err?.response?.data?.detail)
        })
    }
}


export const signupUser = (payload) => {

    return (dispatch) => {
        customAxios.post('auth/signup', {...payload}).then(res => {

            dispatch({type: LOGIN, payload: res?.data?.data?.user});
            localStorage.setItem("token", res?.data?.data?.authToken);
        
            toast.success("Successfuly Logged in!")

            dispatch(getPatients())
        
        }).catch(err => {
            dispatch({type: UPDATE_LOADER, payload: false})
            toast.error(err?.response?.data?.detail)
        })
    }
}


export const loginUser = () => {

    return (dispatch) => {
        customAxios.get('auth/profile').then(res => {

            dispatch({type: LOGIN, payload: res?.data?.data});
        
            dispatch(getPatients())
            toast.success("Successfuly Logged in!")
        
        }).catch(err => {
            dispatch({type: UPDATE_LOADER, payload: false})
            toast.error(err?.response?.data?.detail)
        })
    }
}


export const logoutUser = () => {
    localStorage.removeItem('token');

    return {type: LOGOUT}
}