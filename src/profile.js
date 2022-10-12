import { Avatar, Typography, Box, IconButton, Card, CardHeader, CardContent, CardActions, Button, Dialog, DialogActions, 
    DialogTitle, TextField, Badge, Menu, CardActionArea } from "@mui/material";
import { Favorite, FavoriteBorderOutlined, CameraAlt, MoreHoriz } from "@mui/icons-material";
import { Appbar } from "./App";
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/id';
import useDocumentTitle from "./function";

const ProfilePage = ({cookies, removeCookie}) => {
    const {id} = useParams()
    const [load, setLoad] = useState(false)
    const [error, setError] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogContent, setDialogContent] = useState()
    const [data, setData] = useState()
    const [follows, setFollows] = useState()
    const [menu, setMenu] = useState(null)
    const [likes, setLikes] = useState()
    const name = useRef()
    const description = useRef()
    useDocumentTitle(`${data?.profile?.name ? data.profile.name : 'Profil'} | Medsos`)

    const loadProfile = () => {
        axios.get(`http://inmu-medsos-api.dgrande.com/api/profile/${id}`, {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            setData(response.data);
            setLoad(false);
            console.log(response);
        })
        .catch((error) => {
            setLoad(false);
            console.log(error);
        });
    }

    const handleUpdateImage = (event) => {
        const img = new FormData();
        img.append('image', event.target.files[0]);
        axios.post(`http://inmu-medsos-api.dgrande.com/api/update-image`, 
        img, {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            loadProfile();
        })
        .catch((error) => {
            setError(true);
            console.log(error);
        });
    }

    const handleUpdateProfile = () => {
        if (name.current.value) {
            setDialogOpen(false);
            axios.patch(`http://inmu-medsos-api.dgrande.com/api/update-profile`, 
            {name: name.current.value, description: description.current.value}, 
            {headers: { Authorization: 'Bearer '+ cookies.user }})
            .then((response) => {
                loadProfile();
                console.log(response.data.message);
            })
            .catch((error) => {
                console.log(error);
            });
        }
        console.log('Nama tidak boleh kosong')
    }

    const handleLogout = () => {
        axios.get('http://inmu-medsos-api.dgrande.com/api/logout', {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            removeCookie('user', { path: '/' });
            setDialogOpen(false);
        })
        .catch((error) => {
            console.log(error);
            setDialogOpen(false);
        });
    }

    const checkFollow = () => {
        axios.post('http://inmu-medsos-api.dgrande.com/api/check-follow', 
        {target: id}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            setFollows(response.data);
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const follow = () => {
        axios.post('http://inmu-medsos-api.dgrande.com/api/follow', 
        {target: id}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            checkFollow()
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const unfollow = () => {
        setDialogOpen(false);
        axios.post('http://inmu-medsos-api.dgrande.com/api/unfollow',
        {target: id}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            checkFollow()
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const checkLike = () => {
        axios.get(`http://inmu-medsos-api.dgrande.com/api/check-like`, {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            setLikes(response.data.check);
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const like = async (like_id) => {
        axios.post('http://inmu-medsos-api.dgrande.com/api/like',
        {target: like_id}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            loadProfile();
            checkLike()
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const unlike = async (like_id) => {
        axios.post('http://inmu-medsos-api.dgrande.com/api/unlike',
        {target: like_id}, 
        {headers: { Authorization: 'Bearer '+ cookies.user }})
        .then((response) => {
            loadProfile();
            checkLike()
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        setLoad(true);
        loadProfile();
        checkFollow();
        checkLike();

        return () => {
            setData();
            setFollows();
            setLikes();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setTimeout(()=>{
         setError(false)
        }, 3000)
    }, [error])

    const Check = () => {
        if (follows) {
            return (<>
                {follows.check ? 
                <Button variant="outlined" elevation={0} size="small" disableElevation onClick={() => {setDialogOpen(true); setDialogContent(<Mengikuti />)}} 
                sx={{ ml: 'auto', p: '2px 7px', textTransform: 'none', color: '#333', border: '1px solid #e0e0e0', 
                '&:hover': {color: '#333', border: '1px solid #e0e0e0'} }}>Mengikuti</Button> : 
                <Button variant="contained" elevation={0} size="small" disableElevation sx={{ ml: 'auto', p: '2px 7px', textTransform: 'none' }} 
                onClick={() => follow()}>Ikuti</Button>}
            </>);
        }
        return (<></>);
    }

    const Story = () => {
        return (<>
            {data?.profile?.story?.map(story =>
            <Card elevation={0} sx={{ mb: '15px', borderRadius: 0 }} key={story.id}>
                <CardHeader
                avatar={<Avatar src={`http://inmu-medsos-api.dgrande.com/images/${data.profile.image ? data.profile.image : 'user.png'}`} />}
                title={<Typography sx={{ mt: '3px', fontWeight: '600', fontSize: '15px' }}>{data.profile.name}</Typography>}
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

    const Mengikuti = () => {
        return (<>
            <DialogTitle>
                <Typography sx={{ fontWeight: '600', fontSize: '19px' }}>Berhenti mengikuti {data?.profile?.name}?</Typography>
            </DialogTitle>
            <DialogActions sx={{ m: '0 7px 3px 0' }}>
                <Button sx={{ color: '#8e8e8e' }}>Batal</Button>
                <Button sx={{ color: '#333' }} onClick={() => unfollow()}>Berhenti mengikuti</Button>
            </DialogActions>
        </>);
    }

    const UbahProfil = () => {
        return (<>
            <TextField inputRef={name} label="Nama" defaultValue={data?.profile?.name} variant="outlined" size="small" autoComplete="off" 
            inputProps={{ maxLength: 25 }} sx={{ m: '27px 30px 0 30px' }} />
            <TextField inputRef={description} label="Deskripsi" defaultValue={data?.profile?.description} variant="outlined" size="small" autoComplete="off"
            multiline minRows={3} inputProps={{ maxLength: 100 }} sx={{ m: '27px 30px 0 30px' }} />
            <DialogActions sx={{ m: '10px 7px 5px 0' }}>
                <Button elevation={0} size="small" disableElevation sx={{ p: '2px 7px', color: '#8e8e8e' }} 
                onClick={() => setDialogOpen(false)}>Batal</Button>
                <Button elevation={0} size="small" disableElevation sx={{ p: '2px 7px', color: '#333' }}
                onClick={() => handleUpdateProfile()}>Ubah</Button>
            </DialogActions>
        </>);
    }

    const Keluar = () => {
        return (<>
            <DialogTitle>
                <Typography sx={{ fontWeight: '600', fontSize: '19px' }}>Keluar dari Medsos?</Typography>
            </DialogTitle>
            <DialogActions sx={{ m: '0 7px 5px 0' }}>
                <Button elevation={0} size="small" disableElevation sx={{ p: '2px 7px', color: '#8e8e8e' }} 
                onClick={() => setDialogOpen(false)}>Batal</Button>
                <Button elevation={0} size="small" disableElevation sx={{ p: '2px 7px', color: '#333' }} 
                onClick={() => handleLogout()}>Keluar</Button>
            </DialogActions>
        </>);
    }

    const Content = () => {
        return (
            <Box sx={{ mb: '20px', textAlign: 'center' }}>
                <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={data?.user === Number(id) ? 
                <IconButton size="small" sx={{ backgroundColor: '#e0e0e0', '&:hover': {backgroundColor: '#e0e0e0'} }} 
                onClick={() => document.getElementById('file').click()}>
                    <CameraAlt sx={{ fontSize: '19px', color: '#8e8e8e' }} />
                </IconButton> : []}>
                    <Avatar sx={{ width: 119, height: 119 }} src={`http://inmu-medsos-api.dgrande.com/images/${data?.profile?.image ? data.profile.image : 'user.png'}`} />
                </Badge>
                <Typography sx={{ mt: '15px', fontWeight: '600', fontSize: '19px' }}>{data?.profile?.name}</Typography>
                <TextField id="file" type="file" sx={{ display: 'none' }} onChange={handleUpdateImage} />
                <Box sx={{ mt: '5px', display: 'flex', justifyContent: 'center' }}>
                    <Typography sx={{ mr: '5px', fontWeight: '400', fontSize: '15px' }}>{data?.profile?.story?.length} Cerita</Typography>
                    &bull;
                    <Typography sx={{ mx: '5px', fontWeight: '400', fontSize: '15px' }}>{follows?.follower} Pengikut</Typography>
                    &bull;
                    <Typography sx={{ ml: '5px', fontWeight: '400', fontSize: '15px' }}>{follows?.following} Mengikuti</Typography>
                </Box>
                <Typography sx={{ mt: '5px', fontWeight: '400', fontSize: '15px', whiteSpace: 'pre-line' }}>{data?.profile?.description}</Typography>
                <Typography sx={{ mt: '15px', color: '#8e8e8e', fontWeight: '400', fontSize: '15px' }}>Bergabung pada {moment(data?.profile?.created_at).fromNow()}</Typography>
            </Box>
        );
    }

    return (<>
        {load ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}><img src={require('./i.svg').default} alt="Logo" width="30px" /></Box> : <>
        <Appbar title={
            <>
                <Typography sx={{ mr: '5px', fontWeight: '600', fontSize: '22px', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data?.profile?.name}</Typography>
                {data?.user === Number(id) ? <>
                <IconButton size="small" sx={{ color: '#333', ml: 'auto' }} onClick={(e) => setMenu(e.currentTarget)}>
                    <MoreHoriz sx={{ fontSize: '27px' }} />
                </IconButton>
                <Menu anchorEl={menu} open={menu !== null} onClose={() => setMenu(null)}>
                    <CardActionArea sx={{ p: '5px 20px' }}
                    onClick={() => {setMenu(null); setDialogOpen(true); setDialogContent(<UbahProfil />)}}>
                        <Typography sx={{ fontWeight: '600', fontSize: '15px' }}>Ubah profil</Typography>
                    </CardActionArea>
                    <CardActionArea sx={{ p: '5px 20px' }} 
                    onClick={() => {setMenu(null); setDialogOpen(true); setDialogContent(<Keluar />)}}>
                        <Typography sx={{ fontWeight: '600', fontSize: '15px' }}>Keluar</Typography>
                    </CardActionArea>
                </Menu></> : <Check />}
            </>} 
        />
        <Box sx={{ p: '10px 15px' }}>
            <Content />
            <Story />
        </Box>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
            {dialogContent}
        </Dialog>
        <Typography onClick={() => setError(false)} sx={{ p: '7px 15px', textAlign: 'center', fontWeight: '600', fontSize: '15px', backgroundColor: '#fdeded', 
        color: '#5f2120', position: 'fixed', bottom: 0, left: 0, right: 0, ...(!error && {display: 'none'}) }}>Gagal memperbarui foto profil</Typography></>}
    </>);
}

export default ProfilePage;
