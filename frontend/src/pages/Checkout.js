import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState('delivery');
  
  // FORMULÁŘ DATA - PŘEDVYPLŇ Z UŽIVATELSKÉHO PROFILU
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });

  // PŘEDVYPLŇ FORMULÁŘ Z UŽIVATELSKÉHO PROFILU
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        notes: ''
      });
    }
  }, [user]);

  // KALKULACE CEN
  const totalPrice = getTotalPrice();
  const deliveryFee = orderType === 'delivery' ? 50 : 0;
  const finalPrice = totalPrice + deliveryFee;

  // FUNKCE PRO ZMĚNU INPUT HODNOT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // FUNKCE PRO ODESLÁNÍ FORMULÁŘE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          pizza: item.pizzaId || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          notes: formData.notes
        },
        orderType,
        totalPrice: finalPrice,
        deliveryFee
      };

      console.log('Odesílám objednávku:', orderData);

      const response = await orderAPI.create(orderData);
      
      showSuccess('Objednávka byla úspěšně odeslána!');
      clearCart();
      navigate('/order-success', { 
        state: { 
          orderId: response.data.order._id,
          totalPrice: finalPrice 
        }
      });
    } catch (error) {
      console.error('Chyba při vytváření objednávky:', error);
      const errorMessage = error.response?.data?.error || 'Chyba při odesílání objednávky. Zkuste to znovu.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // POKUD JE KOŠÍK PRÁZDNÝ
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Přesměrovávám na košík...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dokončení objednávky
          </h1>
          <button
            onClick={() => navigate('/cart')}
            className="text-primary-600 hover:text-primary-700 p-2 touch-manipulation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Údaje objednávky
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

              {/* VÝBĚR TYPU OBJEDNÁVKY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Způsob předání
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <label className="relative cursor-pointer touch-manipulation">
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={orderType === 'delivery'}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 transition-all ${
                      orderType === 'delivery' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          orderType === 'delivery' 
                            ? 'border-primary-500 bg-primary-500' 
                            : 'border-gray-300'
                        }`}>
                          {orderType === 'delivery' && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">🚗 Rozvoz</div>
                          <div className="text-sm text-gray-600">+50 Kč</div>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="relative cursor-pointer touch-manipulation">
                    <input
                      type="radio"
                      name="orderType"
                      value="pickup"
                      checked={orderType === 'pickup'}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-lg p-4 transition-all ${
                      orderType === 'pickup' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          orderType === 'pickup' 
                            ? 'border-primary-500 bg-primary-500' 
                            : 'border-gray-300'
                        }`}>
                          {orderType === 'pickup' && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">🏃 Vyzvednutí</div>
                          <div className="text-sm text-gray-600">Zdarma</div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* KONTAKTNÍ ÚDAJE */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Kontaktní údaje</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jméno a příjmení *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                      placeholder="Jan Novák"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                      placeholder="777 123 456"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (volitelný)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="jan@email.cz"
                  />
                </div>
              </div>

              {/* DORUČOVACÍ ADRESA - POUZE PRO ROZVOZ */}
              {orderType === 'delivery' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">
                    Doručovací adresa
                    {user && user.address && (
                      <span className="text-sm text-green-600 ml-2">
                        (předvyplněno z profilu)
                      </span>
                    )}
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ulice a číslo popisné *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required={orderType === 'delivery'}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                      placeholder="Václavské náměstí 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Město *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required={orderType === 'delivery'}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                      placeholder="Praha"
                    />
                  </div>
                </div>
              )}

              {/* POZNÁMKA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poznámka k objednávce (volitelné)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base resize-none"
                  placeholder="Speciální požadavky, poschodí, poznámky k doručení..."
                />
              </div>

              {/* SUBMIT TLAČÍTKO */}
              <div className="block lg:hidden">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-base font-semibold touch-manipulation"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Odesílám objednávku...
                    </>
                  ) : (
                    <>🛒 Objednat za {finalPrice} Kč</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SHRNUTÍ OBJEDNÁVKY */}
          <div className="lg:sticky lg:top-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Shrnutí objednávky
              </h3>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || '/api/placeholder/200/200'} 
                        alt={item.name || 'Pizza'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800 truncate">
                            {item.name || 'Pizza'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity}× {item.price || 0} Kč
                          </p>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {(item.price || 0) * (item.quantity || 1)} Kč
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Pizzy:</span>
                  <span>{totalPrice} Kč</span>
                </div>
                
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Rozvoz:</span>
                    <span>{deliveryFee} Kč</span>
                  </div>
                )}
                
                <hr className="my-2" />
                
                <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                  <span>Celkem:</span>
                  <span className="text-primary-600">{finalPrice} Kč</span>
                </div>
              </div>

              <div className="hidden lg:block">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-base font-semibold touch-manipulation"
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Odesílám objednávku...
                    </>
                  ) : (
                    <>🛒 Objednat za {finalPrice} Kč</>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
                <p>📞 Máte dotazy? Volejte: 722 272 252</p>
                <p className="mt-1">🕐 Po - So: 17:00 - 20:30</p>
                {orderType === 'pickup' && (
                  <p className="mt-2 text-primary-600">
                    📍 Vyzvednutí: Karlova 15, Praha 1
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;