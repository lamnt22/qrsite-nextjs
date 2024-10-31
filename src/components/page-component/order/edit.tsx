import React from 'react'

import { Box, Button, Card, CardContent, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from 'yup';
import OrderService from 'src/services/order';
import { translation } from 'src/utils/i18n.util';
import Autocomplete from '@mui/material/Autocomplete';
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values: any) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
      />
    );
  },
);

const EditOrder = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [staffs, setStaffs] = useState([]);

  const getStaffs = async () => {
    const res = await OrderService.getListStaff();
    if (res?.status == 200) {
      setStaffs(res?.data);
    }

  }

  const formik = useFormik({
    initialValues: {
      tableName: '',
      dishName: '',
      quantity: 1,
      status: 1,
      note: '',
      staffId: null,
      price: 0
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      status: Yup.string().required(translation("order.status")),
      quantity: Yup.number().min(1, translation("order.quantity_min")).required(translation("order.quantity_required"))
    }),
    onSubmit: async (data: any) => {
      setLoading(true);
      await OrderService.update(router.query.id, data)
        .then(() => {
          setOpen(true);
          setMessage(translation("order.update_order_success"));
          setLoading(false);
          router.push("/order")

        }).catch((res: any) => {
          setOpen(true);
          setMessage(res.response.data[0]);
          setLoading(false);
        })
    }
  })

  const getData = async () => {
    await OrderService.detail(router.query.id)
      .then(async (res: any) => {
        if (res.status == 200) {
          await formik.setValues(res.data);
        }
      })
  }

  useEffect(() => {
    if (router.isReady) {
      getStaffs();
      getData();
    }

  }, [router.query.id])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} display='flex' justifyContent='space-between'>
        <Grid>
          <Typography variant='h5'>{translation("order.edit_order")}</Typography>
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
                        name="tableName"
                        label={translation("order.table_name")}
                        onChange={formik.handleChange}
                        value={formik.values.tableName}
                        onBlur={formik.handleBlur}
                        size='small'
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={6} paddingTop={4}>
                      <TextField
                        fullWidth
                        name="dishName"
                        label={translation("order.dish_name")}
                        onChange={formik.handleChange}
                        value={formik.values.dishName}
                        onBlur={formik.handleBlur}
                        size='small'
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={6} paddingTop={4}>
                      <TextField
                        fullWidth
                        name="price"
                        label={translation("order.price")}
                        onChange={formik.handleChange}
                        value={formik.values.price}
                        onBlur={formik.handleBlur}
                        size='small'
                        InputProps={{
                          readOnly: true,
                          inputComponent: NumericFormatCustom as any,
                        }}
                      />
                    </Grid>


                    <Grid item xs={6} paddingTop={4}>
                      <TextField
                        fullWidth
                        name="quantity"
                        label={translation("order.quantity")}
                        onChange={formik.handleChange}
                        value={formik.values.quantity}
                        onBlur={formik.handleBlur}
                        type="number"
                        size='small'
                        error={formik.touched.quantity && formik.errors.quantity ? true : false}
                        helperText={formik.touched.quantity && formik.errors.quantity && formik.errors.quantity}
                      />
                    </Grid>

                    <Grid item xs={6} paddingTop={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="status-label">{translation("common.status")} * </InputLabel>
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
                          <MenuItem value={1}>{translation("order.new")}</MenuItem>
                          <MenuItem value={0}>{translation("order.success")}</MenuItem>
                        </Select>

                      </FormControl>
                      <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                    </Grid>

                    <Grid item xs={6} paddingTop={4}>
                      <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        options={staffs}
                        getOptionLabel={(option: any) => option.name}
                        value={staffs.find((option: any) => option.id === formik.values.staffId) || null}
                        onChange={(event: any, value: any) => (
                          formik.setFieldValue('staffId', value?.id)
                        )
                        }
                        renderInput={(params) => (
                          <TextField {...params}
                            label={translation("order.staff")}
                            name="staffId"
                            placeholder={translation("order.staff") + " ..."}
                          />
                        )
                        }
                      />
                    </Grid>
                    <Grid xs={6} paddingTop={4}>
                      <TextField
                        multiline
                        rows={4}
                        maxRows={4}
                        fullWidth
                        name="note"
                        label={translation("order.note")}
                        onChange={formik.handleChange}
                        value={formik.values.note}
                        onBlur={formik.handleBlur}
                        placeholder={translation("order.note") + " ..."}
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
                      <Button variant='contained' sx={{ marginLeft: 4 }} onClick={() => router.push("/order")}>  {translation("common.cancel")}</Button>
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

export default EditOrder
