import { ChevronLeft, ChevronRight, Dashboard, Logout } from "@mui/icons-material";
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, IconButton, Typography } from "@mui/material";
import React from "react";
import MuiDrawer from '@mui/material/Drawer';
import colors from "../../assets/colors";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/action";


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  position: "fixed",
  zIndex: 99,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: "0.4s",
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: "0.4s",
  }),
  zIndex: 99,
  position: 'fixed',
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export const AdminLayout = ({ open, handleDrawerOpen, handleDrawerClose }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
      dispatch(logoutUser());
      navigate("/auth/login");
    }

    return (
        <React.Fragment>

      <Drawer variant="permanent" open={open} onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
        <DrawerHeader>
            <IconButton color="primary" onClick={() => open ? handleDrawerClose() : handleDrawerOpen()}>
                {open ? <ChevronLeft/> : <ChevronRight />}
            </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Dashboard'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Dashboard style={{color: colors.primary}}/>
                </ListItemIcon>
                <ListItemText primary={
                  <Typography color={'primary'} style={{fontWeight: "bolder"}}>
                    {text}
                  </Typography>
                  } sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key={'log-out'} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={handleLogout}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Logout style={{color: colors.primary}}/>
              </ListItemIcon>
              <ListItemText primary={
                <Typography color={'primary'}>
                  Logout
                </Typography>
                } sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

        </React.Fragment>
    )
}