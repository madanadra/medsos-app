import { InputBase, Typography, CardActionArea, Avatar, CardHeader } from "@mui/material";
import { Appbar } from "./App";
import { useState} from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from "./function";

const SearchPage = ({cookies}) => {
    const href = useNavigate()
    const [result, setResult] = useState([])
    useDocumentTitle('Cari | Medsos')

    const loadSearch = (evt) => {
        axios.post('http://inmu-medsos-api.dgrande.com/api/search',
        {search: evt}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            setResult(response.data.search);
            console.log(response);
        })
        .catch((error) => {
            setResult(null);
            console.log(error);
        });
      }

    const Content = () => {
        return (<>
            {result?.map(result =>
            <CardActionArea elevation={0} sx={{ borderRadius: 0 }} onClick={() => href(`/profil/${result.id}`)}>
                <CardHeader
                avatar={<Avatar src={`http://inmu-medsos-api.dgrande.com/images/${result.image ? result.image : 'user.png'}`} />}
                title={<Typography sx={{ fontWeight: '600', fontSize: '15px' }}>{result.name}</Typography>}
                sx={{ p: '10px 15px' }}
                />
            </CardActionArea>)}
        </>);
    }
    return (<>
        <Appbar title={<InputBase onChange={(e) => loadSearch(e.target.value)} type="search" placeholder="Cari" autoComplete="off" autoFocus
                sx={{ p: '0 5px 0 11px', mr: '5px', flexGrow: 1, backgroundColor: '#e0e0e0', borderRadius: '3px' }} />
        } />
        <Content />
    </>);
}

export default SearchPage;
