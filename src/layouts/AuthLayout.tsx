'use client'

import { ReactElement, useEffect, useState } from 'react'
import { CircularProgress, Stack } from '@mui/material'
import { useRouter } from 'next/router'

const AuthLayout = ({ children }: { children: ReactElement }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const render = () => {
    return (
      loading ?
        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" style={{ justifyContent: 'center', minHeight: '100vh', alignItems: 'center' }}>
          <CircularProgress color="secondary" />
        </Stack> :
        children
    )
  }

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (router.pathname != '/menu-order/[id]') {
      if (token && router.pathname == '/login') {
        router.push('/');
      }
      if (!token && !(router.pathname == '/login' || router.pathname == '/reset/[token]')) {
        router.push('/login');
      }
    }

    setLoading(false);
  }, [router])

  return render();
}

export default AuthLayout
