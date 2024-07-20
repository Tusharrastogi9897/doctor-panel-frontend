import { Button, CircularProgress, Grid, IconButton, InputAdornment, Typography} from '@mui/material';
import React, { useState } from 'react';
import { CustomTextField } from '../login';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_LOADER } from '../../redux/constants';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signupUser } from '../../redux/action';
import { toast } from 'react-toastify';


export const SignUpComponent = ({isMobile}) => {

    const navigate = useNavigate()
    const [signupData, setSignupData] = useState({})
    const dispatch = useDispatch()

    const handleSignup = () => {
        let error = false;

        // eslint-disable-next-line
        signUpContent.map(content => {
            if(!signupData?.[content?.key] || errors?.[content?.key]) {
                error = true;
            }
        })

        if(!error){
            dispatch({type: UPDATE_LOADER, payload: true})
            dispatch(signupUser(signupData))
        } else {
            toast.error("Please fill all details correctly!")
        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
      };
    
    const validateText = (text) => {
        const firstName = text.split(' ')[0];
        return /^[A-Za-z]+$/.test(firstName);
      };

    const signUpContent = [
        {label: "Name", key: 'name', validator: validateText},
        {label: "Email", key: 'email', validator: validateEmail},
        {label: "Password", key: 'password', validator: validatePassword, type: 'password'},
        {label: "Speciality", key: 'speciality', validator: validateText}
    ]

    const [errors, setErrors] = useState({ });
    const [showPassword, setShowPassword] = useState(false);
    const loginLoader = useSelector(state => state?.auth?.loader)

    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleChange = (e, item) => {
        const value = e.target.value;
        const tempData = { ...signupData, [item?.key]: value };

        setSignupData(tempData);

        if(item?.key === 'password'){
            setErrors({
                [item?.key]: item?.validator(value) ? '' : `Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character`,
            });
        } else if(item?.key === 'confirmPassword'){
            setErrors({
                [item?.key]: item?.validator(value) ? '' : `Must be same as Password!`,
            });
        } else {
            setErrors({
                [item?.key]: item?.validator(value) ? '' : `Invalid ${item?.key} format`,
            });
        }
    }

    return (
        <React.Fragment>
            <Grid item style={{textAlign: 'center'}}>
                <Typography variant={isMobile ? 'h5' : 'h4'}>
                    Sign Up
                </Typography>
                <Typography variant='subtitle1' style={{color: "grey"}}>
                    Enter your details for a quick sign-up
                </Typography>
            </Grid>

            {signUpContent.map((item) => (
                <Grid item xs={12}>
                    <CustomTextField placeholder={item?.label}
                        onChange={(e) => handleChange(e, item)}
                        value={signupData?.[item?.key] ?? ''}
                        type={ showPassword ? 'text' : (item?.type ?? 'text')}
                        onSubmit={handleSignup}
                        error={errors?.[item?.key]}
                        helperText={errors?.[item?.key]}
                        endAdornment={
                            item?.type === 'password' ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        style={{marginRight: "0px"}}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }
                    />
                </Grid>
            ))}

            <Grid item xs={12}>
                <Button fullWidth variant='contained' onClick={handleSignup}
                    endIcon={loginLoader ? (
                        <CircularProgress size={24} style={{color: "white"}} />
                    ) : null}
                >
                    Sign Up
                </Button>
            </Grid>

            <Grid item xs={12} style={{textAlign: "center"}}>
                <div style={{display: "flex", alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant='subtitle1' style={{color: "grey", marginRight: "5px"}}>
                        Already have an account?
                    </Typography>
                    <Button variant="text" onClick={() => navigate("/auth/login")}>
                        Sign In
                    </Button>
                </div>
            </Grid>
        </React.Fragment>
    )
}