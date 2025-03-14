import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './Farmer.css';

const FarmerDashboard = () => {
    const [myProducts, setMyProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchMyProducts();
            fetchAvailableProducts();
        } else {
            setError('Please login to access this page');
        }
    }, []);

    const fetchMyProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/farmer/products', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMyProducts(response.data);
        } catch (err) {
            setError('Failed to fetch your products');
        }
    };

    const fetchAvailableProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://localhost:8081/api/admin/public/products', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            setAvailableProducts(response.data);
        } catch (err) {
            console.error('Error details:', err);
            if (err.response?.status === 401) {
                setError('Session expired. Please login again');
                // Optionally redirect to login page or handle re-authentication
            } else {
                setError('Failed to fetch available products');
            }
        }
    };

    const handleAddProduct = async (productId, quantity, bargainPrice) => {
        try {
            await axios.post(`http://localhost:8081/api/farmer/products/add`, null, {
                params: { productId, quantity, bargainPrice },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccess('Product added successfully');
            fetchMyProducts();
        } catch (err) {
            setError('Failed to add product');
        }
    };

    const handleUpdateStock = async (productId, quantity) => {
        try {
            await axios.put(`http://localhost:8081/api/farmer/products/${productId}/stock`, null, {
                params: { quantity },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccess('Stock updated successfully');
            fetchMyProducts();
        } catch (err) {
            setError('Failed to update stock');
        }
    };

    const handleUpdatePrice = async (productId, bargainPrice) => {
        try {
            await axios.put(`http://localhost:8081/api/farmer/products/${productId}/bargain-price`, null, {
                params: { bargainPrice },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccess('Price updated successfully');
            fetchMyProducts();
        } catch (err) {
            setError('Failed to update price');
        }
    };

    return (
        <Container className="mt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header>
                            <h4>My Products</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Stock</th>
                                        <th>Bargain Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.product.name}</td>
                                            <td>{product.product.category}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    defaultValue={product.quantity}
                                                    onBlur={(e) => handleUpdateStock(product.id, e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    defaultValue={product.bargainPrice}
                                                    onBlur={(e) => handleUpdatePrice(product.id, e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <Button variant="primary" size="sm">
                                                    Update
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h4>Available Products</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Base Price</th>
                                        <th>Add to My Products</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {availableProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{product.basePrice}</td>
                                            <td>
                                                <Form.Group>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Quantity"
                                                        className="mb-2"
                                                        id={`quantity-${product.id}`}
                                                    />
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Your Price"
                                                        className="mb-2"
                                                        id={`price-${product.id}`}
                                                    />
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => {
                                                            const quantity = document.getElementById(`quantity-${product.id}`).value;
                                                            const price = document.getElementById(`price-${product.id}`).value;
                                                            handleAddProduct(product.id, quantity, price);
                                                        }}
                                                    >
                                                        Add Product
                                                    </Button>
                                                </Form.Group>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FarmerDashboard;