import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { GoogleLogin } from '@react-oauth/google';
import { useHistory } from 'react-router-dom';
import { signin,signup } from '../../actions/auth';
import { useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";

import Input from './Input';
import useStyles from './styles';

const initialState = {firstName:'',lastName:'', email:'', password:'', confirmPassword:''};

const Auth = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [showPassword,setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData,setFormData] = useState(initialState);
    
    const history = useHistory();
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);


    const handleSubmit = (e) => {
      e.preventDefault();
    try{
      if(isSignup){
        dispatch(signup(formData,history));
      } else {
        dispatch(signin(formData,history));
      }
    }catch (error){
      console.log(error);
    }

    };
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]:e.target.value });

    };
    const switchMode = () => {
      setIsSignup((prevIsSignup) => !prevIsSignup);
      setShowPassword(false);
    };

    const googleOnSuccess = async (res) => {
      const token = res?.credential;
      const result = jwt_decode(token);
      try {
        dispatch({type: 'AUTH', data : { result, token}});
        history.push('/');
      } catch (error) {
        console.log(error);
      }
    };
    



  return (
    <Container component='main' maxwidth='xs'>
      <Paper className={classes.paper} elevation = {3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignup &&(
                <>
                <Input name='firstName' label = 'First Name' handleChange = {handleChange} autoFocus half />
                <Input name='lastName' label = 'Last Name' handleChange = {handleChange} half />
                </>
              )}
                <Input name='email' label = 'Email Adress' handleChange = {handleChange} type = "email"/>
                <Input name='password' label = 'Password' handleChange = {handleChange} type = {showPassword ? 'text' : 'password'} handleShowPassword = {handleShowPassword}/>
                
                { isSignup && <Input name='confirmPassword' label = 'Repeat Password' handleChange = {handleChange} type = 'password' />}

          </Grid>
                <GoogleLogin 
                  onSuccess= {googleOnSuccess}
                  onError={() => console.log('Error')}
                  />
          <Button type = 'submit' fullWidth variant='contained' color = 'primary' className={classes.submit} >
            {isSignup ? 'Sign UP' : 'Sign In'}
          </Button>
          <Grid container justifyContent='flex-end'>
                <Grid item>
                  <Button onClick={switchMode}>
                    {isSignup ? 'Already have an account? Log in':"Don't have an account? Sign Up"}
                  </Button>
                </Grid>
          </Grid>

        </form>
      </Paper>
    </Container>
  )
}

export default Auth;