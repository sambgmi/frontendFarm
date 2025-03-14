import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Container, 
    Typography, 
    Paper, 
    Alert,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'FARMER'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/auth/register', formData);
            setSuccess('Registration successful!');
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Registration failed. Please try again.');
            setSuccess('');
        }
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
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Register
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                            <FormLabel component="legend">Register as</FormLabel>
                            <RadioGroup
                                row
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <FormControlLabel 
                                    value="FARMER" 
                                    control={<Radio />} 
                                    label="Farmer" 
                                />
                                <FormControlLabel 
                                    value="BUYER" 
                                    control={<Radio />} 
                                    label="Buyer" 
                                />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Sign in
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;