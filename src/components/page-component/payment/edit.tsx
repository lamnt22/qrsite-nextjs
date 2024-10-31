import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, CardContent, Container, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { DatePicker , LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useFormik } from "formik";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import TableList from "src/components/common/Table";
import TableService from "src/services/dinner-table";
import OrderService from "src/services/order";
import PaymentDetailService from "src/services/payment";
import { translation } from "src/utils/i18n.util";


interface HeadCell {
    id: string;
    type: string;
    label: string;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'id',
        type: 'text',
        label: translation("common.id")
    },
    {
        id: 'dishName',
        type: 'text',
        label: translation("common.dish_name")
    },
    {
        id: 'quantity',
        type: 'text',
        label: translation("common.quantity")
    },
    {
        id: 'price',
        type: 'text',
        label: translation("order.price")
    },
]

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
const EditPaymentDetailComponent = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tables, setTables] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [dishes, setDishes] = useState([]);

    const formik = useFormik({
        initialValues: {
            tableId: '',
            number: 0,
            totalPrice: 0,
            modifiedAt: '',
            description: '',
            status: 1,
        },
        enableReinitialize: true,
        onSubmit: async (data: any) => {
            setLoading(true);
            const resTable = await TableService.detail(data.tableId);
            if(resTable.status === 200){
                const dataUpdate = {
                    tableId: resTable.data,
                    number: data.number,
                    totalPrice: data.totalPrice,
                    modifiedAt: new Date(data.modifiedAt),
                    description: data.description,
                    status: data.status,
                }
                const res = await PaymentDetailService.udpate(router.query.id, dataUpdate);
                setOpen(true);
                if (res.status === 200) {
                    setMessage(translation("payment.update_success"));
                    router.push("/payment");
                } else {
                    setMessage(translation("error.invalid_information"));
                }
            }
            
            setLoading(false);
        }
    })

    const getDataOrder = async () => {
        setLoading(true);
        const params = {
            paymentId: router.query.id,
            paymentStatus: 1
        }
        const res = await OrderService.getByPaymentId(params)
        if(res.status === 200){
            setDishes(res.data);
            for (let index = 0; index < res.data.length; index++) {
                const element = res.data[index];
                const formattedAmount = element.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                if (formattedAmount.endsWith(".00")) {
                    element.price = formattedAmount.slice(0, -3);
                }    
                
                
            }
        }
        setLoading(false);
        
    }

    const getListTable = async () => {
        const res = await PaymentDetailService.getDinnerActive();

        if (res.status === 200) {
            setTables(res.data);
        } else {
            console.log("errors data");
        }
    }

    const getDataPaymentDetail = async () => {
        const res = await PaymentDetailService.getById(router.query.id);
        if (res.status === 200) {
            console.log();
            await formik.setValues(res.data);
            await formik.setFieldValue("tableId", res.data.tableId.id);
        }
    }

    useEffect(() => {
        getListTable();
        getDataPaymentDetail();
        getDataOrder();
    }, [])

    return (
        <>
            <Grid container spacing={6}>
                <Grid item xs={12} display='flex' justifyContent='space-between'>
                    <Grid>
                        <Typography variant='h5'>{translation("payment.edit_title")}</Typography>
                    </Grid>
                </Grid>

                <Container maxWidth="xl">
                    <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                        <Grid container spacing={5} display={"unset"}>
                            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                                <form onSubmit={formik.handleSubmit}>
                                    <Card sx={{marginBottom: 4}}>
                                        <CardContent>
                                            <Grid item xs={6} paddingTop={4}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="table-label">{translation("common.table")} *</InputLabel>
                                                    <Select
                                                        labelId="table-label"
                                                        id="table-id"
                                                        name="table"
                                                        label={translation("common.table")+"..."}
                                                        value={formik.values.tableId}
                                                        defaultValue={formik.values.tableId}
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                    >
                                                        {
                                                            tables.map((table: any) => (
                                                                <MenuItem key={table.id} value={table.id}>{table.name}</MenuItem>
                                                            ))
                                                        }
                                                    </Select>

                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6} paddingTop={4}>
                                                <TextField
                                                    fullWidth
                                                    name="number"
                                                    label={translation("common.number")}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.number}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={translation("common.number")+ "..."}
                                                    size='small'
                                                    error={formik.touched.number && formik.errors.number ? true : false}
                                                    helperText={formik.touched.number && formik.errors.number && formik.errors.number}
                                                />
                                            </Grid>
                                            <Grid item xs={6} paddingTop={4}>
                                                <TextField
                                                    fullWidth
                                                    name="totalPrice"
                                                    label={translation("common.total_number")}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.totalPrice}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={translation("common.total_number")+ "..."}
                                                    size='small'
                                                    InputProps={{
                                                        inputComponent: NumericFormatCustom as any,
                                                    }}
                                                    error={formik.touched.totalPrice && formik.errors.totalPrice ? true : false}
                                                    helperText={formik.touched.totalPrice && formik.errors.totalPrice && formik.errors.totalPrice}
                                                />
                                            </Grid>
                                            <Grid item xs={6} paddingTop={4}>
                                                <FormControl fullWidth size="small">
                                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                                        <DatePicker 
                                                            onOpen={() => formik.setTouched({ ...formik.touched, ["modifiedAt"]: true })}
                                                            name='modifiedAt'
                                                            format="YYYY/MM/DD"
                                                            value={moment(formik.values.modifiedAt, 'YYYY-MM-DD')}
                                                            slotProps={{
                                                                textField: {
                                                                    onBlur: formik.handleBlur,
                                                                    error: formik.touched.modifiedAt && formik.errors.modifiedAt ? true : false,
                                                                    helperText: formik.touched.modifiedAt && formik.errors.modifiedAt
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                formik.setFieldValue("modifiedAt", e ? moment(e).format('YYYY-MM-DD') : '')
                                                            }}
                                                            label={translation("common.modified_at")+" *"}
                                                        />
                                                    </LocalizationProvider>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6} paddingTop={4}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="status-label">{translation("common.status")} *</InputLabel>
                                                    <Select
                                                        labelId="status-label"
                                                        id="status-id"
                                                        name="status"
                                                        label={translation("common.status") + "..."}
                                                        value={formik.values.status}
                                                        defaultValue={formik.values.status}
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                    >
                                                        <MenuItem value="1">{translation("common.paid")}</MenuItem>
                                                        <MenuItem value="2">{translation("common.unpaid")}</MenuItem>
                                                    </Select>

                                                </FormControl>
                                            </Grid>
                                            <Grid xs={6} paddingTop={4}>
                                                <TextField
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                    value={formik.values.description}
                                                    name="description"
                                                    label={translation("common.description")}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={translation("common.description")+"  ..."}
                                                    error={formik.touched.description && formik.errors.description ? true : false}
                                                    helperText={formik.touched.description && formik.errors.description && formik.errors.description}
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

                                                <Button sx={{ marginLeft: 4 }} variant='outlined' onClick={() => router.push("/payment")}>
                                                    {translation("common.cancel")}
                                                </Button>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </form>
                                <TableList
                                data={dishes}
                                header={headCells}
                                loading={loading}/>
                            </Grid>
                            <Box sx={{ width: 500 }}>
                                <Snackbar
                                    open={open}
                                    onClose={() => setOpen(false)}
                                    message={message}
                                    key={"bottom" + "left"}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </>
    )
}

export default EditPaymentDetailComponent;