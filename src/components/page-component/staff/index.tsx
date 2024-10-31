import { Box, Button, Card, CardContent, CardHeader, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { Magnify, Reload } from "mdi-material-ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TableOrder from "src/components/common/TableOrder";
import StaffService from "src/services/staff";
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
        id: 'phoneNumber',
        type: 'text',
        label: translation("common.phone_number")
    },
    {
        id: 'status',
        type: 'text',
        label: translation("common.status")
    }
];
const StaffComponent = () => {

    const [staffs, setStaffs] = useState({ content: [], totalElements: 0, size: 0 });
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('id');
    const [page, setPage] = useState(1);
    const [sizeNumber, setSizeNumber] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const getListStaff = async (page?: number, size?: number, sort?: string) => {
        setLoading(true);
        const param = {
            page: page,
            sortBy: sort,
            size: size
        }
        const res = await StaffService.getAllStaffs(param);
        if (res.status === 200) {
            for (let index = 0; index < res.data.content.length; index++) {
                const element = res.data.content[index];
                element.status = element.status === 1 ? 'Active' : 'Inactive';
            }
            setStaffs(res.data);
        } else {
            console.log("errors data");
        }
        setLoading(false);
    }

    const handleChangePage = (page: number) => {
        setPage(page);
        getListStaff(page, sizeNumber, sort)
    }

    const handleChangeSort = (sort: string) => {
        setSort(sort)
        getListStaff(page, sizeNumber, sort)
    }


    const handleChangeSize = (size: any) => {
        setSizeNumber(size);
        getListStaff(1, size, sort)
    }

    const onSearch = () => {
        searchStaffs(keyword, 1, sizeNumber, sort);
    }

    const onClear = () => {
        setKeyword('');
        searchStaffs('', 1, sizeNumber, sort);
    }

    const searchStaffs = async (keyword?: string, page?: number, size?: number, sort?: string) => {
        setLoading(true);
        const param = {
            page: page,
            sortBy: sort,
            size: size,
            keyword: keyword
        }
        const res = await StaffService.searchStaff(param);
        if (res.status === 200) {
            for (let index = 0; index < res.data.content.length; index++) {
                const element = res.data.content[index];
                element.status = element.status === 1 ? 'Active' : 'Inactive';
            }
            setStaffs(res.data);
        } else {
            console.log("errors data");
        }
        setLoading(false);
    }

    const onDelete = async (id: number) => {
        const res = await StaffService.deleteStaff(id);
        if (res.status === 200) {
            setMessage("Delete successfully!")
            if (staffs.content.length == 1) {
                getListStaff(page - 1, sizeNumber, sort)
                setPage(page - 1)
            } else {
                getListStaff(page, sizeNumber, sort)
            }
        }
    }

    useEffect(() => {
        getListStaff(page, sizeNumber, sort);
    }, [])

    return (
        <>
            <Grid container spacing={6}>
                <Grid item xs={12} display='flex' justifyContent='space-between'>
                    <Grid>
                        <Typography variant='h5'>{translation("staff.title")}</Typography>
                    </Grid>
                    <Grid>
                        <Typography variant='h5'>
                            <Button variant='contained' onClick={() => router.push("/staff/create")}>
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
                                    <TextField value={keyword} fullWidth label={'Name'} size='small' onKeyDown={e => e.key === 'Enter' && onSearch()} onChange={(e) => setKeyword(e.target.value)}
                                        placeholder='Name, Phone number' />
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
                data={staffs.content}
                maxPage={Math.ceil(staffs.totalElements / staffs.size)}
                header={headCells}
                setPage={handleChangePage}
                setSort={handleChangeSort}
                urlEdit={"/staff/"}
                loading={loading}
                onDelete={onDelete}
                size={sizeNumber}
                onChangeSize={handleChangeSize}
                messageDelete={'Do you want to delete this staffs'}
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

export default StaffComponent;