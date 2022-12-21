import React, { useContext, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import documentContext from '../context/documents/documentContext';
import Card from '../LandingPage/CardMain';
import Navbar from '../Navbar';
import Spinner from '../Utility_Components/Spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { useNavigate } from 'react-router-dom';

const UserblogCards = () => {

    const docContext = useContext(documentContext);
    let { usercards, setUsercards, GetUserCards, giveid, loading,GiveDocument } = docContext;

    const navigate = useNavigate();

    useEffect(() => {
        GetUserCards(localStorage.getItem('token'));
    }, [])

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:1983/api/blog/deletecard/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'auth-token': localStorage.getItem('token')
            }
        });

        const json = await response.json();

        console.log(json);

        // let item_Item_Name = json.item.Item_Name;

        // if (json.success) {
        //     showalert(`${item_Item_Name} successfully deleted`, 'success')
        // }

        const newcards = usercards.filter((card) => { return card._id !== id })


        // resetting the items variables to be displayed on the home screen
        setUsercards(newcards)
    }

    const handleEdit = async (id) => {
        await GiveDocument(id, localStorage.getItem('userID'))
        navigate(`/addblog/documents/${id}`)
    };

    // console.log(usercards)




    return (
        <div>
            {loading && <Spinner />}
            <Navbar dissavedocument='none' />
            <Grid container spacing={2} sx={{ padding: '15px 0px' }}>
                {usercards.map((e, index) => {
                    return (<Grid item xl={3} xs={12} md={6} lg={4} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around' }} key={index}>
                        <div>
                            <Card title={e.title} description={e.description}
                                thumbnailurl={giveid(e.thumbnailurl)}
                                tag={e.tag} blogid={e.blogID}/>
                            <div id="modification" className='border-2 border-gray-400 flex justify-around rounded-md my-1 py-1'>
                                <ModeEditOutlineIcon className='cursor-pointer' onClick={() => handleEdit(e.blogID)} />
                                <DeleteIcon className='cursor-pointer' onClick={() => handleDelete(e._id)} />
                            </div>

                        </div>
                    </Grid>)
                })}
            </Grid>
        </div>
    )
}

export default UserblogCards
