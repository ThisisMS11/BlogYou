import React, { useEffect, useState } from 'react'
import Navbar from '../../Navbar'
import jwt_decode from "jwt-decode"

const clientID = "177356393773-mt2t9d2ehek21ln45r1e7u0n75p13dk1.apps.googleusercontent.com";

const GAuth = () => {

    const [user, setUser] = useState(null);

    const SCOPES = "https://www.googleapis.com/auth/drive";
    const [tokenClient, setTokenClient] = useState({});




    const handlecallback = (response) => {
        console.log("Encoded JWT ID token:", response.credential);

        const userObject = jwt_decode(response.credential)
        console.log(userObject);
        setUser(userObject);

        // ! to remove the login button after successful login
        document.getElementById("signInDiv").hidden = true;
    }

    const handlesignout = () => {
        setUser(null);
        document.getElementById("signInDiv").hidden = true;
    }

    const createDrivefile = () => {
        tokenClient.requestAccessToken();
    }

    useEffect(() => {

        // this commment is important for react to know that google does exist in our react app.

        /* global google */
        // or
        const google = window.google;

        google.accounts.id.initialize({
            client_id: clientID,
            callback: handlecallback
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large" }
        );

        google.accounts.id.prompt();



        // !Access Tokens
        // this function will return us a client that we can save in  a react state that can be seperate from the one with which we are signed in.

        setTokenClient(
            google.accounts.oauth2.initTokenClient({
                client_id: clientID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    // we now have a live token to use for any google api.
                    console.log(tokenResponse);

                    // Now we are going to talk to our google api

                    if (tokenResponse && tokenResponse.access_token) {
                        // Google Drive API, we are talking to it with HTTP and sending our credentials as a verfication that we are valid users to do so.
                        fetch("https://www.googleapis.com/drive/v3/files", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${tokenResponse.access_token}`
                            },
                            body: JSON.stringify({ "name": "Mohit Saini text", "mimiType": "text/plain" }),
                        })
                    }
                }
            })
        );


        //* This will ask the user that whether they want the website to get accesss to their google drive or not
        // tokenClient.requestAccessToken();

    }, []);


    console.log('tokenClient = > ',tokenClient);


    return (
        <>
            <Navbar />
            <div id='signInDiv' >

            </div>
            {user &&
                <button id="signout" onClick={handlesignout}>
                    SignOut
                </button>
            }



            {user && <div>
                <h2>Welcome, {user.name}!</h2>
                <img src={user.picture} alt="image not found" />

            </div>}

                <input type="submit" onClick={createDrivefile} />
        </>
    )
}

export default GAuth