import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, TextField, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
        label: translation("common.number")
    },
    {
        id: 'price',
        type: 'text',
        label: translation("order.price")
    },
]
const BillComponent = () => {

    const [orderDate, setOrderDate] = useState('');
    const [totalNumber, setTotalNumber] = useState('');
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dishes, setDishes] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const router = useRouter();
    const [message, setMessage] = useState('');

    const getDataOrder = async () => {
        setLoading(true);
        const params = {
            tableId: router.query.id,
            paymentStatus: 0
        }
        const res = await OrderService.getByTableId(params)
        if(res.status === 200){
            setDishes(res.data);
            let sum = 0;
            let sumSL = 0;
            for (let index = 0; index < res.data.length; index++) {
                const element = res.data[index];
                setOrderDate(moment(element.createdAt).format("DD-MM-YYYY"))
                sum += element.price;
                sumSL += element.quantity;
                setTotalQuantity(sumSL);
                setTotalNumber(sum.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3));
                const formattedAmount = element.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                if (formattedAmount.endsWith(".00")) {
                    element.price = formattedAmount.slice(0, -3);
                }    
                
                
            }
        }
        setLoading(false);
        
    }

    const handleChangeStatus = async () => {
        for (let index = 0; index < dishes.length; index++) {
            const element: any = dishes[index];
            const resOrder = await OrderService.detail(element.id);
            if(resOrder.status === 200){
                const resPaymentId = await PaymentDetailService.getPaymentLatestId();
                if(resPaymentId.status === 200){
                  resOrder.data.paymentId = resPaymentId.data;  
                }
                resOrder.data.paymentStatus = 1;
                await OrderService.update(element.id, resOrder.data);
            }
        
        }

        
        const res = await TableService.detail(router.query.id);
        if(res.status === 200){
            res.data.status = 1;
            const data = res.data;
            await TableService.update(router.query.id, data);
        }
    }

    const insertPayment = async () => {
        const resTable = await TableService.detail(router.query.id);
        if(resTable.status === 200){
            const bodyData ={
                tableId: resTable.data,
                number: totalQuantity,
                status: 1,
                totalPrice: parseInt(totalNumber.replace(/\$|,/g, ''), 10),
                modifiedAt: new Date()
            }
            const res = await PaymentDetailService.create(bodyData);
            if(res.status === 200){
                setMessage(translation("bill.payment_success"));
            }
        }
    }

    const handleOpen = () => {
        setOpenDeleteDialog(true);
      };
    
      const handleClose = () => {
        setOpenDeleteDialog(false);
      };

      const confirmDelete = () => {
        insertPayment();
        handleChangeStatus();
        setOpenDeleteDialog(false);
      }

    const onDelete = async (id: number) => {
        const res = await OrderService.delete(id);
        if (res.status == 200) {
            setMessage("Order is close");
            getDataOrder();

        }
    }
    useEffect(() => {
        getDataOrder();
    }, [router.query.id])

    return (
        <>
            <Grid container spacing={6}>
                <Grid item xs={12} display='flex' justifyContent='space-between'>
                    <Grid>
                        <Typography variant='h5'>{translation("bill.tilte")}</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant='h5'>{translation("bill.date")+": "+orderDate}</Typography>
                    </Grid>
                </Grid>
                <Container maxWidth="xl">
                    <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                        <Grid container spacing={6} display={"unset"}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={2} display='flex'>
                                        <Grid item sx={{marginTop: 4}}>
                                            {translation("common.order_id")}
                                        </Grid>
                                        <Grid item>
                                            <TextField 
                                                value={router.query.id} 
                                                disabled 
                                                name="tableId"
                                                variant="filled"

                                                inputProps={{min: 0, style: { textAlign: 'center' }}}
                                              />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <TableList
                    data={dishes}
                    header={headCells}
                    urlEdit={"/order/"}
                    loading={loading}
                    onDelete={onDelete}
                    messageDelete={'Do you want to delete this dishes'}
                    messageButton={'Delete'}/>
                    <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2} sx={{ paddingBottom: 4 }} display='flex'>
                                    <Grid item xs={6} style={{ textAlign: 'center' }}>
                                        {translation("common.total_number")}
                                    </Grid>
                                    <Grid item xs={6} style={{ textAlign: 'center' }}>
                                        <TextField 
                                            value={totalQuantity} 
                                            fullWidth 
                                            variant="filled"
                                            disabled 
                                            name="amount"
                                            inputProps={{min: 0, style: { textAlign: 'center' }}}
                                          />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ paddingBottom: 4 }} display='flex'>
                                    <Grid item xs={6} style={{ textAlign: 'center' }}>
                                        {translation("common.total_bill")}
                                    </Grid>
                                    <Grid item xs={6} >
                                        <TextField value={totalNumber} fullWidth variant="filled" disabled inputProps={{min: 0, style: { textAlign: 'center' }}} />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} sx={{ paddingBottom: 4 }} display='flex'>
                                    <Grid item xs={6} style={{ textAlign: 'center' }}>
                                        <LoadingButton
                                            type="submit"
                                            variant='contained'
                                            loading={loading}
                                            onClick={handleOpen}
                                        >
                                            {translation("bill.confirm_payment")}
                                        </LoadingButton>
                                    </Grid>
                                    <Grid item xs={6} style={{ textAlign: 'center' }}>
                                        <Button sx={{ marginLeft: 4 }} variant='outlined' onClick={() => router.push("/dinner-table")}>
                                            {translation("common.cancel")}
                                        </Button>
                                    </Grid>


                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Container>
            </Grid>
            <Box sx={{ width: 500 }}>
                <Snackbar
                open={message ? true : false}
                onClose={() => setMessage("")}
                message={message}
                key={"bottom" + "left"}
                />
            </Box>
            <Dialog
                open={openDeleteDialog}
                onClose={() => handleClose()}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {translation("common.confirm")}
                </DialogTitle>
                <DialogContent>
                <DialogContentText>
                    {translation("bill.confirm_pay")}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={() => handleClose()}>
                    {translation("common.cancel")}
                </Button>
                <Button onClick={confirmDelete}>{translation("common.pay")}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default BillComponent;