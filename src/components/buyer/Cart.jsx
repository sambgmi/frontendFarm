import React, { useState, useEffect } from 'react';
import { 
    Typography, Paper, Grid, Card, CardContent, CardMedia, 
    Button, IconButton, Box, TextField, Alert 
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
            setCartItems(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch cart items');
            console.error(err);
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
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>My Cart</Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {cartItems.length === 0 ? (
                <Typography>Your cart is empty</Typography>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <Card key={item.id} sx={{ mb: 2, display: 'flex' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 150 }}
                                image={item.farmerProduct.product.imageUrl || 'https://via.placeholder.com/150'}
                                alt={item.farmerProduct.product.name}
                            />
                            <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h6">{item.farmerProduct.product.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Farmer: {item.farmerProduct.farmer.name}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        ₹{item.farmerProduct.bargainPrice}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <TextField
                                        value={item.quantity}
                                        size="small"
                                        sx={{ width: 60 }}
                                        InputProps={{ readOnly: true }}
                                    />
                                    <IconButton 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => removeFromCart(item.id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Total: ₹{calculateTotal()}</Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            sx={{ mt: 2 }}
                        >
                            Proceed to Checkout
                        </Button>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default Cart;