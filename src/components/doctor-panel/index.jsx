import { Add, MoreVertRounded, UploadFile, Visibility } from "@mui/icons-material";
import { Button, CircularProgress, Divider, Grid, Hidden, IconButton, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { GenericDialog } from "../generic-dialog";
import { useDispatch, useSelector } from "react-redux";
import { MedicalRecordDialog } from "../medical-record-dialog";
import { ViewMedicalRecord } from "../view-medical-record";
import customAxios from "../../axios";
import { UPDATE_LOADER } from "../../redux/constants";
import { toast } from "react-toastify";
import { getPatients } from "../../redux/action";


const CustomTableContainer = styled(TableContainer)({
    overflowY: 'scroll',
    overflowX: "scroll",
    '&::-webkit-scrollbar': {
      width: 1, // Adjust to desired thickness
      height: 0,
      backgroundColor: "transparent",
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'black', // Adjust to desired color
      position: "absolute",
    },
  });

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'gender', label: 'Gender', minWidth: 100 },
    {
      id: 'age',
      label: 'Age',
      minWidth: 50,
      format: (value) => value.toString(),
    },
  ];


export const DoctorPanel = ({isMobile}) => {

    const [addPatientDialog, setAddPatientDialog] = useState(false)
    const user = useSelector(state => state?.auth?.user)
    const dispatch = useDispatch()

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const addPatientDialogContent = [
        { label: "Name", key: "name", md: 6, required: true },
        { label: "Email", key: 'email', md: 6, required: true, validator: validateEmail },
        { label: "Age", key: 'age', md: 6, required: true, type: 'number' },
        { label: "Gender", key: 'gender', md: 6, required: true, options: ["Male", "Female", "Other"], type: "autocomplete" },
    ]

    const handleAddPatient = (data) => {
        dispatch({type: UPDATE_LOADER, payload: true})
        customAxios.post("patient/add", {...data}).then(res => {
            if(res?.data?.success){
                toast.success("Patient added successfuly!")
                dispatch(getPatients())
            }
        }).catch(err => {
            dispatch({type: UPDATE_LOADER, payload: false})
            toast.error(err?.response?.data?.detail)
        })
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} alignItems={'center'}>
                <Grid item xs={12}>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6">
                        👋 Hi, {user?.name ?? ""}
                    </Typography>

                    <Typography style={{color: "grey", fontSize: "12px"}}>
                        {new Date().toDateString()}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6} style={{textAlign: 'end'}}>
                    <Button variant="contained" fullWidth={isMobile ? true : false} startIcon={<Add />} onClick={() => setAddPatientDialog(true)}>
                        Add new Patient
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <AllPatientComponent isMobile={isMobile} />

                <GenericDialog
                    open={addPatientDialog}
                    setOpen={setAddPatientDialog}
                    dialogTitle="Add New Patient"
                    dialogContent={addPatientDialogContent}
                    handleSubmit={(data) => handleAddPatient(data)}
                />

            </Grid>
        </React.Fragment>
    )
}


