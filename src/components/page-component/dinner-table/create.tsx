'use client'
import { useState } from "react";
import {
  Box, Button, Card, CardContent, Container, FormControl,
  FormHelperText, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography
} from "@mui/material"
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import * as Yup from 'yup';
import TableService from "src/services/dinner-table";
import { translation } from 'src/utils/i18n.util';


const CreateDinnerTable = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

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
      await TableService.create(data)
        .then(() => {
          setOpen(true);
          setMessage(translation("table.create_success"));
          setLoading(false);
          router.push("/dinner-table")
        }).catch((res: any) => {
          setOpen(true);
          setMessage(res.response.data[0]);
          setLoading(false);
        })
    }
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} display='flex' justifyContent='space-between'>
        <Grid>
          <Typography variant='h5'>{translation("table.create_table")}</Typography>
        </Grid>
      </Grid>
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
                          label={translation("common.status") + " ..."}
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
                        onBlur={formik.handleBlur}
                        placeholder={translation("table.description") + " ..."}
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

                      <Button sx={{ marginLeft: 4 }} variant='outlined' onClick={() => router.push("/dinner-table")}>
                        {translation("common.cancel")}
                      </Button>
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
    </Grid>
  )
}

export default CreateDinnerTable
