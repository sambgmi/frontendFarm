import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Card, CardContent, CardMedia,
    Button, IconButton, Box, Grid, Divider, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            // Enhanced debugging logs
            console.log('Cart Response:', response);
            console.log('Cart Items:', response.data);
            console.log('Product IDs:', response.data.map(item => ({
                cartId: item.id,
                productId: item.farmerProduct.product.productId,
                productName: item.farmerProduct.product.name
            })));
            setCartItems(response.data);
            setError(null);
        } catch (err) {
            console.error('Cart Error Details:', err.response?.data);
            setError('Failed to fetch cart items');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`http://localhost:8081/api/cart/update/${cartId}`, null, {
                params: { quantity: newQuantity },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchCartItems();
        } catch (err) {
            setError('Failed to update quantity');
            console.error(err);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8081/api/cart/remove/${cartId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchCartItems();
        } catch (err) {
            setError('Failed to remove item from cart');
            console.error(err);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => 
            total + (item.farmerProduct.bargainPrice * item.quantity), 0
        );
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ 
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
            pt: { xs: 12, sm: 14 }, // Increased top padding
            pb: 4,
            position: 'absolute', // Added
            top: 0,              // Added
            left: 0,            // Added
            right: 0,           // Added
        }}>
            <Container maxWidth="xl" sx={{ 
                height: '100%',
                maxWidth: '1600px !important', // Increased max width
                mx: 'auto',
                px: { xs: 2, sm: 4 } // Added horizontal padding
            }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 600,
                    mb: 4,
                    color: '#2B3445',
                    pl: 2
                }}>
                    Shopping Cart
                </Typography>
                
                {cartItems.length === 0 ? (
                    <Paper sx={{ 
                        p: 6, 
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa'
                    }}>
                        <Typography variant="h6" sx={{ color: '#2B3445', mb: 2 }}>Your cart is empty</Typography>
                        <Button 
                            variant="contained" 
                            href="/"
                            sx={{
                                bgcolor: '#00a152',
                                '&:hover': { bgcolor: '#008f49' }
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>
                                {cartItems.map((item) => (
                                    <Card key={item.id} sx={{ 
                                        mb: 2,
                                        borderRadius: 2,
                                        border: '1px solid #eee',
                                        boxShadow: 'none'
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            p: 2,
                                            gap: 3,
                                            flexDirection: { xs: 'column', sm: 'row' }
                                        }}>
                                            <Box sx={{
                                                width: { xs: '100%', sm: 150 },
                                                height: { xs: 200, sm: 150 }
                                            }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ 
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: 1
                                                    }}
                                                    image={item.farmerProduct.product.imageUrl || 'https://via.placeholder.com/150'}
                                                    alt={item.farmerProduct.product.name}
                                                />
                                            </Box>
                                            
                                            <Box sx={{ 
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                                        {item.farmerProduct.product.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        Farmer: {item.farmerProduct.farmer.name}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ 
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 2,
                                                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                                    gap: 2
                                                }}>
                                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                                                        ₹{item.farmerProduct.bargainPrice}
                                                    </Typography>
                                                    
                                                    <Box sx={{ 
                                                        display: 'flex',
                                                        gap: 2,
                                                        alignItems: 'center'
                                                    }}>
                                                        <Box sx={{ 
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            border: '1px solid #ddd',
                                                            borderRadius: 1,
                                                            px: 1
                                                        }}>
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <RemoveIcon fontSize="small" />
                                                            </IconButton>
                                                            <Typography sx={{ mx: 2 }}>
                                                                {item.quantity}
                                                            </Typography>
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                        
                                                        <Button 
                                                            onClick={() => removeFromCart(item.id)}
                                                            startIcon={<DeleteIcon />}
                                                            color="error"
                                                            variant="outlined"
                                                            size="small"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ 
                                p: 3,
                                position: 'sticky',
                                top: 100,
                                borderRadius: 2,
                                bgcolor: '#fff'
                            }}>
                                <Typography variant="h6" gutterBottom>
                                    Order Summary
                                </Typography>
                                
                                <Box sx={{ mt: 3 }}>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2
                                    }}>
                                        <Typography color="text.secondary">Subtotal</Typography>
                                        <Typography>₹{calculateTotal()}</Typography>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2
                                    }}>
                                        <Typography color="text.secondary">Shipping</Typography>
                                        <Typography color="primary">Free</Typography>
                                    </Box>
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Box sx={{ 
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3
                                    }}>
                                        <Typography variant="h6">Total</Typography>
                                        <Typography variant="h6" color="primary">
                                            ₹{calculateTotal()}
                                        </Typography>
                                    </Box>
                                    
                                    <Button 
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Cart;