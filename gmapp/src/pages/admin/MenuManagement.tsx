import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMenuStore } from '../../store/menuStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FOOD_CATEGORIES } from '../../constants/categories';


interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: any;
  onSubmit: (formData: any) => Promise<void>;
}

function MenuModal({ isOpen, onClose, editingItem, onSubmit }: MenuModalProps) {
  const [isAddingNewCategory, setIsAddingNewCategory] = React.useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: String(FOOD_CATEGORIES[0]),
    subcategory: '',
    description: '',
    enabled: true,
    image: null as File | null,
    currentImageUrl: '',
    currentImageName: ''
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        price: editingItem.price.toString(),
        category: editingItem.category,
        subcategory: editingItem.subcategory || '',
        description: editingItem.description || '',
        enabled: editingItem.enabled,
        image: null,
        currentImageUrl: editingItem.image,
        currentImageName: editingItem.image.split('/').pop() || ''
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: FOOD_CATEGORIES[0],
        subcategory: '',
        description: '',
        enabled: true,
        image: null,
        currentImageUrl: '',
        currentImageName: ''
      });
    }
  }, [editingItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const removeCurrentImage = () => {
    setFormData({ ...formData, currentImageUrl: '', currentImageName: '', image: null });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              required
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
<div>
  <label className="block text-sm font-medium text-gray-700">Category</label>
  {!isAddingNewCategory ? (
    <select
      required
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
      value={formData.category}
      onChange={(e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === "add-new") {
          setFormData({ ...formData, category: "" });
          setIsAddingNewCategory(true);
        } else {
          setFormData({ ...formData, category: selectedCategory });
        }
      }}
    >
      {FOOD_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
      <option value="add-new">Add New Category</option>
    </select>
  ) : (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700">New Category</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        placeholder="Enter new category"
      />
      <button
        type="button"
        className="mt-2 text-sm text-purple-600 hover:underline"
        onClick={() => {
          setIsAddingNewCategory(false);
          setFormData({ ...formData, category: "" });
        }}
      >
        Back to Categories
      </button>
    </div>
  )}
</div>




          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory (Optional)</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 inline-block mr-2" />
                Choose Image
              </label>
              {(formData.currentImageUrl || formData.image) && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {formData.image?.name || formData.currentImageName}
                  </span>
                  <button
                    type="button"
                    onClick={removeCurrentImage}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-600 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
              Item Available
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              {editingItem ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MenuManagement() {
  const { items, loading, error, fetchMenuItems, startRealTimeUpdates } = useMenuStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    subcategory: 'all',
    search: ''
  });

  useEffect(() => {
    const unsubscribe = startRealTimeUpdates();
    return () => unsubscribe();
  }, []);

  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, Set<string>>();
    items.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, new Set());
      }
      if (item.subcategory) {
        categoryMap.get(item.category)?.add(item.subcategory);
      }
    });
    return Array.from(categoryMap.entries()).map(([category, subcategories]) => ({
      name: category,
      subcategories: Array.from(subcategories)
    }));
  }, [items]);

  const filteredItems = React.useMemo(() => {
    return items.filter(item => {
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesSubcategory = filters.subcategory === 'all' || item.subcategory === filters.subcategory;
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          item.description?.toLowerCase().includes(filters.search.toLowerCase());
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [items, filters]);

  const handleSubmit = async (formData: any) => {
    try {
      let imageUrl = editingItem?.image || '';

      if (formData.image) {
        const storageRef = ref(storage, `menu/${formData.image.name}`);
        const snapshot = await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(snapshot.ref);

        if (editingItem?.image && editingItem.image !== imageUrl) {
          const oldImageRef = ref(storage, editingItem.image);
          try {
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
      } else if (formData.currentImageUrl) {
        imageUrl = formData.currentImageUrl;
      }

      const itemData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        subcategory: formData.subcategory || null,
        description: formData.description || null,
        enabled: formData.enabled,
        image: imageUrl,
      };

      if (editingItem) {
        await updateDoc(doc(db, 'menuItems', editingItem.id), itemData);
        toast.success('Item updated successfully');
      } else {
        await addDoc(collection(db, 'menuItems'), itemData);
        const docRef = collection(db, 'FOOD_CATEGORIES');
        const docalldata = await getDocs(docRef);
        const firstDoc = docalldata.docs[0];
        const firstDocId = firstDoc.id;
        const r1=doc(db,'FOOD_CATEGORIES',firstDocId)
        const foodcategories = FOOD_CATEGORIES || [];
        if (!foodcategories.includes(formData.category)) {
            foodcategories.push(formData.category);
            await updateDoc(r1, { foodcategories });}
        toast.success('Item added successfully');
      }

      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  const handleDelete = async (item: any) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'menuItems', item.id));
        
        if (item.image) {
          const imageRef = ref(storage, item.image);
          try {
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        }
        
        toast.success('Item deleted successfully');
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const toggleItemStatus = async (item: any) => {
    try {
      await updateDoc(doc(db, 'menuItems', item.id), {
        enabled: !item.enabled,
      });
      toast.success(`Item ${item.enabled ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update item status');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search items..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, subcategory: 'all' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
            >
              <option value="all">All Categories</option>
              {categories.map(({ name }) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <select
              value={filters.subcategory}
              onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-600 focus:ring-purple-600"
              disabled={filters.category === 'all'}
            >
              <option value="all">All Subcategories</option>
              {filters.category !== 'all' && 
                categories
                  .find(cat => cat.name === filters.category)
                  ?.subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))
              }
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-purple-100 rounded-lg shadow-md overflow-hidden border">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                {!item.enabled && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-4 ">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsModalOpen(true);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-purple-600 font-bold mb-2">₹{item.price}</p>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">{item.category}</span>
                    {item.subcategory && (
                      <span className="text-gray-500"> / {item.subcategory}</span>
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleItemStatus(item)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default MenuManagement;