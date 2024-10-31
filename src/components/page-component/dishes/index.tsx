import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { CardHeader, CardContent, TextField, Button, Snackbar, Box } from '@mui/material'
import { Magnify, Reload } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import DishesService from 'src/services/dishes';
import TableOrder from 'src/components/common/TableOrder'
import { useRouter } from 'next/router'
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
        id: 'name',
        type: 'text',
        label: translation("common.name")
    },
    {
        id: 'image',
        type: 'image',
        label: translation("common.image")
    },
    {
        id: 'price',
        type: 'text',
        label: translation("common.price")
    },
    {
        id:'status',
        type: 'text',
        label: translation("common.status")
    },
    {
        id: "category",
        type: 'object',
        label: translation("common.category"),
    }
];
export default function DishesComponents () {

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);
    const [dishes, setDishes] = useState({content: [], totalElements: 0, size: 0});
    const [name, setName] = useState('');
    const [sort, setSort] = useState('id');
    const [sizeNumber, setSizeNumber] = useState(10);
    const router = useRouter();


    const getAllDishes = async (page?: number, sizeNumber?: number, sort?: string) => {
        setLoading(true);
        const param = {
          page: page,
          size: sizeNumber,
          sortBy: sort
        }
        const res = await DishesService.getListDishes(param);
        if(res.status === 200){
            for (let index = 0; index < res.data.content.length; index++) {
                const element = res.data.content[index];
                const resImage = await DishesService.convertFileImage(element.image);
                const resContentType = await DishesService.uploadFileImage(element);
                if(resImage.status === 200){
                    element.image ="data:" + resContentType.data.type + ";base64,"+ resImage.data;
                }
                const formattedAmount = element.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                if (formattedAmount.endsWith(".00")) {
                    element.price = formattedAmount.slice(0, -3);
                }
                element.status = element.status === 1 ? 'Active' : 'Inactive';
            }
            setDishes(res.data);
        }else {
            console.log("errors data");
        }
        setLoading(false);
    }

    const handleChangePage = (page: number) => {
        setPage(page);
        getAllDishes(page, sizeNumber, sort)
    }

    const handleChangeSort = (sort: string) => {
        setSort(sort)
        getAllDishes(page, sizeNumber, sort)
    }


    const handleChangeSize = (size: any) => {
        setSizeNumber(size);
        getAllDishes(1, size, sort)
    }

    const onSearch = () => {
        searchDishes(name,1, sizeNumber, sort);
    }

    const onClear = () => {
        setName('');
        searchDishes('',1, sizeNumber, sort);
      }

    const searchDishes = async (name?: string, page?: number, sizeNumber?: number, sort?: string) => {
        const param = {
            keyword: name,
            page: page,
            size: sizeNumber,
            sortBy: sort
          }
        const res = await DishesService.getListSearch(param);
        if(res.status === 200){
            for (let index = 0; index < res.data.content.length; index++) {
                const element = res.data.content[index];
                const resImage = await DishesService.convertFileImage(element.image);
                const resContentType = await DishesService.uploadFileImage(element);
                if(resImage.status === 200){
                    element.image ="data:" + resContentType.data.type + ";base64,"+ resImage.data;
                }
                const formattedAmount = element.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                if (formattedAmount.endsWith(".00")) {
                    element.price = formattedAmount.slice(0, -3);
                }
                element.status = element.status === 1 ? 'Active' : 'Inactive';
            }
            setDishes(res.data);
        }else {
            console.log("errors data");
        }
    }

    const onDelete = async (id: number) => {
        const res = await DishesService.delete(id);
        if (res.status === 200) {
          setMessage("Delete successfully!")
          if (dishes.content.length == 1) {
            getAllDishes(page-1,sizeNumber, sort)
            setPage(page-1)
          } else {
            getAllDishes(page, sizeNumber, sort)
          }
        }
      }


    useEffect(() => {
        getAllDishes(page, sizeNumber, sort);
    }, [])

    return (
    <>
        <Grid container spacing={6}>
            <Grid item xs={12} display='flex' justifyContent='space-between'>
                <Grid>
                    <Typography variant='h5'>{translation("dishes.title")}</Typography>
                </Grid>
                <Grid>
                    <Typography variant='h5'>
                        <Button variant='contained' onClick={() => router.push("/dishes/create")}>
                        {translation("common.new")}
                        </Button>
                    </Typography>
                </Grid>
            </Grid>

            <Grid item xs={12} sx={{ paddingBottom: 4 }}>
                <Card>
                    <CardHeader title='Filter' titleTypographyProps={{ variant: 'h6' }} />
                    <CardContent>
                        <Grid container spacing={2} display='flex'>
                            <Grid item xs={3}>
                                <TextField value={name} fullWidth label={translation("common.dish_name")} size='small' onKeyDown={e => e.key === 'Enter' && onSearch()} onChange={(e) => setName(e.target.value)}
                                placeholder={translation("common.dish_name")} />
                            </Grid>
                            <Grid item>
                                <Button onClick={() => onSearch()} variant='contained'>
                                    <Magnify />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant='contained' onClick={onClear}>
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
        data={dishes.content}
        maxPage={Math.ceil(dishes.totalElements / dishes.size)}
        header={headCells}
        setPage={handleChangePage}
        setSort={handleChangeSort}
        urlEdit={"/dishes/"}
        loading={loading}
        onDelete={onDelete}
        size={sizeNumber}
        onChangeSize={handleChangeSize}
        messageDelete={'Do you want to delete this dishes'}
        messageButton={'Delete'}
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
