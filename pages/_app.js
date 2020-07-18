//import { AuthProvider } from '../contexts/auth'
import Router from 'next/router'
import "react-awesome-button/dist/styles.css";

function MyApp({ Component, pageProps }) {
    return (
       // <AuthProvider>
            <Component {...pageProps} />
       // </AuthProvider>
    )
}


export default MyApp