import { Close } from '@mui/icons-material';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

export const GenericDialog = ({ 
    open, 
    setOpen,
    dialogTitle = "",
    dialogContent = [],
    submitButtonText = "Submit",
    cancelButtonText = "Cancel",
    handleSubmit = null,
    handleCancel = null
 }) => {

    const [state, setState] = useState({});

    const handleClose = () => {
        setOpen(false);
        setState({});
        if(handleCancel){
            handleCancel();
        }
    };

    const handleOnSubmit = () => {

        let error = false;

        // eslint-disable-next-line
        dialogContent.map((item) => {
            if(item?.required && !state?.[item?.key]){
                error = item?.key;
            } else if(item?.validator && !item?.validator(state?.[item?.key])){
                error = item?.key;
            }
        })

        if(!error && handleSubmit){
            handleSubmit(state);
            handleClose();
        } else if(error) {
            toast.error(`Invalid ${error} parameter`)
        }
    }

    const getDialogContent = (item) => {

        let itemComponent = null

        switch(item?.type) {
            case "autocomplete": {
                itemComponent = (
                    <React.Fragment>
                        <Typography>
                            {item?.label} {item?.required ? "*" : ''}
                        </Typography>
                        <Autocomplete 
                            options={item?.options}
                            value={state?.[item?.key]}
                            getOptionLabel={option => option}
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    variant='outlined'
                                    placeholder={item?.placeholder ?? ""}
                                    fullWidth
                                    size='small'
                                    style={{marginTop: 5}}
                                    {...(item?.itemProps ?? {})}
                                />
                            )}
                            onChange={(e, value) => {
                                let tempState = {...state};
                                tempState[item?.key] = value;
                                setState({...tempState});
                            }}
                        />
                    </React.Fragment>
                ) 
                break
            }

            default: {
                itemComponent = (
                    <React.Fragment>
                        <Typography>
                            {item?.label} {item?.required ? "*" : ''}
                        </Typography>
                        <TextField 
                            variant='outlined'
                            placeholder={item?.placeholder ?? ""}
                            fullWidth
                            size='small'
                            style={{marginTop: 5}}
                            value={state?.[item?.key] ?? ""}
                            onChange={(e) => {
                                let tempState = {...state};
                                if(item?.type === 'number'){
                                    const isNumber = /^\d+$/.test(e?.target?.value);
                                    if(isNumber){
                                        tempState[item?.key] = e?.target?.value;
                                    }
                                } else {
                                    tempState[item?.key] = e?.target?.value;
                                }
                                setState({...tempState});
                            }}
                            {...(item?.itemProps ?? {})}
                        />
                    </React.Fragment>
                ) 
                break
            }
        }

        return (
            <React.Fragment>
                <Grid item xs={item?.xs ?? 12} md={item?.md ?? 12}>
                    {itemComponent}
                </Grid>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                PaperProps={{sx: {borderRadius: "10px", maxWidth: "480px"}}}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
                >
                    <Close />
                </IconButton>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {dialogContent?.map(item => (
                            getDialogContent(item)
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOnSubmit}>
                        {submitButtonText}
                    </Button>
                    <Button onClick={handleClose}>
                        {cancelButtonText}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    )
}