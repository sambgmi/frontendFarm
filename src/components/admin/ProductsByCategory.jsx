import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import axiosInstance from '../../utils/axiosConfig';
import './ProductsByCategory.css';
import axios from 'axios'; 
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ProductsByCategory = () => {
  const [categories] = useState(['All Products', 'Vegetables', 'Fruits', 'Seeds']);
  const [selectedCategory, setSelectedCategory] = useState('ALL PRODUCTS');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fix the API endpoints to use the correct base URL
      const url = selectedCategory === 'ALL PRODUCTS'
        ? 'http://localhost:8081/api/products/all'
        : `http://localhost:8081/api/products/category/${selectedCategory}`;
        
      const response = await axios.get(url);  // Use axios directly instead of axiosInstance
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProduct({ name: '', description: '', price: '', category: '', imageUrl: '' });
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/api/admin/products/add', newProduct, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      handleClose();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ bgcolor: '#f5f5f5', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4, pt: 3 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
          Products by Category
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
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
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ bgcolor: '#00a152' }}
          >
            Add New Product
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: '#ffffff',
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Chip 
                    label={product.category} 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Typography color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <Typography variant="h6" color="primary">
                      ₹{product.price}
                    </Typography>
                    <Typography variant="body2">
                      Stock: {product.quantity}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Product Name"
            fullWidth
            margin="normal"
            value={newProduct.name}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newProduct.description}
            onChange={handleInputChange}
          />
          <TextField
            name="price"
            label="Price"
            fullWidth
            margin="normal"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
          />
          <TextField
            name="category"
            label="Category"
            fullWidth
            margin="normal"
            select
            value={newProduct.category}
            onChange={handleInputChange}
          >
            {categories.filter(cat => cat !== 'All Products').map((category) => (
              <MenuItem key={category} value={category.toUpperCase()}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="imageUrl"
            label="Image URL"
            fullWidth
            margin="normal"
            value={newProduct.imageUrl}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ bgcolor: '#00a152' }}
          >
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductsByCategory;