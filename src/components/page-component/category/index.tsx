import { Box, Button, Card, CardContent, CardHeader, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { Magnify, Reload } from "mdi-material-ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TableOrder from "src/components/common/TableOrder";
import CategoryService from "src/services/category";
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
        id: 'name',
        type: 'text',
        label: translation("common.name")
    },
    {
        id: 'status',
        type: 'text',
        label: translation("common.status")
    },
    {
        id: "createdAt",
        type: 'text',
        label: translation("order.created_at")
      },
      {
        id: 'updatedAt',
        type: 'text',
        label: translation("order.updated_at")
      },
];
const CategoryComponent = () => {

    const [categories, setCategories] = useState({ content: [], totalElements: 0, size: 0 });
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('id');
    const [page, setPage] = useState(1);
    const [sizeNumber, setSizeNumber] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const getListCategory = async (page?: number, size?: number, sort?: string) => {
        setLoading(true);
        const param = {
            page: page,
            sortBy: sort,
            size: size
        }
        const res = await CategoryService.getAllCategory(param);
        if (res.status === 200) {
            for (let index = 0; index < res.data.content.length; index++) {
                const element = res.data.content[index];
                element.status = element.status === 1 ? 'Active' : 'Inactive';
            }
            setCategories(res.data);
        } else {
            console.log("errors data");
        }
        setLoading(false);
    }

    const handleChangePage = (page: number) => {
        setPage(page);
        getListCategory(page, sizeNumber, sort)
    }

    const handleChangeSort = (sort: string) => {
        setSort(sort)
        getListCategory(page, sizeNumber, sort)
    }


    const handleChangeSize = (size: any) => {
        setSizeNumber(size);
        getListCategory(1, size, sort)
    }

    const onSearch = () => {
        searchCategory(keyword, 1, sizeNumber, sort);
    }

    const onClear = () => {
        setKeyword('');
        searchCategory('', 1, sizeNumber, sort);
    }

    const searchCategory = async (keyword?: string, page?: number, size?: number, sort?: string) => {
        setLoading(true);
        const param = {
            page: page,
            sortBy: sort,
            size: size,
            keyword: keyword
        }
        const res = await CategoryService.search(param);
        if (res.status === 200) {
            for (let index = 0; index < res.data.content.length; index++) {
                const element = res.data.content[index];
                element.status = element.status === 1 ? 'Active' : 'Inactive';
            }
            setCategories(res.data);
        } else {
            console.log("errors data");
        }
        setLoading(false);
    }

    const onDelete = async (id: number) => {
        const res = await CategoryService.delete(id);
        if (res.status === 200) {
            setMessage("Delete successfully!")
            if (categories.content.length == 1) {
                getListCategory(page - 1, sizeNumber, sort)
                setPage(page - 1)
            } else {
                getListCategory(page, sizeNumber, sort)
            }
        }
    }

    useEffect(() => {
        getListCategory(page, sizeNumber, sort);
    }, [router.isReady, page, sizeNumber, sort])

    return (
        <>
         <Grid container spacing={6}>
                <Grid item xs={12} display='flex' justifyContent='space-between'>
                    <Grid>
                        <Typography variant='h5'>{translation("category.title")}</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant='h5'>
                            <Button variant='contained' onClick={() => router.push("/category/create")}>
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
                                    <TextField fullWidth label={translation("category.name")} value={keyword} onKeyDown={e => e.key === 'Enter' && onSearch()} onChange={(e) => setKeyword(e.target.value)} placeholder={translation("category.name")+"..."} size='small' />
                                </Grid>
                                <Grid item>
                                    <Button variant='contained' onClick={onSearch}>
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
                data={categories.content}
                maxPage={Math.ceil(categories.totalElements / categories.size)}
                header={headCells}
                setPage={handleChangePage}
                setSort={handleChangeSort}
                urlEdit={"/category/"}
                loading={loading}
                onDelete={onDelete}
                size={sizeNumber}
                onChangeSize={handleChangeSize}
                messageDelete={'Do you want to delete this category'}
                messageButton={'Delete'}
            />
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

export default CategoryComponent;