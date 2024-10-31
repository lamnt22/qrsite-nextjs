import OrderService from 'src/services/order'
import React from 'react'
import { Box, Button, Card, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Magnify, Reload } from "mdi-material-ui";
import TableOrder from "src/components/common/TableOrder";
import SockJs from 'sockjs-client';
import Stomp, { Client } from 'stompjs';
import { translation } from 'src/utils/i18n.util';



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
    id: 'tableName',
    type: 'text',
    label: translation("order.table_name")
  },
  {
    id: 'dishName',
    type: 'text',
    label: translation("order.dish_name")
  },
  {
    id: 'quantity',
    type: 'text',
    label: translation("order.quantity")
  },
  {
    id: 'price',
    type: 'text',
    label: translation("order.price")
  },
  {
    id: 'status',
    type: 'text',
    label: translation("common.status")
  },
  {
    id: 'staffName',
    type: 'text',
    label: translation("order.staff")
  },
  {
    id: "createdAt",
    type: 'text',
    label: translation("order.created_at")
  }
];

const ListOrder = () => {

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [order, setOrder] = useState({ content: [], totalElements: 0, size: 0 });
  const [sort, setSort] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [reload, setReload] = useState(true);
  const [orderIds, setOrderIds] = useState<any>();

  const handleChangePage = (page: number) => {
    setPage(page);
    getOrders(page, sort, size);
  }
  const onClose = async (id: number) => {
    const res = await OrderService.delete(id);
    if (res.status == 200) {
      setMessage(translation("order.order_is_close"));

      if (orderIds !== undefined && orderIds !== null) {
        let _orderIds = { ...orderIds }
        _orderIds = orderIds.filter((item: any) => item !== id);
        setOrderIds(_orderIds);
      }
      if (order.content.length == 1) {
        getOrders(page - 1, sort, size)
        setPage(page - 1)
      } else {
        getOrders(page, sort, size)
      }
    }
  }

  const handleChangeSize = (size: any) => {
    setSize(size);
    getOrders(1, sort, size);
  }

  const handleChangeSort = (sort: string) => {
    setSort(sort)
    getOrders(page, sort, size,);
  }

  const getOrders = async (page?: number, sort?: string, size?: number, name?: string, status?: string) => {
    setLoading(true);
    const param = {
      page: page,
      size: size,
      sortValue: sort,
      name: name,
      status: status,
    }
    const res = await OrderService.getList(param);

    if (res?.status == 200) {
      setLoading(false);
      for (let i = 0; i < res.data.content.length; i++) {
        switch (res.data.content[i].status) {
          case 1:
            res.data.content[i].status = 'New'
            break;
          case 0:
            res.data.content[i].status = 'Success'
            break;
          default:
            break;
        }
        const formattedAmount = res.data.content[i].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        if (formattedAmount.endsWith(".00")) {
          res.data.content[i].price = formattedAmount.slice(0, -3);
        }
      }
       setOrder(res?.data);
    } else {
      setLoading(true);
    }
  }

  const onSearch = () => {
    getOrders(page, sort, size, name, status);
  }

  const onKey = (event: any) => {
    if (event == 'Enter') {
      onSearch()
    }
  }

  const onClear = () => {
    setName('');
    setStatus('');
    setReload(!reload);
  }

  useEffect(() => {
    const sock = new SockJs(process.env.NEXT_PUBLIC_API_URL + "/ws/");

    const stompClient: Client = Stomp.over(sock);

    if (stompClient) {
      stompClient.debug();
    }

    stompClient.connect(
      {},
      () => {
        stompClient.subscribe('/api/notification/private', (message: any) => {
          const mess = JSON.parse(message.body);
          setOrderIds(mess.orderIds);
          getOrders(page, '', size);
        })
      });

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected from STOMP client.");
        });
      }
      if (sock) {
        sock.close();
      }
    }
  }, [])

  useEffect(() => {
    getOrders(page, '', size);
  }, [reload])


  return (
    <>
      <Grid item xs={12} sx={{ marginBottom: 4 }} display='flex' justifyContent='space-between'>
        <Grid>
          <Typography variant='h5'>{translation("order.list_order")}</Typography>
        </Grid>
        {/* <Grid>
          <Typography variant='h5'>
            <Button variant='contained' onClick={() => router.push("dinner-table/create")}>
              Create Order
            </Button>
          </Typography>
        </Grid> */}
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 4 }}>
        <Card>
          <CardHeader title={translation("common.filter")} titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <Grid container spacing={5} display='flex'>
              <Grid item xs={3}>
                <TextField fullWidth
                  label={translation("order.search_order")}
                  id='search_name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={translation("order.search_order") + " ..."}
                  size='small'
                  onKeyUp={(event) => onKey(event.key)}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">{translation("common.status")}</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status-id"
                    value={status}
                    label='Seat Number'
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value={1}>{translation("order.new")}</MenuItem>
                    <MenuItem value={0}>{translation("order.success")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item >
                <Button variant='contained'
                  onClick={onSearch}
                >
                  <Magnify />
                </Button>
                <Button variant='contained' sx={{ marginLeft: 4 }}
                  onClick={onClear}
                >
                  <Reload />
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid >
      <TableOrder
        page={page}
        data={order.content}
        maxPage={Math.ceil(order.totalElements / order.size)}
        header={headCells}
        setPage={handleChangePage}
        setSort={handleChangeSort}
        urlEdit={"/order/"}
        onClose={onClose}
        loading={loading}
        size={size}
        messageDelete={translation("order.close_order")}
        messageButton={translation("common.save")}
        onChangeSize={handleChangeSize}
        orderIds={orderIds}
      ></TableOrder>

      <Box sx={{ width: 500  }}>
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

export default ListOrder
