import { Button, Grid, Paper, Typography, InputBase, InputAdornment, IconButton, FormHelperText, CircularProgress} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UPDATE_LOADER } from '../../redux/constants';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import customAxios from '../../axios';
import { toast } from 'react-toastify';
import { loginUser } from '../../redux/action';


export function CustomTextField({ placeholder, ...otherProps }) {
  const [focused, setFocused] = useState(false);

  return (
    <React.Fragment>
        <Paper elevation={focused ? 3 : 1} style={{padding: "0.5rem", border: otherProps?.error ? "1px solid #FADBD8" : null}}>
          <InputBase
            fullWidth
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
                if(e.key === "Enter" && otherProps?.onSubmit) {
                    otherProps?.onSubmit()
                }
            }}
            {...otherProps}
          />
        </Paper>
        {otherProps?.error && <FormHelperText>{otherProps?.helperText}</FormHelperText>}
    </React.Fragment>
  );
}

export const LoginComponent = ({isMobile}) => {

    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({})
    const [errors, setErrors] = useState({ email: '' });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch()

    const loginLoader = useSelector(state => state?.auth?.loader)

    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };


    const handleLogin = () => {

        if(!errors?.email && loginData?.email && loginData?.password){
            dispatch({type: UPDATE_LOADER, payload: true})

            customAxios.post('auth/login', {
                username: loginData?.email,
                password: loginData?.password
            }).then(res => {
                if(res?.data?.success){
                    localStorage.setItem("token", res?.data?.data?.access_token);
                    dispatch(loginUser());
                }
            }).catch(err => {
                dispatch({type: UPDATE_LOADER, payload: false})
                toast.error(err?.response?.data?.detail)
            })

        } else {
            toast.error("Please fill the details correctly!")
        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        const tempData = { ...loginData, email };

        setLoginData(tempData);
        setErrors({
            email: validateEmail(email) ? '' : 'Invalid email format',
        });
    };

    return (
        <React.Fragment>
            <Grid item style={{textAlign: 'center'}}>
                <Typography variant={'h4'}>
                    Sign in
                </Typography>
                <Typography variant='subtitle1' style={{color: "grey"}}>
                    Sign-in with your email
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <CustomTextField placeholder={"Email"} 
                    onChange={handleEmailChange}
                    value={loginData?.email ?? ''}
                    onSubmit={handleLogin}
                    error={errors.email}
                    helperText={errors.email}
                />
            </Grid>

            <Grid item xs={12}>
                <CustomTextField placeholder={"Password"} type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                        const tempData = {...loginData, password: e?.target?.value};
                        setLoginData(tempData);
                    }}
                    value={loginData?.password ?? ''}
                    onSubmit={handleLogin}
                    endAdornment={
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
                     }
                />
            </Grid>

            <Grid item xs={12}>
                <Button fullWidth variant='contained' onClick={handleLogin}
                    endIcon={loginLoader ? (
                        <CircularProgress size={24} style={{color: "white"}} />
                    ) : null}
                >
                    Sign in
                </Button>
            </Grid>

            <Grid item xs={12} style={{textAlign: "center"}}>
                {/* <Button variant='text' style={{padding: 0}} sx={{
                    '&:hover': {
                        background: "transparent"
                    }
                }}>
                    Forgot Password?
                </Button> */}
                <div style={{display: "flex", alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant='subtitle1' style={{color: "grey", marginRight: "5px"}}>
                        Don't have an account?
                    </Typography>
                    <Button variant="text" onClick={() => navigate("/auth/signup")}>
                        Sign Up
                    </Button>
                </div>
            </Grid>
        </React.Fragment>
    )
}