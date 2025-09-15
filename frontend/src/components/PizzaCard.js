import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

const PizzaCard = ({ pizza }) => {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const { name, description, price, image, ingredients } = pizza;

  const handleAddToCart = () => {
    addToCart(pizza);
    showSuccess(`${pizza.name} přidána do košíku!`);
  };

  return (
    <div className="card w-full max-w-sm mx-auto sm:max-w-none">
      <div className="relative overflow-hidden group">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-bold">
          {price} Kč
        </div>
        
        {/* Mobile quick add button - appears on tap */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button 
            className="bg-white text-primary-600 px-4 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg"
            onClick={handleAddToCart}
          >
            Rychle přidat
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 leading-tight">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>
        
        <div className="mb-4 sm:mb-6">
          <div className="text-sm font-semibold text-gray-700 mb-2">Ingredience:</div>
          <div className="text-xs sm:text-sm text-gray-500 italic leading-relaxed">
            {ingredients.join(', ')}
          </div>
        </div>
        
        {/* Mobile optimized button */}
        <button 
          className="btn btn-success w-full py-3 sm:py-2 text-base sm:text-sm font-semibold touch-manipulation"
          onClick={handleAddToCart}
        >
          Přidat do košíku - {price} Kč
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;