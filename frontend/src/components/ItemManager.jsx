import { useState, useEffect } from 'react';
import { fetchItems, createItem, updateItem, deleteItem } from '../api/itemsAPI';
import { toast } from 'react-hot-toast';

const ItemManager = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetchItems();
      if (response.success) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setLoading(true);
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success('Item updated successfully');
      } else {
        await createItem(formData);
        toast.success('Item created successfully');
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      loadItems();
    } catch (error) {
      console.error('Failed to save item:', error);
      toast.error('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, description: item.description });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setLoading(true);
      await deleteItem(id);
      toast.success('Item deleted successfully');
      loadItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Item Manager (Full Stack Demo)</h1>
      
      <div className="bg-card p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Item name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Item description"
              rows="3"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingId ? 'Update Item' : 'Create Item')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{item.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-muted-foreground">
                  No items yet. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemManager;
