import userContext from '../context/Users/userContext'
import React, { useContext, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Navbar from '../Navbar';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { Link, useNavigate } from 'react-router-dom';
import documentContext from '../context/documents/documentContext';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function UserDrafts() {

    let context = useContext(userContext);
    let docContext = useContext(documentContext);

    let { userblogs, setUserblogs, GetUserBlogs, GetBlogwithID } = context;
    let { GiveDocument } = docContext;

    useEffect(() => {

        async function call() {
            await GetUserBlogs(localStorage.getItem('token'));
        }

        call();
    }, [])


    /*calling BlogwithId and fetch data from the user*/
    const navigate = useNavigate();

    const handleBlogClick = async (blogid) => {
        await GetBlogwithID(blogid);
        navigate(`/blogs/${blogid}`)
    }


    /*Delete and Update */

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:1983/api/newblog/deletedoc/${id}`, {
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

        const newdrafts = userblogs.filter((blog) => { return blog._id !== id })


        // resetting the items variables to be displayed on the home screen
        setUserblogs(newdrafts)
    }



    /*edit*/
    const handleEdit = async (id) => {
        await GiveDocument(id, localStorage.getItem('userID'))
        navigate(`/addblog/documents/${id}`)
    };

    // console.log(userblogs)


    return (
        <>
            <Navbar dissavedocument='none' />
            <div className=" border-green-500 my-4 text-center">
                <TableContainer component={Paper} sx={{ width: 'fit-content', marginX: 'auto' }}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Sno.</StyledTableCell>
                                <StyledTableCell>Blog ID</StyledTableCell>
                                <StyledTableCell align="center">Description</StyledTableCell>
                                <StyledTableCell align="center">Time</StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userblogs.map((e, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row" style={{
                                        "&:hover": {
                                            border: "7px solid green",
                                            color: 'red',
                                            backgroundColor: 'lightblue'
                                        }
                                    }} onClick={() => handleBlogClick(e._id)}>

                                        {e._id}

                                    </StyledTableCell>
                                    <StyledTableCell align="right">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam, quaerat.</StyledTableCell>
                                    <StyledTableCell align="right">{e.Record_date}</StyledTableCell>
                                    <StyledTableCell align="right" onClick={() => handleEdit(e._id)}><ModeEditOutlineIcon sx={{ cursor: 'pointer' }} /></StyledTableCell>
                                    <StyledTableCell align="right"><DeleteIcon sx={{ cursor: 'pointer' }} onClick={() => handleDelete(e._id)} /></StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </>
    );
}