import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Fixed path
import GoogleIcon from '@mui/icons-material/Google';
import axiosInstance from '../utils/axiosConfig';  // Fixed path

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });
      
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        await login(response.data.user);
        navigate(response.data.user.role === 'ADMIN' ? '/admin' : '/');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.status === 400) {
        setError('Invalid email or password');
      } else if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Login failed. Please try again later.');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorize/google';
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          pt: 5 ,
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{  padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mt: 1 }}
          >
            Sign in with Google
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button
                color="primary"
                onClick={() => navigate('/register')}
                sx={{ textTransform: 'none' }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;