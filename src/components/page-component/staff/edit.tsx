import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StaffService from "src/services/staff";
import { translation } from "src/utils/i18n.util";
import * as Yup from 'yup';

const EditStaffComponent = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      status: 1
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Staff name is required'),
      phoneNumber: Yup.string().required("Phone number is required"),
      status: Yup.string().required('Status is required')
    }),
    onSubmit: async (data: any) => {
      const res = await StaffService.update(router.query.id, data);
      setOpen(true);
      if (res.status === 200) {
        setMessage(translation("staff.edit_title"));
        router.push("/staff");
      } else {
        setMessage(translation("error.invalid_information"));
      }
      setLoading(false);
    }
  })
  const getData = async () => {
    const res = await StaffService.detail(router.query.id);
    if(res.status === 200){
      await formik.setValues(res.data);
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getData()
    }
  }, [router.query.id])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid>
            <Typography variant='h5'>{translation("staff.edit_title")}</Typography>
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
                          value={formik.values.name}
                          label={translation("staff.name")}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={translation("staff.name") + " ..."}
                          size='small'
                          error={formik.touched.name && formik.errors.name ? true : false}
                          helperText={formik.touched.name && formik.errors.name && formik.errors.name}
                        />
                      </Grid>
                      <Grid item xs={6} paddingTop={4}>
                        <TextField
                          fullWidth
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          label={translation("staff.phone_number")}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder={translation("staff.phone_number") + " ..."}
                          size='small'
                          error={formik.touched.phoneNumber && formik.errors.phoneNumber ? true : false}
                          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber && formik.errors.phoneNumber}
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
                            <MenuItem value="1">{translation("staff.active")}</MenuItem>
                            <MenuItem value="0">{translation("staff.inactive")}</MenuItem>
                          </Select>

                        </FormControl>
                        <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                      </Grid>


                      <Grid item paddingTop={4}>
                        <LoadingButton
                          type="submit"
                          variant='contained'
                          loading={loading}
                        >
                          {translation("common.save")}
                        </LoadingButton>

                        <Button sx={{ marginLeft: 4 }} variant='outlined' onClick={() => router.push("/staff")}>
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
    </>
  )
}

export default EditStaffComponent;