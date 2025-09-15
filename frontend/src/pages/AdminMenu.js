import React, { useState, useEffect } from 'react';
import { pizzaAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const AdminMenu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPizza, setEditingPizza] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const { showSuccess, showError } = useToast();

  // Formulář pro přidání/editaci pizzy
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'klasické',
    ingredients: '',
    available: true
  });

  useEffect(() => {
    loadPizzas();
  }, []);

  const loadPizzas = async () => {
    try {
      const response = await pizzaAPI.getAll();
      setPizzas(response.data);
    } catch (error) {
      console.error('Chyba při načítání pizz:', error);
      showError('Chyba při načítání pizz');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'klasické',
      ingredients: '',
      available: true
    });
    setEditingPizza(null);
    setShowAddForm(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Převedeme ingredience z textu na pole
      const ingredientsArray = formData.ingredients
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);

      const pizzaData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        image: formData.image,
        category: formData.category,
        ingredients: ingredientsArray,
        available: formData.available
      };

      if (editingPizza) {
        // Editace existující pizzy
        await pizzaAPI.update(editingPizza._id, pizzaData);
        showSuccess('Pizza byla úspěšně upravena');
      } else {
        // Přidání nové pizzy
        await pizzaAPI.create(pizzaData);
        showSuccess('Pizza byla úspěšně přidána');
      }

      resetForm();
      loadPizzas();
    } catch (error) {
      console.error('Chyba při ukládání pizzy:', error);
      showError('Chyba při ukládání pizzy');
    } finally {
      setFormLoading(false);
    }
  };

  const deletePizza = async (pizzaId) => {
    if (window.confirm('Opravdu chcete smazat tuto pizzu?')) {
      try {
        await pizzaAPI.delete(pizzaId);
        loadPizzas();
        showSuccess('Pizza byla smazána');
      } catch (error) {
        console.error('Chyba při mazání pizzy:', error);
        showError('Chyba při mazání pizzy');
      }
    }
  };

  const toggleAvailability = async (pizzaId, currentStatus) => {
    try {
      await pizzaAPI.update(pizzaId, { available: !currentStatus });
      loadPizzas();
      showSuccess(`Pizza ${!currentStatus ? 'zpřístupněna' : 'skryta'}`);
    } catch (error) {
      showError('Chyba při aktualizaci pizzy');
    }
  };

  const startEdit = (pizza) => {
    setFormData({
      name: pizza.name,
      description: pizza.description,
      price: pizza.price.toString(),
      image: pizza.image,
      category: pizza.category,
      ingredients: pizza.ingredients.join(', '),
      available: pizza.available
    });
    setEditingPizza(pizza);
    setShowAddForm(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Načítám menu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Správa menu</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            Přidat novou pizzu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map(pizza => (
            <div key={pizza._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={pizza.image} 
                alt={pizza.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{pizza.name}</h3>
                  {!pizza.available && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Nedostupná
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{pizza.description}</p>
                
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1">Ingredience:</div>
                  <div className="text-xs text-gray-500">
                    {pizza.ingredients.join(', ')}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-lg font-bold text-primary-600">{pizza.price} Kč</div>
                  <div className="text-sm text-gray-500">Kategorie: {pizza.category}</div>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => startEdit(pizza)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Upravit
                  </button>
                  <button 
                    onClick={() => deletePizza(pizza._id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    Smazat
                  </button>
                </div>
                
                <div>
                  <label className="flex items-center text-sm">
                    <input 
                      type="checkbox" 
                      checked={pizza.available}
                      onChange={() => toggleAvailability(pizza._id, pizza.available)}
                      className="mr-2"
                    />
                    Dostupná
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulář pro přidání/editaci pizzy */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {editingPizza ? 'Upravit pizzu' : 'Přidat novou pizzu'}
                  </h2>
                  <button 
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Název pizzy *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Název pizzy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Popis *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Popis pizzy"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cena (Kč) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategorie *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="klasické">Klasické</option>
                        <option value="meat">Masové</option>
                        <option value="vegetariánské">Vegetariánské</option>
                        <option value="vegánské">Vegánské</option>
                        <option value="speciální">Speciální</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL obrázku *
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://example.com/pizza.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingredience (oddělené čárkou) *
                    </label>
                    <textarea
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleFormChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="rajčatová omáčka, mozzarella, bazalka, olivový olej"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Pizza je dostupná
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Zrušit
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="btn btn-primary"
                    >
                      {formLoading ? 'Ukládám...' : (editingPizza ? 'Upravit pizzu' : 'Přidat pizzu')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;