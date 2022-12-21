import './App.css';
import CardBox from './components/LandingPage/CardBox';
import Navbar from './components/Navbar';
import {
  BrowserRouter as BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Article from './components/BlogPage/Article';
import Footer from './components/Footer';
import TextEditor from './components/Addblog/TextEditor'
import { v4 as uuidV4 } from 'uuid'
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';

import UserState from './components/context/Users/UserState';
import DocumentState from './components/context/documents/DocumentState';
import ImageUpload from './components/ImageUpload';
import CardIdea2 from './components/LandingPage/CardMain';
import UserblogCards from './components/UserBlogs/UserblogCards';
import BlogwithID from './components/UserBlogs/BlogwithID';
import UserDrafts from './components/UserBlogs/UserDrafts';


// themeing part from mui
import { Theme, ThemeProvider, createTheme, colors } from '@mui/material';
import GAuth from './components/Utility_Components/Google/GAuth';

function App() {

  const font = "'Ubuntu', sans-serif";

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#000000'
      }
    },
    typography: {
      fontFamily: font,
    }
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <UserState>
          <DocumentState>
            <BrowserRouter>

              {/* <Navbar /> */}
              <Routes>
                <Route exact path='/' element={<CardBox />}></Route>
                <Route exact path='/article' element={<Article />}></Route>
                <Route exact path='/login' element={<Login />}></Route>
                <Route exact path='/signup' element={<Signup />}></Route>


                {/* <Route exact path='/addblog' element={<TextEditor />}></Route> */}

                <Route exact path="/addblog" element={<Navigate replace to={`documents/${uuidV4()}`} />} />
                <Route exact path="/addblog/documents/:id" element={<TextEditor />} />

                <Route exact path="/blogs/:id" element={<BlogwithID />} />

                <Route exact path="/myblogscards" element={<UserblogCards />} />

                {/* for serving the drafts of the users */}
                <Route exact path="/mydrafts" element={<UserDrafts />} />


                <Route exact path="/uploadimg" element={<ImageUpload />} />

                <Route exact path="/card2" element={<CardIdea2 />} />


                <Route exact path="/gauth" element={<GAuth />} />


              </Routes>

              <Footer />

            </BrowserRouter>
          </DocumentState>
        </UserState>

      </ThemeProvider>
    </>
  );
}

export default App;
