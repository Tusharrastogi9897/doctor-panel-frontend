import React, { useEffect } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { AuthPage } from "./pages/auth";
import { AdminPage } from "./pages/admin";
import { Grid } from "@mui/material";
import colors from "./assets/colors";
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { LoginComponent } from "./components/login";
import { SignUpComponent } from "./components/signup";
import { useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  
  // considering mobile device if viewport is less than 600px
  const isMobile = useMediaQuery('(max-width:599px)');  
  const isAuthorized = useSelector(state => state.auth.isAuthorized);
  const navigate = useNavigate()

  useEffect(() => {
    if(isAuthorized){
      navigate("/admin/dashboard");
    }
    // eslint-disable-next-line
  }, [String(isAuthorized)])
  
  return (
    <React.Fragment>
      <Grid container style={{width: "100vw", height: "100vh", overflowX: "hidden", background: colors.pageBackground}}>        
          <Routes>
            <Route path="/" element={<Navigate to="/auth/login" />} />
            
            <Route path="/auth" element={<AuthPage isMobile={isMobile} />}>
              <Route path="login" element={<LoginComponent isMobile={isMobile}/>} />
              <Route path="signup" element={<SignUpComponent isMobile={isMobile}/>} />
            </Route>
            
            {isAuthorized ? <Route path="/admin/dashboard" element={<AdminPage isMobile={isMobile} />} /> : null}
            <Route path="*" element={<Navigate to={isAuthorized ? "/admin/dashboard" : "/auth/login"} />} />
          </Routes>
          <ToastContainer />
      </Grid>
    </React.Fragment>
  );
}

export default App;