const AllPatientComponent = ({isMobile}) => {

    const patients = useSelector(state => state?.auth?.patients)

    const [rows, setRows] = useState(patients)
    useEffect(() => {
        setRows([...patients]);
    }, [patients])

    const [searchPatient, setSearchPatient] = useState("")

    useEffect(() => {
        let tempRows = [...patients]
        if(searchPatient){
            tempRows = tempRows.filter(f => {    
                if(f?.email?.toLowerCase()?.includes(searchPatient?.toLowerCase()) || f?.name?.toLowerCase()?.includes(searchPatient?.toLowerCase())){
                    return true
                } else {
                    return false
                }
            })
        }
        setRows([...tempRows])

        // eslint-disable-next-line
    }, [searchPatient])

    const loader = useSelector(state => state?.auth?.loader)

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event, pat) => {
        setAnchorEl(event.currentTarget);
        setPatient(pat)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const [state, setState] = useState([])
    const [patient, setPatient] = useState(null)
    const [openDialog, setOpenDialog] = useState(false)
    const [viewDialog, setViewDialog] = useState(false)

    const documentsRef = useRef(null)


    const uploadFiles = async (files) => {
        const tempArr = state?.length ? [...state] : []
    
        if (files) {
          for (const file of files) {
            let reader = new FileReader()
    
            reader.onload = function (e) {
              tempArr.push({
                file: e.target.result,
                name: file.name,
                type: "Other",
                extension: file.type,
              })
    
              setState([...tempArr])
              setOpenDialog(true)
            }
    
            reader.readAsDataURL(file)
          }
        }
      }

    return (
        <React.Fragment>
            
            <Grid item xs={12} md={6}>
                <Typography variant="h6">
                    All Patients
                </Typography>
                <Typography variant="subtitle1" style={{fontSize: "12px", color: 'grey'}}>
                    {rows?.length} Patients Found
                </Typography>
            </Grid>

            <Grid item xs={12} md={4} style={{marginLeft: 'auto'}}>
                <TextField variant="outlined" fullWidth label="Search Patient" placeholder="Type name or email" 
                    onChange={(e) => {
                        setSearchPatient(e?.target?.value);
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <Hidden smDown>
                    <CustomTableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                >
                                    <Typography style={{color: "grey"}}>
                                        {column.label}
                                    </Typography>
                                </TableCell>
                            ))}
                                <TableCell>
                                    <Typography style={{color: "grey"}}>
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!loader && rows?.length ? rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell>
                                        <Button variant="outlined" color="primary" style={{marginRight: "10px"}} startIcon={<Visibility />} 
                                            onClick={() => {
                                                setPatient(row);
                                                setViewDialog(true);
                                            }}
                                        >
                                            View Medical Records
                                        </Button>
                                        <Button variant="outlined" color="primary" startIcon={<UploadFile />}
                                            onClick={() => {
                                                setPatient(row);
                                                documentsRef.current.click();
                                            }}
                                        >
                                            Upload Medical Records
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                );
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={5} style={{textAlign: "center"}}>
                                        {loader ? <CircularProgress size={30} color='primary' /> : "No Patients Found!"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </CustomTableContainer>
                </Hidden>
                <Hidden smUp>
                <CustomTableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                            {["Patient Details"].map((column) => (
                                <TableCell>
                                    <Typography style={{color: "grey"}}>
                                        {column}
                                    </Typography>
                                </TableCell>
                            ))}
                                <TableCell>
                                    <Typography style={{color: "grey"}}>
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!loader && rows?.length ? rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>                                
                                    <TableCell>
                                        <Typography>
                                            {row.name}
                                        </Typography>
                                        <Typography>
                                            {row.gender?.[0]}, {row?.age}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            {row.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={(e) => handleClick(e, row)}>
                                            <MoreVertRounded />
                                        </IconButton>
                                        <Popover 
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}
                                            PaperProps={{
                                                sx: {
                                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                                                    padding: "5px",
                                                    width: '220px'
                                                },
                                                }}
                                            >
                                            <Button color="primary" style={{marginRight: "10px"}} startIcon={<Visibility />} onClick={() => {
                                                setViewDialog(true);
                                            }}>
                                                View Medical Records
                                            </Button>
                                            <Button color="primary" startIcon={<UploadFile />} onClick={() => {
                                                documentsRef.current.click();
                                            }}>
                                                Upload Medical Records
                                            </Button>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                                );
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={2} style={{textAlign: "center"}}>
                                        {loader ? <CircularProgress size={30} color='primary' /> : "No Patients Found!"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </CustomTableContainer>
                </Hidden>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
            <input
                onChange={(e) => {
                    uploadFiles(e.target.files)
                }}
                hidden
                label="additionalFiles"
                ref={documentsRef}
                title="FilesUploader"
                type="file"
                multiple
                accept="image/*,application/pdf"
            ></input>
            <MedicalRecordDialog
                patient={patient}
                isMobile={isMobile} 
                fileData={state}
                setFileData={setState}
                documentsRef={documentsRef}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
            <ViewMedicalRecord 
                patient={patient}
                isMobile={isMobile}
                openDialog={viewDialog}
                setOpenDialog={setViewDialog}
            />
        </React.Fragment>
    )
}