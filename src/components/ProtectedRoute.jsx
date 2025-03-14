import axiosInstance from '../utils/axiosConfig';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import FarmerDashboard from './farmer/FarmerDashboard';
import BuyerDashboard from './buyer/BuyerDashboard';
import AdminDashboard from './admin/AdminDashboard';

const ProtectedRoute = () => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await axiosInstance.get('/auth/me', {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                
                if (response.data && response.data.role) {
                    setUserRole(response.data.role);
                } else {
                    localStorage.removeItem('token');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('token');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userRole) {
        return <Navigate to="/login" />;
    }

    // Make sure the comparison is case-insensitive
    if (userRole.toUpperCase() === 'ADMIN') {
        return <AdminDashboard />;
    } else if (userRole.toUpperCase() === 'FARMER') {
        return <FarmerDashboard />;
    } else if (userRole.toUpperCase() === 'BUYER') {
        return <BuyerDashboard />;
    }
};

export default ProtectedRoute;