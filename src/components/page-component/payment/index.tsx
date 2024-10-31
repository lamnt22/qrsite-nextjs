import { Box, Button, Card, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Magnify, Reload } from "mdi-material-ui";
import moment from "moment";
import { useEffect, useState } from "react";
import TableOrder from "src/components/common/TableOrder";
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
        id: 'tableId',
        type: 'object',
        label: translation("common.table")
    },
    {
        id: 'totalPrice',
        type: 'text',
        label: translation("common.total_number")
    },
    {
        id: 'modifiedAt',
        type: 'date',
        label: translation("common.modified_at")
    },
    {
        id: 'status',
        type: 'text',
        label: translation("common.status")
    }
];
const PaymentDetailsComponent = () => {

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [payments, setPayments] = useState({ content: [], totalElements: 0, size: 0 });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tableId, setTableId] = useState(0);
    const [sort, setSort] = useState('id');
    const [sizeNumber, setSizeNumber] = useState(10);
    const [tables, setTables] = useState([]);

    const getPaymentDetail = async (page?: number, sizeNumber?: number, sort?: string) => {
        setLoading(true);
        const param = {
            page: page,
            size: sizeNumber,
            sortBy: sort
        }
        const res = await PaymentDetailService.getListPaymentDetail(param);
        if (res.status === 200) {
            for (let index = 0; index < res.data.content.length; index++) {
                const element = res.data.content[index];
                const formattedAmount = element.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                if (formattedAmount.endsWith(".00")) {
                    element.totalPrice = formattedAmount.slice(0, -3);
                }
                element.status = element.status === 1 ? 'Paid' : 'Unpaid';
            }
            setPayments(res.data);
        } else {
            console.log("errors data");
        }
        setLoading(false);
    }

    const handleChangePage = (page: number) => {
        setPage(page);
        getPaymentDetail(page, sizeNumber, sort)
    }

    const handleChangeSort = (sort: string) => {
        setSort(sort)
        getPaymentDetail(page, sizeNumber, sort)
    }


    const handleChangeSize = (size: any) => {
        setSizeNumber(size);
        getPaymentDetail(1, size, sort)
    }

    const searchPaymentDetail = async (tableId?: number, startDate?: any, endDate?: any, page?: number, sizeNumber?: number, sort?: string) => {
        const param = {
            tableId: tableId,
            startDate: startDate !== '' ? moment(startDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD"),
            endDate: endDate !== '' ? moment(endDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD"),
            page: page,
            size: sizeNumber,
            sortBy: sort
        }
        const res = await PaymentDetailService.getListSearch(param);
        if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
                const element = res.data[index];
                const formattedAmount = element.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                if (formattedAmount.endsWith(".00")) {
                    element.totalPrice = formattedAmount.slice(0, -3);
                }
                element.status = element.status === 1 ? 'Paid' : 'Unpaid';
            }
            setPayments(res.data);
        } else {
            console.log("errors data");
        }
    }

    const onSearch = async () => {
        searchPaymentDetail(tableId, startDate, endDate, 1, sizeNumber, sort);
    }

    const getListTable = async () => {
        const res = await PaymentDetailService.getDinnerActive();

        if(res.status === 200){
            setTables(res.data);
            setTableId(res.data[0].id);
        } else {
            console.log("errors data");
        }
    }

    useEffect(() => {
        getPaymentDetail(page, sizeNumber, sort)
        getListTable();
    }, [])

    return (
        <>
            <Grid container spacing={6}>
                <Grid item xs={12} display='flex' justifyContent='space-between'>
                    <Grid>
                        <Typography variant='h5'>{translation("payment.title")}</Typography>
                    </Grid>
                </Grid>

                <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                    <Card>
                        <CardHeader title='Filter' titleTypographyProps={{ variant: 'h6' }} />
                        <CardContent>
                            <Grid container spacing={2} display='flex'>
                                <Grid item xs={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="status-label">{translation("common.table")}</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            id="status-id"
                                            label='Table'
                                            onChange={(e: any) => setTableId(e.target.value)}
                                        >
                                            {
                                                tables.map((table: any) => (
                                                    <MenuItem key={table.id} value={table.id}>{table.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <FormControl fullWidth size="small">
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DateTimePicker
                                                name='register_date'
                                                format="YYYY/MM/DD"
                                                views={['year', 'month', 'day']}
                                                value={startDate !== '' ? moment(startDate) : null}
                                                onChange={(e: any) => {
                                                    setStartDate(e ? moment(e).format('YYYYMMDD') : '')
                                                }}
                                                label={translation("common.start_date")}
                                                slotProps={{
                                                    textField: {
                                                        size: 'small',
                                                        onKeyUp: (e) => e.key == 'Enter' && onSearch()
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <FormControl fullWidth size="small">
                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                            <DateTimePicker
                                                name='update_date'
                                                format="YYYY/MM/DD"
                                                views={['year', 'month', 'day']}
                                                value={endDate !== '' ? moment(endDate) : null}
                                                onChange={(e: any) => {
                                                    setEndDate(e ? moment(e).format('YYYYMMDD') : '')
                                                }}
                                                label={translation("common.end_date")}
                                                slotProps={{
                                                    textField: {
                                                        size: 'small',
                                                        onKeyUp: (e) => e.key == 'Enter' && onSearch()
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Button variant='contained' onClick={onSearch}>
                                        <Magnify />
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant='contained' >
                                        <Reload />
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <TableOrder
                page={page}
                data={payments.content}
                maxPage={Math.ceil(payments.totalElements / payments.size)}
                header={headCells}
                setPage={handleChangePage}
                setSort={handleChangeSort}
                loading={loading}
                urlEdit="/payment/"
                size={sizeNumber}
                onChangeSize={handleChangeSize}
            ></TableOrder>
            <Box sx={{ width: 500 }}>
                <Snackbar
                    open={message ? true : false}
                    onClose={() => setMessage("")}
                    message={message}
                    key={"bottom" + "left"}
                />
            </Box>
        </>
    )
}

export default PaymentDetailsComponent;