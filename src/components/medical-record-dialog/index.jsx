import React, { useState } from "react";
import customAxios from "../../axios";
import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { Close, Delete, InsertDriveFile, Publish } from "@mui/icons-material";
import { toast } from "react-toastify";

export const MedicalRecordDialog = ({ patient, isMobile, fileData, setFileData, documentsRef, openDialog, setOpenDialog }) => {

    const handleClose = () => {
      setOpenDialog(false);
      setFileData([])
    }
  
    const [saveLoader, setSaveLoader] = useState(false)
    
    const handleSubmit = () => {
      if(fileData?.length) {
        setSaveLoader(true)
        customAxios.post(`patient/upload-documents/${patient?.id}`, {
            "documents": [...fileData]
            }).then(res => {
                setOpenDialog(false);
                setFileData([])
                setSaveLoader(false)
                toast.success("Medical Records added successfuly!")
            }).catch(err => {
                setOpenDialog(false);
                setFileData([])
            })
      }
    }
  
    const displayFile = (file) => {
      if(file?.extension?.includes("image")){
        return <img alt="" src={file?.file} style={{width: "50px", objectFit: "contain"}} />
      } else if(file?.extension?.includes("pdf")){
        return (
          <InsertDriveFile style={{fontSize: "40px", color: "orangered", marginLeft: "10px"}} />
        )
      } 
    }
  
    return (
      <React.Fragment>
        <Dialog open={openDialog} onClose={handleClose} maxWidth="md">
          <DialogTitle>
              <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                      <Typography style={{ fontSize: "18px" }}>
                          Upload a Health Record
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
              {fileData?.length ? fileData?.map((file, fileIdx) => (
                <Grid item xs={12}>
                  <Grid container component={Card} spacing={1} style={{padding: 10, borderRadius: 10}} elevation={0} alignItems="center">
                    <Grid item>
                      <Typography>
                        {file?.name}
                      </Typography>
                    </Grid>
                    <Grid item style={{marginLeft: "auto"}}>
                      <IconButton style={{padding: 5}} size="small" onClick={() => {
                        let temp = [...fileData];
                        temp.splice(fileIdx, 1);
  
                        setFileData([...temp])
                      }}>
                        <Delete />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12} container alignItems="center">
                      <Grid item xs={3} style={{cursor: "pointer"}} onClick={() => {
                          openBase64FileInNewWindow(file?.file, file?.extension);
                      }}>
                        {displayFile(file)}
                      </Grid>
                      
                      <Grid item xs={9} md={9}>
                        <TextField
                            select
                            size="small"
                            fullWidth
                            style={{width: "80%"}}
                            value={file?.type}
                            placeholder="Record Type"
                            label="Record Type"
                            onChange={(e) => {
                              let temp = [...fileData]
                              temp[fileIdx]["type"] = e.target.value
  
                              setFileData([...temp])
                            }}
                            variant="outlined"
                          >
                            <MenuItem value="Lab Report">Lab Report</MenuItem>
                            <MenuItem value="Prescription">Prescription</MenuItem>
                            <MenuItem value="Other">Other files</MenuItem>
                          </TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )) : null}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button startIcon={<Publish />} color="primary" onClick={() => {
              documentsRef?.current.click()
            }} style={{marginRight: "auto"}} variant="outlined">Upload more</Button>
           
            {!saveLoader ? <Button onClick={handleSubmit} color="primary" variant="contained">Save</Button> : (
              <CircularProgress size={24} style={{marginRight: 10}}/>
            )}
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
  
  
  function openBase64FileInNewWindow(base64String, fileType) {
    // Create a Blob from the base64 string
    const byteCharacters = window.atob(base64String.split(";base64,")[1]);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, { type: fileType }); // Change the type accordingly if it's not a PDF
  
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Open the file in a new window
    window.open(url, '_blank');
  
    // Revoke the URL once the window is closed
    window.addEventListener('unload', () => {
      URL.revokeObjectURL(url);
    });
  }