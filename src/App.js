import { AppBar, IconButton, Toolbar, ThemeProvider, createTheme, Typography, Container } from "@mui/material";
import { ArrowBack, Search, AddBoxOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";
import LoginPage from "./login";
import RegisterPage from "./register";
import HomePage from './home';
import ProfilePage from "./profile";
import AddStoryPage from "./add-story";
import SearchPage from "./search";

export const Appbar = (props) => {
  const path = useLocation()
  const href = useNavigate()

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#fff' }}>
      <Toolbar sx={{ p: '0 10px 0 0' }} variant='dense'>
        {path.pathname === '/' ? <>
          <Typography sx={{ ml: '15px', flexGrow: 1, fontFamily: 'Pacifico, cursive', fontWeight: '600', fontSize: '22px', color: '#333' }}>
            Medsos
          </Typography>
          <IconButton size="small" sx={{ color: '#333' }} onClick={() => href('/buat-cerita')}>
            <AddBoxOutlined sx={{ fontSize: '27px' }} />
          </IconButton>
          <IconButton size="small" sx={{ mx: '10px', color: '#333' }} onClick={() => href('/cari')}>
            <Search sx={{ fontSize: '27px' }} />
          </IconButton>
          {props.user}</> : <>
          <IconButton size="small" sx={{ mx: '10px', color: '#333' }} onClick={() => href('/')}>
            <ArrowBack sx={{ width: 27, height: 27 }} />
          </IconButton>
          {props.title}
        </>}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])

  const theme = createTheme({
    typography: {
      fontFamily: 'Source Sans Pro, sans-serif'
    },
  })

  useEffect(() => {
    if (cookies.user) {
      axios.get('https://inmu-medsos-api.dgrande.com/api/user', {headers: { Authorization: 'Bearer '+ cookies.user }})
      .then((response) => {
        console.log('Berhasil masuk');
      })
      .catch((error) => {
        removeCookie('user', { path: '/' });
      });

    return () => {};
    }
  }, [cookies.user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Container maxWidth="md" disableGutters sx={{ p: 0, minHeight: '100vh' }}>
          <Routes>
            <Route path="/masuk" element={cookies.user ? <Navigate to={'/'} /> : <LoginPage setCookie={setCookie} />} />
            <Route path="/daftar" element={cookies.user ? <Navigate to={'/'} /> : <RegisterPage setCookie={setCookie} />} />
            <Route exact path="/" element={cookies.user ? <HomePage cookies={cookies} /> : <Navigate to={'/masuk'} />} />
            <Route path="/profil/:id" element={cookies.user ? <ProfilePage cookies={cookies} removeCookie={removeCookie} /> : <Navigate to={'/masuk'} />} />
            <Route path="/buat-cerita" element={cookies.user ? <AddStoryPage cookies={cookies} /> : <Navigate to={'/masuk'} />} />
            <Route path="/cari" element={cookies.user ? <SearchPage cookies={cookies} /> : <Navigate to={'/masuk'} />} />
          </Routes>
        </Container>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
