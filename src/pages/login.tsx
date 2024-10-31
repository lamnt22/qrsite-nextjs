// ** React Imports
import { ReactNode} from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import LoginComponent from 'src/components/page-component/login/LoginComponent'

const LoginPage = () => {
  return <LoginComponent />
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
