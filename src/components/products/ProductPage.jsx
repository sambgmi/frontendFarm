import React, { useState, useEffect } from 'react';
import { 
    Container, Grid, Card, CardContent, CardMedia, Typography, 
    Button, TextField, Box, Chip, Snackbar
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import './ProductPage.css';
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { createTheme, ThemeProvider } from '@mui/material';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL_PRODUCTS');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const categories = ['ALL_PRODUCTS', 'VEGETABLES', 'FRUITS', 'SEEDS'];

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        try {
            const url = selectedCategory === 'ALL_PRODUCTS'  // Changed from 'ALL PRODUCTS' to 'ALL_PRODUCTS'
                ? 'http://localhost:8081/api/farmer/products/public/all'
                : `http://localhost:8081/api/farmer/products/public/category/${selectedCategory}`;
            const response = await axios.get(url);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8081/api/products/add', newProduct);
            setOpen(false);
            fetchProducts();
            setNewProduct({
                name: '',
                description: '',
                price: '',
                quantity: '',
                category: '',
                imageUrl: ''
            });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleAddToCart = async (productId, quantity) => {
        try {
            await axios.post(`http://localhost:8081/api/cart/add`, null, {
                params: {
                    farmerProductId: productId,
                    quantity: quantity
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setSnackbar({
                open: true,
                message: 'Product added to cart successfully!',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'LOGIN FIRST',
                severity: 'error'
            });
            console.error('Error adding to cart:', error);
        }
    };

    const theme = createTheme({
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: '#f5f5f5',
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 4,
                    pt: 5  // Increased top padding
                }}>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
                        Our Popular Products
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 2,
                        flexWrap: 'wrap'
                    }}>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                onClick={() => setSelectedCategory(category.toUpperCase())}
                                variant={selectedCategory === category.toUpperCase() ? "contained" : "text"}
                                sx={{
                                    bgcolor: selectedCategory === category.toUpperCase() ? '#00a152' : 'transparent',
                                    '&:hover': {
                                        bgcolor: selectedCategory === category.toUpperCase() ? '#00a152' : 'rgba(0, 161, 82, 0.1)'
                                    }
                                }}
                            >
                                {category}
                            </Button>
                        ))}
                    </Box>
                </Box>
    
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item key={product.productId} xs={12} sm={6} md={3}>
                            <Card sx={{ 
                                height: '100%',
                                borderRadius: 2,
                                boxShadow: 3,
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s ease-in-out'
                                }
                            }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.imageUrl || 'https://via.placeholder.com/200'}
                                    alt={product.productName}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.productName}
                                    </Typography>
                                    <Chip 
                                        label={product.category} 
                                        color="primary" 
                                        size="small" 
                                        sx={{ mb: 1 }}
                                    />
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {product.description}
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1
                                    }}>
                                        <Typography variant="h6" color="primary">
                                            ₹{product.basePrice}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.farmers?.length || 0} Farmers
                                        </Typography>
                                    </Box>
                                    {product.farmers && product.farmers.length > 0 && (
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                Price Range: ₹{Math.min(...product.farmers.map(f => f.bargainPrice))} - 
                                                ₹{Math.max(...product.farmers.map(f => f.bargainPrice))}
                                            </Typography>
                                            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    label="Qty"
                                                    defaultValue={1}
                                                    onChange={(e) => {
                                                        const value = Math.max(1, parseInt(e.target.value) || 1);
                                                        e.target.value = value;
                                                    }}
                                                    InputProps={{ inputProps: { min: 1 } }}
                                                    sx={{ width: '80px' }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<ShoppingCartIcon />}
                                                    onClick={(e) => {
                                                        const quantity = parseInt(e.target.parentElement.querySelector('input').value);
                                                        handleAddToCart(product.productId, quantity);
                                                    }}
                                                    fullWidth
                                                >
                                                    Add to Cart
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
    
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    message={snackbar.message}
                />
            </Container>
        </ThemeProvider>
    );
};

export default ProductPage;