"use client"
import '@/app/styles/user/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavBar from '@/app/user/common/navBar';
import Footer from './footer';
const Layout = ({children}) => {
    return(
        <>
         <NavBar />
         {children}
         <Footer />
        </>
    )
}

export default Layout