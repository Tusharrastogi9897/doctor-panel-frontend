import { Grid, Hidden, Paper, Typography } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import stepsAILogo from "../../assets/images/steps-ai-logo.png"
import stethoscopeIcon from "../../assets/images/stethoscope.png"
import dpVector from "../../assets/images/dp-vector.png"


export function AuthPage({isMobile}) {

    

    return (
        <React.Fragment>
            <Grid container>
                <Grid item container alignItems={'center'} justifyContent={'center'} xs={12}>
                    <Hidden smDown>
                        <Grid item container md={6} justifyContent={'left'}>
                            <Grid item style={{display: "flex", alignItems: "center"}}>
                                <img alt="" src={stethoscopeIcon} style={{width: "80px", marginRight: "20px"}}/>
                                <Typography variant={'h2'} style={{
                                    background: 'linear-gradient(90deg, #d72d79, #f89a1b)', // Customize the gradient colors to match your image
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: "bold"
                                }}>
                                    Doctor Panel
                                </Typography>
                            </Grid>
                            <Grid item xs={12}></Grid>
                            <Grid item>
                                <img alt="" src={dpVector} style={{width: "600px"}}/>
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Grid item md={5} component={Paper} elevation={3} style={{width: isMobile ? "90%" : "30%", maxWidth: isMobile ? "90%" : "30%", height: "auto", padding: "30px", borderRadius: "10px"}}>
                        <Grid container spacing={2} justifyContent={'center'}>
                            <Hidden smUp>
                                <Grid item style={{display: "flex", alignItems: "center"}}>
                                    <img alt="" src={stethoscopeIcon} style={{width: "40px", marginRight: "10px"}}/>
                                    <Typography variant={'h4'} style={{
                                        background: 'linear-gradient(90deg, #d72d79, #f89a1b)', // Customize the gradient colors to match your image
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: "bold"
                                    }}>
                                        Doctor Panel
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}></Grid>
                            </Hidden>
                        
                            <Outlet />

                            <Grid item style={{textAlign: "center"}}>
                                <Typography style={{marginBottom: 5, fontSize: "12px"}}>
                                    Powered By
                                </Typography>
                                <img alt="" src={stepsAILogo} style={{width: "80px"}}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}