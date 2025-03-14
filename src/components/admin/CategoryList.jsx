import React, { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Alert, 
  CircularProgress,
  Button,
  TextField,
  Box,
  IconButton,
  ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/admin/categories');
      setCategories(response.data || []);
    } catch (error) {
      setError('Failed to fetch categories. Please try again later.');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axiosInstance.post('/admin/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      setError('Failed to add category. Please try again.');
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axiosInstance.delete(`/admin/categories/${categoryId}`);
      fetchCategories();
    } catch (error) {
      setError('Failed to delete category. Please try again.');
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          label="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button 
          variant="contained" 
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
        >
          Add
        </Button>
      </Box>

      <List>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemText primary={category.name} />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                aria-label="delete"
                onClick={() => handleDeleteCategory(category.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CategoryList;