import React from 'react'
// import logo from '../assets/art-logo.png'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import './NavBar.css'

interface NavBarProps {
    isLoggedIn: boolean;
    isAdmin: boolean;
}


export default function NavBar(props: NavBarProps) {
    const tabItems = [
        {
            content: 'כניסה',
            link: '/login',
            icon: <LoginIcon />,
            isVisible: !props.isLoggedIn,
        },
        {
            content: 'יציאה',
            link: '/login',
            icon: <LoginIcon />,
            isVisible: props.isLoggedIn,
        },
        {
            content: 'בית',
            link: '/home-page',
            icon: <AppRegistrationIcon />,
            isVisible: props.isLoggedIn,
        },
        {
            content: 'טבלת שמירות',
            link: '/duties-table',
            icon: <AppRegistrationIcon />,
            isVisible: props.isLoggedIn,
        },
        {
            content: 'עריכה',
            link: '/edit',
            icon: <AppRegistrationIcon />,
            isVisible: props.isLoggedIn && props.isAdmin,
        },
        {
            content: 'אילוצים',
            link: '/constraints',
            icon: <AppRegistrationIcon />,
            isVisible: props.isLoggedIn,
        },
 
    ]
    return (
        <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
            <AppBar position="static" style={{ backgroundColor: '#343A40' }}>
                <Toolbar>
                    {/* <img style={{ height: '40px' }} src={logo}></img> */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    ></Typography>
                    {tabItems
                        .filter((i) => i.isVisible)
                        .reverse().map((item) => (
                            <React.Fragment key={item.link}>
                                <Link to={item.link}>
                                    <Button sx={{
                                        color: 'white',
                                        textTransform: 'none',
                                        letterSpacing: '1.2px',
                                        fontWeight: 'bold',
                                    }} color="inherit">
                                        <span
                                            style={{
                                                marginRight: '2px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {item.content}
                                        </span>
                                        {item.icon}
                                    </Button>
                                </Link>
                            </React.Fragment>
                        ))}
                </Toolbar>
            </AppBar>
        </Box>
    )
}
const navBtnStyle = {
    color: 'white',
    textTransform: 'none',
    letterSpacing: '1.2px',
    fontWeight: 'bold',
}
