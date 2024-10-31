import React, { ReactNode, useEffect, useState } from 'react';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
  TextField,
  Dialog,
  AppBar,
  ListItemText,
  ListItemButton,
  List,
  Toolbar,
  Divider,
  Badge,
  ListItem,
  Snackbar,
  Alert
} from '@mui/material';

import { Close } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import DishesService from 'src/services/dishes';
import LoadingButton from '@mui/lab/LoadingButton';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import MenuOrderService from 'src/services/menu-order';
import { useRouter } from "next/router"
import CheckIcon from '@mui/icons-material/Check';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ViewListIcon from '@mui/icons-material/ViewList';
import CategoryService from 'src/services/category';
import { translation } from 'src/utils/i18n.util';


const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MenuOrder() {
  const [dishes, setDishes] = useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = useState<any>();


  const [orderedItems, setOrderedItems] = useState<any>([]);
  const [itemQuantities, setItemQuantities] = useState<any>({});

  const [messageOrder, setMessageOrder] = useState<any>({
    tableId: 0,
    message: '',
    title: '',
    orderIds: ''
  });
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [openMessage, setOpenMessage] = useState(false);

  const [message, setMessage] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const handleShow = () => {
    setIsOpen(true);
  };

  const handleCloseCategory = () => {
    setIsOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAddItem = (item: any) => {
    const existingItem = orderedItems.find((i: any) => i.id === item.id);
    const quantity = itemQuantities?.[item.id] || 0;
    if (existingItem) {
      const updatedItems = orderedItems.map((i: any) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      setOrderedItems(updatedItems);
    } else {
      setOrderedItems([...orderedItems, { ...item, quantity: 1 }]);
    }
    setItemQuantities({ ...itemQuantities, [item.id]: quantity + 1 });
  }


  const handleRemoveItem = (item: any) => {

    const existingItem = orderedItems.find((i: any) => i.id === item.id);
    const quantity = itemQuantities[item.id] || 0;
    if (existingItem && existingItem.quantity > 1) {
      const updatedItems = orderedItems.map((i: any) => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
      setOrderedItems(updatedItems);
      setItemQuantities({ ...itemQuantities, [item.id]: quantity - 1 });
    } else {
      const updatedItems = orderedItems.filter((i: any) => i.id !== item.id);
      setOrderedItems(updatedItems);
      setItemQuantities({ ...itemQuantities, [item.id]: 0 });
    }
  };


  const getTotalPrice = () => {
    return orderedItems.reduce((total: any, item: any) => total + item.price * item.quantity, 0);
  }

  const getAllDishes = async () => {
    const res = await DishesService.getAllDishActive();
    if (res?.status === 200) {
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];

        const resImage = await DishesService.convertFileImage(element.image);
        const resContentType = await DishesService.uploadFileImage(element);
        if (resImage.status === 200) {
          element.image = "data:" + resContentType.data.type + ";base64," + resImage.data;
        }
      }
      setDishes(res?.data);
    }
  }

  const sendOrder = async () => {
    setLoading(true);
    const res = await MenuOrderService.create(router.query.id, orderedItems);
    console.log("res.status: ", res);

    const newMessage = { ...messageOrder };
    newMessage.tableId = router.query.id;
    newMessage.title = "Order";
    newMessage.orderIds = res.data;

    setMessageOrder(newMessage);
    await MenuOrderService.sendMessage(newMessage);

    if (res.status == 200) {
      setLoading(false);
      setItemQuantities({});
      setOrderedItems([]);
      setOpenMessage(true);
      setMessage("ordered successfully!");
      handleClose();
    }

  };

  const getCategories = async () => {
    const res = await CategoryService.getCategorySelected();
    setCategories(res?.data);

  }
  const handleCategoryChange = (categoryId: string) => {
    handleCloseCategory();
    scrollCategoryIntoView(categoryId); // Scroll to selected category
  };

  const scrollCategoryIntoView = (categoryId: string) => {
    const categoryElement = document.getElementById(`category-${categoryId}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };

  useEffect(() => {
    getAllDishes();
    getCategories();
  }, [])


  return (
    <Box className="content-center" >
      <Card sx={{ minWidth: 370, maxWidth: 700, width: 700 }} >
        <Box sx={{ maxWidth: 700 }}>
          <Snackbar
            open={openMessage}
            autoHideDuration={2000}
            onClose={() => setOpenMessage(false)}

          >
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" variant="filled" sx={{
              width: '96.5%',
              position: 'fixed !important',
              top: '0 !important',
              marginTop: 2
            }}>
              {message}
            </Alert>

          </Snackbar>
        </Box>
        {/* category */}
        <Box sx={{ position: 'fixed', top: 0, zIndex: 10, backgroundColor: '#ffffff', width: '100%', maxWidth: '700px' }}>
          <Typography textAlign={'center'} variant='h5' sx={{ mt: 2 }}>
            {translation("order.menu_order")}
          </Typography>
          <ToggleButton value="left" aria-label="left aligned" size="small" onClick={handleShow} >
            <ViewListIcon />
            <Typography>{translation("order.category")}</Typography>
          </ToggleButton>
          {isOpen && (
            <Paper sx={{ width: 320, position: 'fixed', zIndex: 9 }}>
              <IconButton
                onClick={handleCloseCategory}
                sx={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  zIndex: 1,
                }}
              >
                <Close />
              </IconButton>
              <MenuList dense>

                <MenuItem>
                  <ListItemText >{translation("order.category_dish")}</ListItemText>
                </MenuItem>
                <Divider />
                {categories.map((item: any) => {
                  return (
                    <MenuItem key={item?.id}>
                      <ListItemText onClick={() => { handleCategoryChange(item.id) }}>{item.name}</ListItemText>
                    </MenuItem>
                  )
                })}
                <MenuItem key="other">
                  <ListItemText onClick={() => { handleCategoryChange("other") }}>{translation("order.other")}</ListItemText>
                </MenuItem>
              </MenuList>
            </Paper>
          )}
        </Box>
        {/* category */}

        <Box sx={{ mt: 21 }}>
          {categories?.map((item: any) => {
            const dishSelect = dishes.filter((dish: any) => dish?.categoryId === item?.id)

            return (
              <div key={item.id} id={`category-${item.id}`} >
                <Divider />
                <Typography sx={{ ml: 2 }}>{item.name}</Typography>
                {dishSelect?.map((item: any) => {

                  return (
                    <>
                      <CardHeader
                        title={item.name}
                      />
                      <CardMedia
                        sx={{ objectFit: 'fill' }}
                        component="img"
                        height="220"
                        image={item.image}
                        alt="Paella dish"
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </CardContent>
                      <CardActions disableSpacing>
                        <IconButton aria-label="remove" onClick={() => { handleRemoveItem(item) }}>
                          <RemoveCircleIcon />
                        </IconButton>
                        <TextField
                          id="outlined-number"
                          disabled
                          variant="standard"
                          sx={{ maxWidth: 30, }}
                          value={itemQuantities[item.id] || '0'}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            inputProps: {
                              style: { textAlign: "center" },
                            }
                          }}
                        />
                        <IconButton aria-label="add to card" onClick={() => { handleAddItem(item) }}>
                          <AddCircleIcon />
                        </IconButton>
                        <Typography variant="h5" textAlign={'right'}>
                          {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3)}
                        </Typography>
                      </CardActions>
                    </>
                  )
                })}
              </div>
            )
          })}

          {dishes.map((item: any) => {
            if (item.categoryId == null) {
              return (
                <div key={item.id} id='category-other' >
                  <Divider />
                  <Typography sx={{ ml: 2 }}>{translation("order.other")}</Typography>
                  <CardHeader
                    title={item.name}
                  />
                  <CardMedia
                    sx={{ objectFit: 'fill' }}
                    component="img"
                    height="220"
                    image={item.image}
                    alt="Paella dish"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="remove" onClick={() => { handleRemoveItem(item) }}>
                      <RemoveCircleIcon />
                    </IconButton>
                    <TextField
                      id="outlined-number"
                      disabled
                      variant="standard"
                      sx={{ maxWidth: 30, }}
                      value={itemQuantities[item.id] || '0'}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputProps: {
                          style: { textAlign: "center" },
                        }
                      }}
                    />
                    <IconButton aria-label="add to card" onClick={() => { handleAddItem(item) }}>
                      <AddCircleIcon />
                    </IconButton>
                    <Typography variant="h5" textAlign={'right'}>
                      {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3)}
                    </Typography>
                  </CardActions>
                </div>
              );
            }
          })}

        </Box>

      </Card>

      {/* bottom */}
      {/* sx={{ top: 'auto', bottom: 0 }} */}
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, left: '50%', transform: 'translateX(-50%)', maxWidth: 700, minWidth: 370 }}>
        <Toolbar >
          <IconButton color="inherit" aria-label="open drawer" onClick={handleClickOpen}>
            <Badge badgeContent={orderedItems.length} color="error">
              {translation("order.order")} <RamenDiningIcon />
            </Badge>
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>


      {/* show order */}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {translation("order.order_detail")}
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>

          {orderedItems.map((item: any) => {
            return (
              <>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">

                  <ListItemText sx={{ mt: 4, maxWidth: 100 }}>
                    {item.name}
                  </ListItemText>
                  <ListItemText sx={{ mt: 4, width: "100px" }}>
                    {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3)}
                  </ListItemText>

                  <ListItemButton sx={{ maxWidth: "50px" }}>
                    <IconButton aria-label="remove" onClick={() => { handleRemoveItem(item) }}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </ListItemButton>

                  <TextField
                    id="outlined-number"
                    disabled
                    variant="standard"
                    sx={{ maxWidth: 30, ml: 3, mt: 2 }}
                    value={itemQuantities[item.id] || '0'}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "center" },
                      }
                    }}
                  />
                  <ListItemButton sx={{ maxWidth: "50px" }} >
                    <IconButton aria-label="add to card" onClick={() => { handleAddItem(item) }}>
                      <AddCircleIcon />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              </>
            )

          })}

          <Divider variant="inset" component="li" />
          <Typography variant="h6" gutterBottom
            textAlign={'right'}
            sx={{ mt: 5, mr: 5 }}
          >
            {translation("order.total_payable")}: {getTotalPrice().toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(0, -3)}
          </Typography>
          <Typography textAlign={'center'}
            sx={{ mt: 5 }}
          >
            <LoadingButton
              onClick={() => sendOrder()}
              endIcon={<FoodBankIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
              disabled={orderedItems.length > 0 ? false : true}
            >
              <span>{translation("order.send_order")}</span>
            </LoadingButton>
          </Typography>
        </List>
      </Dialog>
    </Box>

  );
}

MenuOrder.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
