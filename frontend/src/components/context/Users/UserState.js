import userContext from './userContext'
import { useState } from 'react';

const UserState = (props) => {

    // * true== lightTheme and false== darkTheme
    const [maintheme, setMaintheme] = useState(true);

    /*All the useState hooks are here*/
    const [userblogs, setUserblogs] = useState([]);  //! for all user blogs

    const [blogwithid, setBlogwithid] = useState([]);

    // !for the loading bar progress
    const [progress, setprogress] = useState();

    // for the spinner progress
    const [loading, setLoading] = useState(null);

    //! Logged In User State is here
    const [user, setUser] = useState([]);


    // ! Google Stuff for Card modal

    const [accessToken, setAccessToken] = useState([]);
    const [tokenClient, setTokenClient] = useState({});
    const google = window.google;

    const clientID = "177356393773-mt2t9d2ehek21ln45r1e7u0n75p13dk1.apps.googleusercontent.com";
    const SCOPES = "https://www.googleapis.com/auth/drive";
    const developerKey = "AIzaSyDKH9fgVU2p26eabmHdJffvi1hjkeL2Ad4";

    //! HandleLogin is not useful any more.
    const HandleLogin = async (userinfo) => {
        setLoading(true);
        const response = await fetch("http://localhost:1983/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userinfo.email, password: userinfo.password })
        });

        const json = await response.json();

        // console.log(json)                 success + authtoken in response.

        if (json.success) {
            localStorage.setItem('token', json.authtoken);
        }

        setLoading(false);
        return json.success
    }


    const HandleSignup = async (newuserinfo) => {
        setLoading(true);
        console.log('the information about our new user is  ', newuserinfo);
        // setprogress(30)
        const response = await fetch("http://localhost:1983/api/auth/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: newuserinfo.name,
                email: newuserinfo.email,
                userID: newuserinfo.sub
            })
        });

        // json contains success msg and auth-token
        // setprogress(80)
        const json = await response.json();

        console.log('our google user json ', json);

        // saving the authtoken
        if (json.success) {
            console.log("Signup successful");

            localStorage.setItem('token', json.authtoken);

        }
        // setprogress(100)
        setLoading(false);



        return json.authtoken;
    }

    const GetUserInfo = async (authtoken) => {

        const response = await fetch("http://localhost:1983/api/auth/userinfo", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        });

        // json contains userinformation like _id,username,displayname,joinDate.
        const json = await response.json();

        console.log('the infomation about logged in user is', json);

        //! saving the userid into localstorage.
        if (json.success) {
            console.log("Found User successfully");

            localStorage.setItem('userID', json.user._id);
        }
        return json.success;
    }

    const GetUserBlogs = async (authtoken) => {
        const response = await fetch("http://localhost:1983/api/blog/fetchUserBlogs", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        }).then((response) => response.json())
            .then((data) => setUserblogs(data));;

        // json contains our logged in user blogs.
    }

    /* fetch api for obtaining id specific blog */
    const GetBlogwithID = async (id) => {
        setLoading(true);
        const response = await fetch("http://localhost:1983/api/blog/fetchBlogwithID", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blogID: id })
        }).then((response) => response.json())
            .then((data) => setBlogwithid(data));

        setLoading(false);
    }


    const GiveTokenClient = () => {

        setTokenClient(
            google.accounts.oauth2.initTokenClient({
                client_id: clientID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    // we now have a live token to use for any google api.


                    if (tokenResponse && tokenResponse.access_token) {

                        // console.log("access_token inside imageupload ", tokenResponse.access_token);
                        setAccessToken(tokenResponse.access_token);


                    }

                    // console.log('tokenResponse inside useefect : ', tokenResponse.access_token);
                }
            })
        );
    }



    return (
        <userContext.Provider value={{ HandleLogin, HandleSignup, GetUserInfo, GetUserBlogs, userblogs, setUserblogs, blogwithid, setBlogwithid, GetBlogwithID, progress, setprogress, loading, setLoading, maintheme, setMaintheme, user, setUser, accessToken, setAccessToken, tokenClient, setTokenClient, clientID, developerKey, GiveTokenClient }}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;