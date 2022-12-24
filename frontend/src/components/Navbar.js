import React, { useEffect, useContext, useCallback, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import userContext from './context/Users/userContext';
import documentContext from './context/documents/documentContext';
import LoadingBar from 'react-top-loading-bar'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import jwt_decode from "jwt-decode"
const clientID = "177356393773-mt2t9d2ehek21ln45r1e7u0n75p13dk1.apps.googleusercontent.com";


const Navbar = (props) => {
    let { disaddblog, dissavedocument, disavatar } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const navigate = useNavigate();
    const handlelogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        localStorage.removeItem('userinfo');
    }

    // Fetching the user notes here.
    const context = useContext(userContext);
    const docContext = useContext(documentContext);
    let { maintheme, setMaintheme, HandleSignup, GetUserInfo, user, setUser, GiveTokenClient, tokenClient, setTokenClient } = context;


    const handleMyBlogs = async () => {
        handleClose();

        navigate('/myblogscards')
    }

    // ! for opening the blogcard form via modal
    let { blogcardmodalref, check2, saveasdraftref } = docContext;
    const handlecreatecard = () => {
        console.log(check2)
        // here i can call the accesstoken method

        // GiveTokenClient();


        blogcardmodalref.current.click();
    }


    const handleMyDrafts = async () => {
        handleClose();

        // await GetUserBlogs(localStorage.getItem('token'));

        navigate('/mydrafts')
    }


    //! <---------------------------------------Google Authentication Stuff------------------------------>

    const [pic, setPic] = useState([]);


    const handlecallback = async (response) => {
        console.log("Encoded JWT ID token:", response.credential);

        const userObject = jwt_decode(response.credential)

        let result = await HandleSignup(userObject);
        // console.log('result = ', result)

        let useridsetresult = await GetUserInfo(result);

        if (useridsetresult) {
            console.log("User Id set successfully in localStorage. Thanks .")
        }


        console.log(userObject);
        setUser(userObject);
        setPic(userObject.picture)

        const jsonUserObject = JSON.stringify(userObject);

        localStorage.setItem('userinfo', jsonUserObject);

        // ! to remove the login button after successful login
        // document.getElementById("signInDiv").hidden = true;




        //* It will set a token client for us get a access token
        GiveTokenClient();
    }

    const loadUserFromStorage = () => {
        try {
            const serializedState = localStorage.getItem('userinfo');
            if (serializedState === null) {
                return undefined;
            }
            return JSON.parse(serializedState);
        } catch (e) {
            return undefined;
        }
    };

    useEffect(() => {
        // this commment is important for react to know that google does exist in our react app.

        /* global google */
        // or
        if (!localStorage.getItem('userinfo')) {
            const google = window.google;

            google.accounts.id.initialize({
                client_id: clientID,
                callback: handlecallback
            });

            google.accounts.id.renderButton(
                document.getElementById("GoogleAuth"),
                { theme: "outline", size: "large", type: "icon", shape: 'circle' },
            );

            google.accounts.id.prompt();

        }
        else {
            let myself = loadUserFromStorage();
            setPic(myself.picture)
        }
    
    }, [user, pic])



    return (

        <>


            <Box sx={{ flexGrow: 1, bgcolor: 'secondary.main' }}>
                <AppBar position="static" color='secondary' sx={{ bgcolor: 'secondary.dark' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to='/'>
                                BlogYou
                            </Link>
                        </Typography>

                        {/* Switching between light and dark version */}
                        {
                            maintheme ? <DarkModeIcon sx={{ cursor: 'pointer' }} onClick={() => setMaintheme(false)} /> : <LightModeIcon sx={{ cursor: 'pointer' }} onClick={() => setMaintheme(true)} />
                        }




                        {/* -------------------------------- */}



                        {!localStorage.getItem('userinfo') ? <div className=' border-white rounded-md p-2 ml-4' id='GoogleAuth'></div> :
                            <div className='flex'>
                                <Link to='/addblog'>
                                    <Button color="inherit" sx={{ border: 'solid 2px white', marginX: 2, display: disaddblog }}>Add your blog</Button>
                                </Link>

                                <Button color="inherit" sx={{ border: 'solid 2px white', marginX: 2, display: dissavedocument }} onClick={handlecreatecard}>Save Blog</Button>


                                <Avatar sx={{
                                    bgcolor: 'grey',
                                    cursor: 'pointer',
                                    "&:hover": { backgroundColor: "#AAA6AD" }, display: disavatar
                                }} aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    <img src={pic} alt="image not found" />

                                </Avatar>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleMyBlogs}>My Blogs Cards</MenuItem>
                                    <MenuItem onClick={handleMyDrafts}>My Drafts</MenuItem>

                                    {localStorage.getItem('userinfo') ? <MenuItem onClick={handlelogout}>Logout</MenuItem> : <div></div>}

                                </Menu>



                            </div>}


                    </Toolbar>
                </AppBar>
                <LoadingBar
                    color='#0080ff'
                    height={4}
                    progress={100}
                />
            </Box>


        </>
    )
}

export default Navbar