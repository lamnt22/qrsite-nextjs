// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))

const Error403 = () => {
  useEffect(() => {
    // const token: any = sessionStorage.getItem("accessToken");
    // const decoded: any = jwtDecode(token);
    // const role = decoded.roles;
    // const currentDate = new Date();

    // // JWT exp is in seconds
    // if (token.exp * 1000 < currentDate.getTime()) {
    //   setUrl("/login");
    // } else {
    //   setUrl("/login");
    // }
  }, [])

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1'>403</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            You have no permission! 🔐
          </Typography>
          <Typography variant='body2'>You don&prime;t have permission to access. Go Home!</Typography>
        </BoxWrapper>
        <Img height='487' alt='error-illustration' src='/images/pages/401.png' />
        <Link passHref href={"/login"}>
          <Button component='a' variant='contained' sx={{ px: 5.5 }} onClick={() => sessionStorage.clear()}>
            Back to Home
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

Error403.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error403
