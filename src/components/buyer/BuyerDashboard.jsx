import React from 'react';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';
import Cart from './Cart';

const BuyerDashboard = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    
                </Typography>
                <Grid container spacing={3}>
                    
                    <Grid item xs={12} md={6}>
                        <Cart />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default BuyerDashboard;