import React, { Fragment } from 'react'
import Error403 from '../pages/403';

const withAuth = (Component: React.ComponentType<any>) => {
    
    const Auth = (props: any) => {
        const Layout = (Component as any).Layout ? (Component as any).Layout : Fragment
        const token: any = sessionStorage.getItem("accessToken");
        
        if (!token) {
            
            return (
                <Error403 />
            )
        }

        return (
            <Layout>
                <Component {...props} />
            </Layout>
        )
    }
    if ((Component as any).getInitialProps) {
        Auth.getInitialProps = (Component as any).getInitialProps
    }

    return Auth
}

export default withAuth;
