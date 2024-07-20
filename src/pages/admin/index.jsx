import { Grid, Hidden, IconButton, Paper, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { AdminLayout } from "../../components/layout";
import stethoscopeIcon from "../../assets/images/stethoscope.png"
import colors from "../../assets/colors";
import { Menu } from "@mui/icons-material";
import { DoctorPanel } from "../../components/doctor-panel";


export const AdminPage = ({isMobile}) => {

    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const startX = useRef(0);

    const handleTouchStart = (event) => {
        startX.current = event.touches[0].clientX;
      };
    
    const handleTouchMove = (event) => {
        const currentX = event.touches[0].clientX;
        const diffX = currentX - startX.current;

        if (!open && startX.current < 70 && diffX > 50) {
            handleDrawerOpen();
          } else if (open && startX.current > 240 - 50 && diffX < -50) {
            handleDrawerClose();
          }
      };
    
    const handleTouchEnd = () => {
        startX.current = 0;
      };

    return (
        <React.Fragment>
            <Grid container onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <AdminLayout open={open} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen}/>

                <Grid item xs={12} sx={{ p: 2, marginLeft: isMobile ? null : "60px" }}>
                    <Grid container>
                        <Hidden smUp>
                            <Grid item>
                                <IconButton onClick={handleDrawerOpen}>
                                    <Menu />
                                </IconButton>
                            </Grid>
                        </Hidden>
                        <Grid item style={{marginLeft: "auto", display: 'flex', width: "fit-content"}}>
                            <img alt="Stethoscope Icon" src={stethoscopeIcon} style={{width: isMobile ? "40px" : "50px", marginRight: "10px"}}/>
                            <Typography variant={isMobile ? 'h5' : 'h4'} style={{
                                background: colors.textGradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: "bold"
                            }}>
                                Doctor Panel
                            </Typography>
                        </Grid>

                        <Grid item xs={12} container component={Paper} elevation={0} sx={{marginTop: "20px", padding: "15px"}}>
                            <DoctorPanel isMobile={isMobile} />
                        </Grid>
                    </Grid>
                    
                </Grid>
            </Grid>
        </React.Fragment>
    )
}