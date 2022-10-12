import { TextField, Paper, Button, LinearProgress, Typography } from "@mui/material";
import { Appbar } from "./App";
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from "./function";

const AddStoryPage = ({cookies}) => {
    const [text, setText] = useState('')
    const [load, setLoad] = useState(false)
    const href = useNavigate()
    useDocumentTitle('Buat cerita | Medsos')

    const handleStory = () => {
        setLoad(true);
        axios.post('http://inmu-medsos-api.dgrande.com/api/create-story', 
        {text: text}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
          href('/');
          setLoad(false);
        })
        .catch((error) => {
          console.log(error);
          setLoad(false);
        });
      }

    return (<>
        <Appbar title={<Typography sx={{ flexGrow: 1, fontWeight: '600', fontSize: '22px', color: '#333' }}>Buat cerita</Typography>} />
        <Paper elevation={0} sx={{ p: '10px 15px' }}>
            <TextField onChange={(e) => setText(e.target.value)} placeholder="Apa cerita hari ini?" variant="standard" fullWidth multiline minRows={5}
            inputProps={{ style: {fontSize: '19px'}, maxLength: 200 }} InputProps={{ disableUnderline: true }} autoFocus />
            <LinearProgress variant="determinate" value={text.length/2} sx={{ height: '1px', backgroundColor: 'silver' }} />
            <Button variant="contained" elevation={0} size="medium" disableElevation onClick={() => handleStory()} 
            sx={{ mt: '15px', textTransform: 'none', float: 'right' }} disabled={load || !text}>{load ? 'Mengunggah...' : 'Unggah'}</Button>
        </Paper>
    </>);
}

export default AddStoryPage;
