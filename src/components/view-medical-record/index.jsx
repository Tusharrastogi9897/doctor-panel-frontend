import React, { useEffect, useState } from "react";
import customAxios from "../../axios";
import { Card, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Typography } from "@mui/material";
import { Close, InsertDriveFile } from "@mui/icons-material";
import { toast } from "react-toastify";

export const ViewMedicalRecord = ({ patient, isMobile, openDialog, setOpenDialog }) => {

    const handleClose = () => {
      setOpenDialog(false);
    }
  
    const [loader, setLoader] = useState(false)
  
    const displayFile = (file) => {
      if(file?.extension?.includes("image")){
        return <img alt='' src={file?.url} style={{width: "50px", objectFit: "contain"}} />
      } else if(file?.extension?.includes("pdf")){
        return (
          <InsertDriveFile style={{fontSize: "40px", color: "orangered", marginLeft: "10px"}} />
        )
      } 
    }

    const [medicalRecords, setMedicalRecords] = useState([])
    
    useEffect(() => {
        if(patient){
            setLoader(true);
            customAxios.get(`patient/fetch-documents/${patient.id}`).then(res => {
                setMedicalRecords(res?.data?.data);
                setLoader(false);
            }).catch(err => {
                toast.error(err?.response?.data?.detail)
            })
        }
    }, [patient])
  
    return (
      <React.Fragment>
        <Dialog open={openDialog} onClose={handleClose} maxWidth="md">
          <DialogTitle>
              <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                      <Typography style={{ fontSize: "18px" }}>
                          {patient?.name}'s Health Record
                      </Typography>
                  </Grid>
                  <Grid item>
                      <IconButton aria-label="close" onClick={handleClose} stye={{padding: 5}}>
                          <Close />
                      </IconButton>
                  </Grid>
              </Grid>
          </DialogTitle>
          <DialogContent dividers style={{minHeight: "30vh", backgroundColor: "whitesmoke"}}>
            <Grid container spacing={2} style={{width: isMobile ? 'auto' : "35vw"}}>
              {!loader && medicalRecords?.length ? medicalRecords?.map((file) => (
                <Grid item xs={12}>
                  <Grid container component={Card} spacing={1} style={{padding: 10, borderRadius: 10}} elevation={0} alignItems="center">
                    <Grid item>
                      <Typography>
                        {file?.name}
                      </Typography>
                    </Grid>
                    <Grid item style={{marginLeft: 'auto', marginRight: "10px"}}>
                      <Typography>
                        {file?.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12} container alignItems="center">
                      <Grid item xs={3} style={{cursor: "pointer"}} onClick={() => {
                          window.open(file?.url)
                      }}>
                        {displayFile(file)}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )) : <Grid item xs={12} style={{textAlign: "center", paddingTop: "20px"}}>
                    {loader ? (<CircularProgress color="primary" size={30}/>) : 
                    <Typography>
                        No Medical Records Found!
                    </Typography>}
                </Grid>}
            </Grid>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    )
  }