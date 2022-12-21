import * as React from 'react';
import { useContext } from 'react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import documentContext from '../context/documents/documentContext';
import userContext from '../context/Users/userContext';
import { Link, useNavigate } from 'react-router-dom';
import { dark } from '@mui/material/styles/createPalette';

export default function CardMain(props) {
    let { title, description, thumbnailurl, tag, blogid } = props;

    const context = useContext(userContext);

    let { GetBlogwithID, maintheme } = context;

    const navigate = useNavigate();

    const handlereadmore = async (id) => {
        await GetBlogwithID(id);
        // /blogs/:id
        navigate(`/blogs/${id}`)
    }



    //?<----------themeing part--------------->

    const darkTheme = extendTheme({

        focus: {
            default: {
                outlineWidth: '3px',
            },
        },
        fontFamily: {
            body: 'Ubuntu, sans-serif'
        },
        components: {
            JoyCard: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        '&:focus': theme.focus.default,
                        fontWeight: 600,
                        backgroundColor: 'black',
                        color: 'white',
                        ...(ownerState.size === 'md' && {
                            borderRadius: '0.645rem',
                            paddingInline: '1rem',
                        }),
                    }),
                },
            },
            JoyTypography: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        color: 'white',
                    }),
                },
            },
            JoyButton: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        color: 'black',
                        backgroundColor: "white"
                    }),
                },
            },
            JoyIconButton: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        color: 'white',
                    }),
                },
            },
        },
    });


    const lightTheme = extendTheme({

        focus: {
            default: {
                outlineWidth: '3px',
            },
        },
        fontFamily: {
            body: 'Ubuntu, sans-serif'
        },
        components: {
            JoyCard: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        '&:focus': theme.focus.default,
                        fontWeight: 600,
                        backgroundColor: 'white',
                        ...(ownerState.size === 'md' && {
                            borderRadius: '0.645rem',
                            paddingInline: '1rem',
                        }),
                    }),
                },
            },
            JoyTypography: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        color: 'black',
                    }),
                },
            },
            JoyButton: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        color: 'white',
                        backgroundColor: "black"
                    }),
                },
            },
            JoyIconButton: {
                styleOverrides: {
                    root: ({ theme, ownerState }) => ({
                        color: 'black',
                    }),
                },
            },
        },
    });


    return (
        <CssVarsProvider theme={maintheme ? lightTheme : darkTheme}>
            <Card variant="outlined" sx={{ width: 340 }}>
                <Typography level="h2" fontSize="md"  >
                    {title}
                </Typography>

                <Typography level="body2">{tag}</Typography>
                <IconButton
                    aria-label="bookmark Bahamas Islands"
                    variant="plain"
                    color="neutral"
                    size="sm"
                    sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                >
                    <BookmarkAdd />
                </IconButton>
                <AspectRatio minHeight="120px" maxHeight="200px" sx={{ my: 2 }}>

                    <img
                        src={`https://drive.google.com/uc?export=view&id=${thumbnailurl}`}
                        // srcSet={`https://source.unsplash.com/500x300/?web-development`}
                        loading="lazy"
                        alt=""
                    />

                </AspectRatio>
                <Box sx={{ display: 'flex' }}>
                    <div>
                        <Typography level="body3" fontSize="sm" sx={{ fontWeight: 'bold' }}>Description:</Typography>
                        <Typography fontSize="sm" fontWeight="sm" >
                            {description}
                        </Typography>
                    </div>

                    <Button
                        variant="solid"
                        // size="md"
                        color="primary"
                        aria-label="Explore Bahamas Islands"
                        sx={{ ml: 'auto', fontWeight: 600 }}
                        onClick={() => handlereadmore(blogid)}
                    >
                        Read More
                    </Button>
                </Box>
            </Card>
        </CssVarsProvider >
    );
}