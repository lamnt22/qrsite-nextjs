import React from 'react'

import { Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from 'yup';
import TableService from 'src/services/dinner-table';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import QRCode from 'qrcode.react';
import { translation } from 'src/utils/i18n.util';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const EditDinnerTable = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      status: '1',
      seatNumber: '',
      description: ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required(translation("table.name_required")).max(100, translation("table.name_max_length")),
      status: Yup.string().required(translation("table.status_required")),
      seatNumber: Yup.number().min(1, translation("table.seat_number_min")).required(translation("table.seat_number_required"))
    }),
    onSubmit: async (data: any) => {
      setLoading(true);
      await TableService.update(router.query.id, data)
        .then(() => {
          setOpen(true);
          setMessage(translation("table.update_table_success"));
          setLoading(false);
          router.push("/dinner-table")

        }).catch((res: any) => {
          setOpen(true);
          setMessage(res.response.data[0]);
          setLoading(false);
        })
    }
  })

  const getData = async () => {
    TableService.detail(router.query.id)
      .then(async (res) => {
        if (res.status == 200) {
          await formik.setValues(res.data);
        }

        // if (res.data.success) {
        //   await formik.setValues(res.data.data)
        // } else {
        //   setMessage(res.data.message)
        //   router.push("/dinner-table")
        // }
      })
  }

  const downloadQR = () => {
    const canvas = document.getElementById('qrcode');
    const pngUrl = canvas?.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    console.log('pngUrl', pngUrl);
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `table${router.query.id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    if (router.isReady) {
      getData()
    }
  }, [router.query.id])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} display='flex' justifyContent='space-between'>
        <Grid>
          <Typography variant='h5'>{translation("table.edit_table")}</Typography>
        </Grid>
        <Grid>
          <Typography variant='h5'>
            <Button sx={{ marginRight: 4 }} variant='contained' onClick={handleClickOpen} >{translation("table.qr_code")}</Button>
          </Typography>
        </Grid>
      </Grid>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <Container maxWidth="xl">
        <Grid item xs={12} sx={{ paddingBottom: 4 }}>
          <Grid container spacing={5} display={"unset"}>
            {
              <form noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
                <Card>
                  <CardContent>
                    <Grid item xs={6} paddingTop={4}>
                      <TextField
                        fullWidth
                        name="name"
                        label={translation("table.name")}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                        placeholder={translation("table.name") + " ..."}
                        size='small'
                        error={formik.touched.name && formik.errors.name ? true : false}
                        helperText={formik.touched.name && formik.errors.name && formik.errors.name}
                      />
                    </Grid>

                    <Grid item xs={6} paddingTop={4}>
                      <TextField
                        fullWidth
                        name="seatNumber"
                        label={translation("table.seat_number")}
                        onChange={formik.handleChange}
                        value={formik.values.seatNumber}
                        onBlur={formik.handleBlur}
                        placeholder={translation("table.seat_number") + " ..."}
                        size='small'
                        error={formik.touched.seatNumber && formik.errors.seatNumber ? true : false}
                        helperText={formik.touched.seatNumber && formik.errors.seatNumber && formik.errors.seatNumber}
                      />
                    </Grid>
                    <Grid item xs={6} paddingTop={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="status-label">{translation("common.status")} *</InputLabel>
                        <Select
                          labelId="status-label"
                          id="status-id"
                          name="status"
                          value={formik.values.status}
                          label={translation("common.status")}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          error={formik.touched.status && formik.errors.status ? true : false}
                        >
                          <MenuItem value="1">{translation("table.avaliable")}</MenuItem>
                          <MenuItem value="0">{translation("table.not_avaliable")}</MenuItem>
                        </Select>

                      </FormControl>
                      <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                    </Grid>

                    <Grid xs={6} paddingTop={4}>
                      <TextField
                        multiline
                        rows={4}
                        maxRows={4}
                        fullWidth
                        name="description"
                        label={translation("table.description")}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        onBlur={formik.handleBlur}
                        placeholder={translation("table.description") + " ..."}
                        size='small'

                      />
                    </Grid>

                    <Grid item paddingTop={4}>
                      <LoadingButton
                        type="submit"
                        variant='contained'
                        loading={loading}
                      >
                        {translation("common.save")}
                      </LoadingButton>
                      <Button variant='contained' sx={{ marginLeft: 4 }} onClick={() => router.push("/dinner-table")}>{translation("common.cancel")}</Button>
                    </Grid>
                  </CardContent>
                </Card>

              </form>
            }
          </Grid>
        </Grid>
        <Box sx={{ width: 500 }}>
          <Snackbar
            open={open}
            onClose={() => setOpen(false)}
            message={message}
            key={"bottom" + "left"}
          />
        </Box>

      </Container>
      {/* modal start */}

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          QRCode
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
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div>
            <QRCode
              id='qrcode'
              value={window.location.origin + `/menu-order/${router.query.id}`}
              size={400}
              level={'H'}
              includeMargin={true}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={downloadQR}>
            Download QR
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {/* modal end */}

    </Grid>

  )
}

export default EditDinnerTable
