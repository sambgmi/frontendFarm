import React, { useState } from 'react';
import { Container, Tab, Tabs, Box, Paper } from '@mui/material';
import UserManagement from './UserManagement';
import ProductsByCategory from './ProductsByCategory';

const AdminDashboard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Users" />
            <Tab label="Products by Category" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 3 }}>
          {value === 0 && <UserManagement />}
          {value === 1 && <ProductsByCategory />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;