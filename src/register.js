import { Box, Typography, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import useDocumentTitle from "./function";

const RegisterPage = ({setCookie}) => {
    const href = useNavigate()
    const [error, setError] = useState(false)
    const [load, setLoad] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cpass, setCpass] = useState('')
    useDocumentTitle('Daftar | Medsos')

    const handleRegister = () => {
        if (password === cpass) {
            setLoad(true);
            axios.post('http://inmu-medsos-api.dgrande.com/api/register', {name: name, email: email, password: password})
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
        } else {
            setError(true);
        }
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
            <TextField label="Nama Pengguna" size="small" autoComplete="off" 
            sx={{ mt: '35px' }} inputProps={{ maxLength: 25 }} onChange={(e) => setName(e.target.value)} />
            <TextField label="Email" size="small" autoComplete="off" 
            sx={{ mt: '15px' }} onChange={(e) => setEmail(e.target.value)} />
            <TextField type="password" label="Kata Sandi" size="small" autoComplete="off" 
            sx={{ mt: '15px' }} onChange={(e) => setPassword(e.target.value)} />
            <TextField type="password" label="Ulangi Kata Sandi" size="small" autoComplete="off" sx={{ mt: '15px' }} onChange={(e) => setCpass(e.target.value)} />
            <Button variant="contained" sx={{ mt: '30px', textTransform: 'none' }}  
            onClick={() => handleRegister()} disabled={!name || !email || !password || !cpass || load}>{load ? 'Mendaftar...' : 'Daftar'}</Button>
            <Box sx={{ mt: '35px', display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px' }}>Sudah punya akun?</Typography>
                <Typography color="primary" sx={{ ml: '3px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }} onClick={() => href('/masuk')}>Masuk</Typography>
            </Box>
            <Typography onClick={() => setError(false)} sx={{ p: '7px 15px', textAlign: 'center', fontWeight: '600', fontSize: '15px', backgroundColor: '#fdeded', 
            color: '#5f2120', position: 'fixed', bottom: 0, left: 0, right: 0, ...(!error && {display: 'none'}) }}>Gagal mendaftarkan akun</Typography>
        </Box>
    );
}

export default RegisterPage;