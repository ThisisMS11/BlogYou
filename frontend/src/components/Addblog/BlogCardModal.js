import * as React from 'react';
import { useEffect, useState, useContext } from 'react'
import { useParams } from "react-router-dom";
import Button from '@mui/joy/Button';
import TextField from '@mui/joy/TextField';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { CssVarsProvider } from '@mui/joy/styles';  //! experience 😂
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import Typography from '@mui/joy/Typography';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import documentContext from '../context/documents/documentContext';
import useDrivePicker from 'react-google-drive-picker';
import userContext from '../context/Users/userContext';



export default function BlogCardModal(props) {
    const [open, setOpen] = useState(false);

    const docContext = useContext(documentContext);
    let { blogcardmodalref, SaveBlogCard, saveblogwithcardsubmitref } = docContext;

    const context = useContext(userContext);
    let { accessToken, tokenClient, clientID, developerKey } = context;


    const [blogcardinfo, setBlogcardinfo] = useState({ userID: "", blogID: "", title: "", description: "", thumbnailurl: "", tag: "" })


    //? code for uploading image to my google Drive
    const [openPicker, authResponse] = useDrivePicker();


    const [modaldis, setModaldis] = useState('block');

    const { id } = useParams();


    //! <-----------------------------------------------------Token Work----------------------------------------->


    const imageupload = () => {



        console.log("access_token inside imageupload ", accessToken);

        // for closing the modal
        setModaldis('none')


        // ! this will open a google file picker with access token set at the time of login.
        openPicker({
            clientId: clientID,
            developerKey: developerKey,
            token: accessToken,
            viewId: "DOCS_IMAGES",
            showUploadView: true,
            showUploadFolders: true,
            // setParentFolder: "1-CFP7V3F65CuZg2UhQsLs37oTObtGXv5",
            disableDefaultView: true,
            supportDrives: true,
            multiselect: false,
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                }
                console.log('Data About uploaded Image : ', data)

                setBlogcardinfo({ ...blogcardinfo, thumbnailurl: data.docs[0].url })
                setModaldis('block')
            },

        })
    }

    const handleonchange = (e) => {
        setBlogcardinfo({ ...blogcardinfo, [e.target.name]: e.target.value })
    }

    const handlesubmit = async () => {
        console.log(blogcardinfo);


        saveblogwithcardsubmitref.current.click();

        const json = await SaveBlogCard(blogcardinfo);
        console.log('response after saving blogcard : ', json);
        if (json.success) {
            console.log("Card saving successful");
        }


        // documentId, data, userID
        // UpdateDocument(id, props.data, localStorage.getItem('userID'))
    }

    useEffect(() => {
        setBlogcardinfo({ ...blogcardinfo, userID: localStorage.getItem('userID'), blogID: id })


        tokenClient.requestAccessToken();
    }, [])




    return (
        <CssVarsProvider>


            <Button
                variant="outlined"
                color="neutral"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
                ref={blogcardmodalref}
                sx={{ display: 'none' }}
            >
                New project
            </Button>

            <Modal open={open} onClose={() => setOpen(false)} sx={{ display: modaldis }}>
                <ModalDialog
                    aria-labelledby="basic-modal-dialog-title"
                    aria-describedby="basic-modal-dialog-description"
                    sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                    size='md'
                >
                    <Typography
                        id="basic-modal-dialog-title"
                        component="h2"
                        level="inherit"
                        fontSize="1.25em"
                        mb="0.25em"
                    >
                        Create Blog card
                    </Typography>
                    <Typography
                        id="basic-modal-dialog-description"
                        mt={0.5}
                        mb={2}
                        textColor="text.tertiary"
                    >
                        Fill in the information of the blog.
                    </Typography>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpen(false);
                        }}
                    >
                        <Stack spacing={2}>

                            <TextField label="Title" autoFocus required name="title" value={blogcardinfo.title} onChange={handleonchange} />

                            <TextField label="Description" required name="description" value={blogcardinfo.description} onChange={handleonchange} />

                            <Select
                                placeholder="Select Tag"
                                indicator={<KeyboardArrowDown />}
                                sx={{
                                    width: 240,
                                    [`& .${selectClasses.indicator}`]: {
                                        transition: '0.2s',
                                        [`&.${selectClasses.expanded}`]: {
                                            transform: 'rotate(-180deg)',
                                        },
                                    },
                                }}
                                value={blogcardinfo.tag}
                                onChange={(e, newValue) => setBlogcardinfo({ ...blogcardinfo, tag: newValue })}
                            >
                                <Option value="ClubEvent" label="ClubEvent">Club Event</Option>
                                <Option value="Festive" label="Festive">Festive</Option>
                                <Option value="Informative" label="Informative">Informative</Option>
                            </Select>


                            <div>
                                <TextField label="Google Drive URL" required sx={{ marginBottom: '7px' }} value={blogcardinfo.thumbnailurl} />
                                <Button onClick={imageupload} >Upload Now</Button>
                            </div>
                            <Button type="submit" onClick={handlesubmit}>Submit Blog</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </CssVarsProvider>
    );
}
