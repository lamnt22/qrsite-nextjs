// ** React Imports
import { ReactNode, useState } from 'react'

// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'
import Alert from '@mui/material/Alert';
import { Snackbar } from "@mui/material";


// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { useEffect } from 'react'
import Stomp, { Client } from 'stompjs';
import SockJS from 'sockjs-client'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalAppBarContent?: (props?: any) => ReactNode
}

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  transition: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 6),
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  minHeight: theme.mixins.toolbar.minHeight,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  padding: `${theme.spacing(0)} !important`,
  minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
  transition:
    'padding .25s ease-in-out, box-shadow .25s ease-in-out, backdrop-filter .25s ease-in-out, background-color .25s ease-in-out'
}))

const LayoutAppBar = (props: Props) => {
  // ** Props
  const { settings, verticalAppBarContent: userVerticalAppBarContent } = props

  // ** Hooks
  const theme = useTheme()

  // ** Vars
  const { contentWidth } = settings

  const [open, setOpen] = useState(false);
  const [messageOrder, setMessageOrder] = useState("alllooo");

  const playAudio = () => {
    const audio = new Audio('/music/bell-123742.mp3');
    audio.play();
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const sock = new SockJS(process.env.NEXT_PUBLIC_API_URL + "/ws/");
    const stompClient: Client = Stomp.over(sock);

    if (stompClient) {
      stompClient.debug();
    }

    stompClient.connect(
      {},
      () => {
        stompClient.subscribe('/api/notification/private', (message: any) => {
          const mess = JSON.parse(message.body);
          setOpen(true);
          setMessageOrder(mess.content);
          playAudio();
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

  return (
    <>
      <AppBar elevation={0} color='default' className='layout-navbar' position='static'>
        <Toolbar
          className='navbar-content-container'
          sx={{
            ...(contentWidth === 'boxed' && {
              '@media (min-width:1440px)': { maxWidth: `calc(1440px - ${theme.spacing(6)} * 2)` }
            })
          }}
        >
          {(userVerticalAppBarContent && userVerticalAppBarContent(props)) || null}
        </Toolbar>
      </AppBar>
      <Snackbar open={open} autoHideDuration={3000}  onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {messageOrder}
        </Alert>
      </Snackbar>
    </>

  )
}

export default LayoutAppBar
