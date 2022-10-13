import { Box, Typography, Avatar, Card, CardHeader, CardContent, IconButton,
    CardActions } from "@mui/material";
import { Favorite, FavoriteBorderOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Appbar } from "./App";
import moment from 'moment';
import 'moment/locale/id';
import useDocumentTitle from "./function";

const HomePage = ({cookies}) => {
    const href = useNavigate()
    const [home, setHome] = useState()
    const [likes, setLikes] = useState()
    useDocumentTitle('Home | Medsos')

    const loadHome = () => {
        axios.get(`https://inmu-medsos-api.dgrande.com/api/home`, {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            setHome(response.data);
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
      }

      const checkLike = () => {
        axios.get(`https://inmu-medsos-api.dgrande.com/api/check-like`, {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            setLikes(response.data.check);
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const like = async (like_id) => {
        axios.post('https://inmu-medsos-api.dgrande.com/api/like',
        {target: like_id}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            loadHome();
            checkLike()
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const unlike = async (like_id) => {
        axios.post('https://inmu-medsos-api.dgrande.com/api/unlike',
        {target: like_id}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            loadHome();
            checkLike()
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        loadHome();
        checkLike();

        return () => {
            setHome();
            setLikes();
        };
      }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const Story = () => {
        return (<>
            {home?.story?.map(story =>
            <Card elevation={0} sx={{ mb: '15px', borderRadius: 0 }} key={story.id}>
                <CardHeader
                avatar={<Avatar sx={{ mt: '-2px' }} src={`http://inmu-medsos-api.dgrande.com/images/${story.user.image ? story.user.image : 'user.png'}`} />}
                title={<Typography sx={{ fontWeight: '600', fontSize: '15px' }} onClick={() => href(`/profil/${story.user_id}`)}>{story.user.name}</Typography>}
                subheader={<Typography sx={{ color: '#8e8e8e', fontWeight: '400', fontSize: '13px' }}>{moment(story.created_at).fromNow()}</Typography>}
                sx={{ p: 0 }}
                />
                <CardContent sx={{ p: '5px 0 7px 0' }}>
                    <Typography sx={{ fontSize: '19px' }}>
                        {story.text}
                    </Typography>
                </CardContent>
                <CardActions sx={{ p: 0 }}>
                    {likes?.includes(story.id) ? <Favorite color="error" sx={{ mr: '5px' }} onClick={() => unlike(story.id)} /> : 
                    <FavoriteBorderOutlined sx={{ mr: '5px', color: '#333' }} onClick={() => like(story.id)} />}
                    <Typography sx={{ fontWeight: '600', fontSize: '13px' }}>{story.like}</Typography>
                </CardActions>
            </Card>)}
        </>);
    }

    return (<>
        <Appbar user={
            <IconButton size="small" sx={{ color: '#333', ...(!home?.user && {visibility: 'hidden'}) }} onClick={() => href(`/profil/${home.user}`)}>
                <Avatar src={`http://inmu-medsos-api.dgrande.com/images/${home?.image ? home.image : 'user.png'}`} sx={{ width: 25, height: 25 }} />
            </IconButton>} 
        />
        <Box sx={{ p: '10px 15px' }}>
        {home?.story.length === 0 ? <Typography sx={{ mt: '10px', textAlign: 'center', color: '#8e8e8e', fontWeight: '400', fontSize: '17px' }}>
        Cerita kamu dan orang yang kamu ikuti akan muncul disini</Typography> : <Story />}
        </Box>
    </>);
}

export default HomePage;
