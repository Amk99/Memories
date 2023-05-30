import React,{ useState,useEffect } from "react";
import useStyles from './styles';
import FileBase from 'react-file-base64';
import { useDispatch,useSelector } from 'react-redux';
import { createPost,updatePost } from '../../actions/posts';

import { TextField,Button,Typography,Paper } from "@material-ui/core";

const Form = ({currentId,setCurrentId}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
    const [postData ,setPostData] = useState({title: '',tags: '',message: '',selectedFile: ''});
    const user = JSON.parse(localStorage.getItem('profile'));
    useEffect(() => {
        if(post) setPostData(post);

    },[post]);



    const handleSubmit = async (e) => {
        e.preventDefault()

        if(currentId === 0){
            dispatch(updatePost(currentId, {...postData, name: user?.result?.name }));
            clear();        
        }else{
            dispatch(createPost({ ...postData,name:user?.result?.name }));
            clear();
        }

    };

    const clear = () => {
        setCurrentId(null)
        setPostData({title: '',tags: '',message: '',selectedFile: ''})

    }

    if (!user?.result?.name) {
        return (
          <Paper className={classes.paper} elevation={6}>
            <Typography variant="h6" align="center">
              Please Sign In to create your own memories and like other's memories.
            </Typography>
          </Paper>
        );
      }
      
    return (
        <Paper className={classes.paper}> 
            <form autoComplete = 'off' noValidate className = {`${classes.root} ${classes.form}`} onSubmit = {handleSubmit}>
                <Typography variant="h6">{currentId ? `Editing`:'Creating'} a Memory</Typography>
                <TextField  name="title" label='Title' variant="outlined" fullWidth value={postData.title}onChange={(e) => setPostData({...postData, title: e.target.value })}/>
                <TextField  name="message" label='Message' variant="outlined" fullWidth value={postData.message}onChange={(e) => setPostData({...postData, message: e.target.value })}/>
                <TextField  name="tags" label='Tags' variant="outlined" fullWidth value={postData.tags}onChange={(e) => setPostData({...postData, tags: e.target.value.split(',') })}/>

                <div className={classes.fileInput}>
                    <FileBase type = 'file' 
                    multiple = {false}
                    onDone = {({base64}) => setPostData({ ...postData,selectedFile: base64 })}/>
                </div>

                <Button className={classes.buttonSubmit} variant = 'contained' color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button  variant = 'contained' color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            
            </form>
        </Paper>
    );
}

export default Form;