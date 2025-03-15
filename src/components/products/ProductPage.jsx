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
    // Add this state
    const [sortOrder, setSortOrder] = useState('none');

    // Add sorting function
    const sortProducts = (productsToSort) => {
        if (sortOrder === 'none') return productsToSort;
        return [...productsToSort].sort((a, b) => {
            const minPriceA = Math.min(...(a.farmers?.map(f => f.bargainPrice) || []));
            const minPriceB = Math.min(...(b.farmers?.map(f => f.bargainPrice) || []));
            return sortOrder === 'asc' ? minPriceA - minPriceB : minPriceB - minPriceA;
        });
    };
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL_PRODUCTS');
    const [farmerProducts, setFarmerProducts] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const categories = ['ALL_PRODUCTS', 'VEGETABLES', 'FRUITS', 'SEEDS'];

    useEffect(() => {
        fetchProducts();
        fetchFarmerProducts();
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

    const fetchFarmerProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/cart/farmer-products/details', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            setFarmerProducts(response.data);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                window.location.href = 'http://localhost:8081/oauth2/authorization/google';
            } else {
                console.error('Error fetching farmer products:', error);
            }
        }
    };

    const handleAddToCart = async (productDetails, farmerId, bargainPrice, quantity = 1) => {
        try {
            // First get the farmer product details
            const farmerProductsResponse = await axios.get('http://localhost:8081/api/cart/farmer-products/details', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            const farmerProducts = farmerProductsResponse.data;
            
            // Find the matching farmer product
            const farmerProduct = farmerProducts.find(fp => 
                fp.productId === productDetails.productId && 
                fp.farmerId === farmerId && 
                Number(fp.bargainPrice) === Number(bargainPrice)
            );

            if (!farmerProduct) {
                throw new Error('Could not find matching farmer product');
            }

            // Add to cart using the correct farmerProductId
            await axios.post(`http://localhost:8081/api/cart/add`, null, {
                params: {
                    farmerProductId: farmerProduct.farmerProductId,
                    quantity: quantity
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            setSnackbar({
                open: true,
                message: 'Product added to cart successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Add to cart error details:', {
                error: error.message,
                productDetails,
                farmerId,
                bargainPrice
            });
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                window.location.href = 'http://localhost:8081/oauth2/authorization/google';
            } else {
                setSnackbar({
                    open: true,
                    message: error.message || 'Error adding to cart. Please try again.',
                    severity: 'error'
                });
            }
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
            <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
                {/* Hero Section */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mb: 4,
                    pt: 5,
                    background: 'linear-gradient(45deg, #00a152, #2B3445)',
                    borderRadius: 4,
                    p: 6,
                    color: 'white'
                }}>
                    <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 3 }}>
                        Fresh From The Farm
                    </Typography>

                    {/* Categories */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                onClick={() => setSelectedCategory(category.toUpperCase())}
                                variant={selectedCategory === category.toUpperCase() ? "contained" : "outlined"}
                                sx={{
                                    bgcolor: selectedCategory === category.toUpperCase() ? 'white' : 'transparent',
                                    color: selectedCategory === category.toUpperCase() ? '#00a152' : 'white',
                                    borderColor: 'white',
                                    '&:hover': { bgcolor: 'white', color: '#00a152' }
                                }}
                            >
                                {category.replace('_', ' ')}
                            </Button>
                        ))}
                    </Box>
                </Box>

                {/* Sort Controls */}
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    mb: 4,
                    gap: 2,
                    bgcolor: 'white',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>Sort by:</Typography>
                    <Button
                        onClick={() => setSortOrder('asc')}
                        variant={sortOrder === 'asc' ? 'contained' : 'outlined'}
                        sx={{
                            bgcolor: sortOrder === 'asc' ? '#00a152' : 'transparent',
                            '&:hover': { bgcolor: sortOrder === 'asc' ? '#008f49' : 'rgba(0,161,82,0.1)' }
                        }}
                    >
                        Price: Low to High
                    </Button>
                    <Button
                        onClick={() => setSortOrder('desc')}
                        variant={sortOrder === 'desc' ? 'contained' : 'outlined'}
                        sx={{
                            bgcolor: sortOrder === 'desc' ? '#00a152' : 'transparent',
                            '&:hover': { bgcolor: sortOrder === 'desc' ? '#008f49' : 'rgba(0,161,82,0.1)' }
                        }}
                    >
                        Price: High to Low
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {sortProducts(products).map((product) => {
                        // Group farmers by their bargain price
                        const farmersByPrice = product.farmers?.reduce((acc, farmer) => {
                            const price = farmer.bargainPrice;
                            if (!acc[price]) {
                                acc[price] = [];
                            }
                            acc[price].push(farmer);
                            return acc;
                        }, {});

                        // Create cards for unique prices
                        return Object.entries(farmersByPrice || {}).map(([price, farmers]) => (
                            <Grid item key={`${product.productId}-${price}`} xs={12} sm={6} md={3}>
                                <Card sx={{ 
                                    height: '100%',
                                    borderRadius: 3,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 16px 32px rgba(0,0,0,0.15)'
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={product.imageUrl || 'https://via.placeholder.com/200'}
                                        alt={product.productName}
                                        sx={{
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    />
                                    <CardContent sx={{ p: 3 }}>
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
                                            flexDirection: 'column',
                                            gap: 1
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        textDecoration: 'line-through',
                                                        color: 'text.secondary'
                                                    }}
                                                >
                                                    ₹{product.basePrice}
                                                </Typography>
                                                <Typography 
                                                    variant="h6" 
                                                    color="primary" 
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    ₹{price}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ 
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                bgcolor: '#f5f5f5',
                                                p: 1,
                                                borderRadius: 1
                                            }}>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {farmers.length} Farmer{farmers.length > 1 ? 's' : ''} at this price
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {farmers.map(f => f.name).join(', ')}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<ShoppingCartIcon />}
                                                    onClick={() => handleAddToCart(
                                                        product,
                                                        farmers[0].farmerId,
                                                        price
                                                    )}
                                                    sx={{
                                                        bgcolor: '#00a152',
                                                        '&:hover': {
                                                            bgcolor: '#008f49'
                                                        }
                                                    }}
                                                >
                                                    Add to Cart
                                                </Button>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ));
                    })}
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
