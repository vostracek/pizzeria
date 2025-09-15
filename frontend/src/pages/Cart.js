import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  const { 
    items, 
    updateQuantity, 
    removeFromCart, // Používáme removeFromCart místo removeItem
    clearCart, 
    getTotalPrice, 
    getTotalItems 
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const promoAmount = (subtotal * promoDiscount) / 100;
  const total = subtotal + deliveryFee - promoAmount;

  const applyPromoCode = () => {
    const validCodes = {
      'PIZZA20': 20,
      'PRVNI10': 10,
      'WEEKEND15': 15
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setPromoDiscount(validCodes[promoCode.toUpperCase()]);
      showSuccess(`Promocode ${promoCode} byl aplikován! Sleva ${validCodes[promoCode.toUpperCase()]}%`);
    } else {
      showError('Neplatný promocode');
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = Math.floor(Math.random() * 10000);
      showSuccess('Objednávka byla úspěšně vytvořena!');
      clearCart();
      
      navigate('/order-success', { 
        state: { 
          orderId, 
          totalPrice: total.toFixed(0) 
        } 
      });
    } catch (error) {
      showError('Chyba při vytváření objednávky. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 4M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Váš košík je prázdný
            </h2>
            <p className="text-gray-600 mb-8">
              Zatím jste si nevybrali žádnou pizzu. Podívejte se na naše menu 
              a vyberte si ze široké nabídky čerstvých pizz.
            </p>
            
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Vybrat pizzu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Váš košík</h1>
              <p className="text-gray-600 mt-2">
                {getTotalItems()} položek
              </p>
            </div>
            
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Vyčistit košík
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.pizza._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-6">
                  
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={item.pizza.image || '/images/pizza-placeholder.jpg'} 
                      alt={item.pizza.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{item.pizza.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.pizza._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                    
                    {/* Zobrazení popisu pizzy */}
                    <p className="text-gray-600 text-sm mb-2">{item.pizza.description}</p>
                    
                    {/* Zobrazení ingrediencí */}
                    {item.pizza.ingredients && item.pizza.ingredients.length > 0 && (
                      <div className="text-sm text-gray-500 mb-3">
                        Ingredience: {item.pizza.ingredients.join(', ')}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.pizza._id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                          </svg>
                        </button>
                        
                        <span className="font-medium text-lg w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.pizza._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800">
                          {(item.pizza.price * item.quantity).toFixed(0)} Kč
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-gray-500">
                            {item.pizza.price} Kč/ks
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Souhrn objednávky
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máte promocode?
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="PROMOCODE"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={!promoCode}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Použít
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Dostupné kódy: PIZZA20, PRVNI10, WEEKEND15
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mezisoučet</span>
                  <span className="font-medium">{subtotal.toFixed(0)} Kč</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Doprava</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Zdarma</span>
                    ) : (
                      `${deliveryFee} Kč`
                    )}
                  </span>
                </div>
                
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Sleva ({promoDiscount}%)</span>
                    <span>-{promoAmount.toFixed(0)} Kč</span>
                  </div>
                )}
                
                {subtotal <= 500 && (
                  <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                    Doprava zdarma při objednávce nad 500 Kč
                  </div>
                )}
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Celkem</span>
                  <span>{total.toFixed(0)} Kč</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Zpracovávám...
                  </span>
                ) : isAuthenticated ? (
                  'Dokončit objednávku'
                ) : (
                  'Přihlásit se a objednat'
                )}
              </button>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Platba při doručení nebo kartou online</p>
                <p className="mt-1">Odhadovaný čas doručení: 30-45 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;