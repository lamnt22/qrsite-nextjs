'use client'

import { LoadingButton } from "@mui/lab";
import { Box, Card, CardContent, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import CategoryService from "src/services/category";
import { translation } from "src/utils/i18n.util";
import * as Yup from 'yup';

const CreateCategoryComponent = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            name: '',
            status: 1
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name : Yup.string().required(translation("error.category_name")).max(100, translation("error.category_length_100")).matches(/^\S.*$/, translation("error.category_name"))
        }),
        onSubmit : async (data: any, {setFieldError}) => {
            setLoading(true);
            await CategoryService.create(data).
            then(() => {
                setOpen(true);
                setMessage(translation("category.create_title"));
                router.push("/category");
                setLoading(false);
            }).catch((error: any) => {
                if(error.response.status === 409){
                    setFieldError("name", translation("error.duplicate_category_name"));
                }else{
                    setFieldError("name", translation("error.category_name"));
                }
                setLoading(false);
            })
        }
    })

    return (
        <>
        <Grid container spacing={6}>
            <Grid item xs={12} display='flex' justifyContent='space-between'>
                <Grid>
                    <Typography variant='h5'>{translation("category.create_title")}</Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ paddingBottom: 3 }}>
                <form onSubmit={formik.handleSubmit}>
                    <Card>
                        <CardContent>
                            <Grid item xs={6} paddingTop={4}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label={translation("category.name") + " *"}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={translation("category.name") + "..."}
                                    size='small'
                                    error={!!formik?.errors?.name}
                                    helperText={formik?.errors?.name}
                                />
                            </Grid>
                            <Grid item paddingTop={4}>
                                <LoadingButton
                                    type="submit"
                                    variant='contained'
                                    loading={loading}
                                    style={{marginRight: 20}}
                                    >
                                   {translation("common.save")}
                                </LoadingButton>
                                <LoadingButton
                                    type="button"
                                    variant='outlined'
                                    loading={loading}
                                    onClick={() => router.push("/category")}
                                    >
                                    {translation("common.cancel")}
                                </LoadingButton>
                            </Grid>
                        </CardContent>
                    </Card>
                </form>
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
        </>
    )
}

export default CreateCategoryComponent;
