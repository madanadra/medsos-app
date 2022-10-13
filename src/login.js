import { Box, Typography, Button, TextField, InputAdornment } from "@mui/material";
import {Visibility,  VisibilityOff } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import useDocumentTitle from "./function";

const LoginPage = ({setCookie}) => {
    const href = useNavigate()
    const [error, setError] = useState(false)
    const [load, setLoad] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [eye, setEye] = useState(false)
    useDocumentTitle('Masuk | Medsos')

    const handleLogin = () => {
        setLoad(true);
        axios.post('https://inmu-medsos-api.dgrande.com/api/login', {email: email, password: password})
        .then((response) => {
            setCookie('user', response.data.access_token, { path: '/', expires: new Date(Date.now()+2592000) });
            console.log(response);
            setLoad(false);
        })
        .catch((error) => {
            console.log(error);
            setError(true);
            setLoad(false);
        });
    }

    useEffect(() => {
        setTimeout(()=>{
            setError(false)
            return () => {setError(false)};
        }, 3000)
    }, [error])

    return (
        <Box sx={{ px: '30px', display: 'grid', textAlign: 'center', mx: 'auto', maxWidth: '390px' }}>
            <Typography sx={{ mt: '50px', fontFamily: 'Pacifico, cursive', fontSize: '35px' }}>Medsos</Typography>
            <TextField type="email" label="Email" value={email} size="small" autoComplete="off" sx={{ mt: '35px' }} onChange={(e) => setEmail(e.target.value)} />
            <TextField type={eye ? 'text' : 'password'} label="Kata Sandi" value={password} size="small" autoComplete="off" sx={{ mt: '15px' }} onChange={(e) => setPassword(e.target.value)}
            InputProps={{
                endAdornment: <InputAdornment position="end">{eye ? 
                <VisibilityOff sx={{ cursor: 'pointer' }} onClick={() => setEye(false)} /> : 
                <Visibility sx={{ cursor: 'pointer' }} onClick={() => setEye(true)} />}</InputAdornment>
            }} />
            <Button variant="contained" sx={{ mt: '30px', textTransform: 'none' }} onClick={() => handleLogin()} disabled={!email || !password || load}>{load ? 'Memasuki...' : 'Masuk'}</Button>
            <Box sx={{ mt: '35px', display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px' }}>Belum punya akun?</Typography>
                <Typography color="primary" sx={{ ml: '3px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }} onClick={() => href('/daftar')}>Daftar</Typography>
            </Box>
            <Typography onClick={() => setError(false)} sx={{ p: '7px 15px', textAlign: 'center', fontWeight: '600', fontSize: '15px', backgroundColor: '#fdeded', 
            color: '#5f2120', position: 'fixed', bottom: 0, left: 0, right: 0, ...(!error && {display: 'none'}) }}>Upaya masuk gagal</Typography>
        </Box>
    );
}

export default LoginPage;