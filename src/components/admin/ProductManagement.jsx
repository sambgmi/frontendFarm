import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import axios from 'axios';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState({
        productName: '',
        description: '',
        basePrice: '',
        imageUrl: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/farmer/products/public/all');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setEditedProduct({
            productName: product.productName,
            description: product.description,
            basePrice: product.basePrice,
            imageUrl: product.imageUrl
        });
        setOpen(true);
    };

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`http://localhost:8081/api/admin/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSnackbar({
                open: true,
                message: 'Product deleted successfully',
                severity: 'success'
            });
            fetchProducts();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to delete product',
                severity: 'error'
            });
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:8081/api/admin/products/${selectedProduct.productId}`,
                editedProduct,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setSnackbar({
                open: true,
                message: 'Product updated successfully',
                severity: 'success'
            });
            setOpen(false);
            fetchProducts();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to update product',
                severity: 'error'
            });
        }
    };

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Image URL</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.productId}>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>₹{product.basePrice}</TableCell>
                                <TableCell>{product.imageUrl}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => handleEdit(product)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        onClick={() => handleDelete(product.productId)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Product Name"
                        value={editedProduct.productName}
                        onChange={(e) => setEditedProduct({...editedProduct, productName: e.target.value})}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={editedProduct.description}
                        onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={editedProduct.basePrice}
                        onChange={(e) => setEditedProduct({...editedProduct, basePrice: e.target.value})}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Image URL"
                        value={editedProduct.imageUrl}
                        onChange={(e) => setEditedProduct({...editedProduct, imageUrl: e.target.value})}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductManagement;