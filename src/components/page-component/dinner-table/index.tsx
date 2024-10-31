import React from 'react'
import { Box, Button, Card, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Magnify, Reload } from "mdi-material-ui";
import TableService from 'src/services/dinner-table';
import router from "next/router";
import GridExample from 'src/components/common/TableGrid';
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
    label: 'Id'
  },
  {
    id: 'name',
    type: 'text',
    label: 'Name'
  },
  {
    id: 'seatNumber',
    type: 'text',
    label: 'Seat Number'
  },
  {
    id: 'status',
    type: 'text',
    label: 'Status'
  },
  {
    id: "createdAt",
    type: 'text',
    label: 'Created At'
  },
  {
    id: 'updatedAt',
    type: 'text',
    label: 'Updated At'
  },

];
const ListDinnerTable = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [dinnerTable, setDinnerTable] = useState({ content: [], totalElements: 0, size: 0 });
  const [sort, setSort] = useState("id");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const handleChangePage = (page: number) => {
    setPage(page);
    getDinnerTable(page, sort, size, name ,status);
  }
  const onDelete = async (id: number) => {
    const res = await TableService.delete(id);
    if (res.status == 200) {
      setMessage("Table is deleted");
      if (dinnerTable.content.length == 1) {
        getDinnerTable(page - 1, sort, size, name, status)
        setPage(page - 1)
      } else {
        getDinnerTable(page, sort, size, name, status)
      }

    }
  }

  const handleChangeSize = (size: any) => {
    setSize(size);
    getDinnerTable(1, sort, size, name, status);
  }

  const getDinnerTable = async (page?: number, sort?: string, size?: number, name?: string, status?: string) => {
    setLoading(true);
    const param = {
      page: page,
      size: size,
      sortValue: sort,
      name: name,
      status: status,
    }

    TableService.getList(param)
      .then((res) => {
        if (res.data) {
          for (let i = 0; i < res.data.content.length; i++) {
            switch (res.data.content[i].status) {
              case "1":
                res.data.content[i].status = 'Available'
                break;
              case "0":
                res.data.content[i].status = 'Not available'
                break;
              default:
                break;
            }
          }
        }
        setDinnerTable(res.data);
      }).catch(() => {
        setLoading(false);
      }).finally(() => setLoading(false));

  }


  const onSearch = () => {
    getDinnerTable(1, sort, size, name, status);
  }

  const onKey = (event: any) => {
    if (event == 'Enter') {
      onSearch()
    }
  }

  const onClear = () => {
    setName('');
    setStatus('');
    getDinnerTable(1, sort, size, '', '');
  }

  const onChangeStatus = async (id: number, status: string) => {
    const res = await TableService.detail(id);
    if (res.status === 200) {
      res.data.status = status;
      const data = res.data;
      await TableService.update(id, data).then(() => {
        getDinnerTable(page, sort, size, '', '');

      }).catch((res: any) => {
        console.log(res);
      })
    }
  }

  useEffect(() => {
    getDinnerTable(page, sort, size, name, status);
    setSort('id');
  }, [])

  return (
    <>
    <Grid container xs={12} spacing={2}>
      <Grid xs={12} sx={{ marginBottom: 4 }} display='flex' justifyContent='space-between'>
        <Grid>
          <Typography variant='h5'>List Table</Typography>
        </Grid>
        <Grid>
          <Typography variant='h5'>
            <Button variant='contained' onClick={() => router.push("dinner-table/create")}>
              Create Table
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Grid xs={12} sx={{ paddingBottom: 4, width: '100%' }}>
        <Card>
          <CardHeader title='Filter' titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <Grid container spacing={5} display='flex'>
              <Grid item xs={3}>
                <TextField fullWidth
                  label={translation("table.name")}
                  id='search_name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={translation("table.name") + " ..."}
                  size='small'
                  onKeyUp={(event) => onKey(event.key)}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status-id"
                    value={status}
                    label='Seat Number'
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="1">{translation("table.avaliable")}</MenuItem>
                    <MenuItem value="0">{translation("table.not_avaliable")}</MenuItem>
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
      </Grid>
      <GridExample
        page={page}
        data={dinnerTable.content}
        maxPage={Math.ceil(dinnerTable.totalElements / dinnerTable.size)}
        header={headCells}
        setPage={handleChangePage}
        urlDetail={"/bill/"}
        urlEdit={"/dinner-table/"}
        loading={loading}
        onDelete={onDelete}
        size={size}
        onChangeSize={handleChangeSize}
        onChangeStatus={onChangeStatus}
        messageDelete={'Do you want to delete this table'}
        messageChange={'Do you want to update status of this table'}
        dragable={true}></GridExample >
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


export default ListDinnerTable
