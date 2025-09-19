import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { orderAPI } from '../services/api';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth(); // Zkontroluj, jestli je přihlášený
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // FUNKCE PRO ZMĚNU MNOŽSTVÍ
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      showSuccess('Položka odebrána z košíku');
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // FUNKCE PRO ODEBRÁNÍ POLOŽKY
  const handleRemoveItem = (id) => {
    removeFromCart(id);
    showSuccess('Položka odebrána z košíku');
  };

  // PŘÍMÁ OBJEDNÁVKA PRO PŘIHLÁŠENÉ UŽIVATELE
  const handleDirectOrder = async (orderType = 'delivery') => {
    if (!user) {
      // Není přihlášený -> přesměruj na checkout
      navigate('/checkout');
      return;
    }

    // KONTROLA TELEFONU - pokud uživatel nemá telefon, přesměruj na checkout
    if (!user.phone || user.phone.trim() === '') {
      showError('Pro přímou objednávku je potřeba telefon. Dokončete objednávku na další stránce.');
      navigate('/checkout');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          pizza: item.pizzaId || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        customerInfo: {
          name: user.name || 'Neznámé jméno',
          phone: user.phone.trim(), // POVINNÉ
          email: user.email || '',
          address: orderType === 'delivery' ? 'Adresa bude upřesněna telefonicky' : '',
          city: orderType === 'delivery' ? 'Praha' : '',
          notes: `Objednávka z košíku - ${orderType === 'delivery' ? 'rozvoz' : 'vyzvednutí'}`
        },
        orderType,
        totalPrice: getTotalPrice() + (orderType === 'delivery' ? 50 : 0),
        deliveryFee: orderType === 'delivery' ? 50 : 0
      };

      console.log('Odesílám objednávku:', orderData); // DEBUG

      const response = await orderAPI.create(orderData);
      showSuccess('Objednávka byla úspěšně odeslána!');
      clearCart();
      navigate('/order-success', { 
        state: { 
          orderId: response.data.order._id,
          totalPrice: orderData.totalPrice 
        }
      });
    } catch (error) {
      console.error('Chyba při objednávce:', error);
      const errorMsg = error.response?.data?.error || 'Chyba při odesílání objednávky. Zkuste to znovu.';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // POKUD JE KOŠÍK PRÁZDNÝ
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* PRÁZDNÝ KOŠÍK - MOBILNÍ OPTIMALIZOVANÝ */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            {/* IKONA PRÁZDNÉHO KOŠÍKU */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 4M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z"></path>
              </svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Váš košík je prázdný
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Zatím jste si nic nevybrali. Prohlédněte si naše menu a vyberte si své oblíbené pizzy!
            </p>
            
            {/* MOBILNÍ CTA TLAČÍTKO */}
            <Link 
              to="/"
              className="btn btn-primary w-full sm:w-auto sm:px-8 py-3 sm:py-4 text-base font-semibold touch-manipulation"
            >
              🍕 Zobrazit menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* MOBILNÍ OPTIMALIZOVANÁ HLAVIČKA */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Košík ({items.length})
          </h1>
          
          {/* TLAČÍTKO PRO VYPRÁZDNĚNÍ KOŠÍKU */}
          {items.length > 0 && (
            <button
              onClick={() => {
                clearCart();
                showSuccess('Košík byl vyprázdněn');
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 touch-manipulation"
            >
              Vyprázdnit košík
            </button>
          )}
        </div>

        {/* RESPONZIVNÍ LAYOUT */}
        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          
          {/* SEZNAM POLOŽEK */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                
                {/* MOBILNÍ LAYOUT POLOŽKY */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    
                    {/* OBRÁZEK PIZZY - na mobilu menší */}
                    <div className="w-full sm:w-24 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || '/api/placeholder/200/200'} 
                        alt={item.name}
                        className="w-full h-32 sm:h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* INFORMACE O PIZZE */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                        
                        {/* NÁZEV A POPIS - BEZ VELIKOSTÍ */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                          {/* ZOBRAZÍ PŘÍSADY POKUD EXISTUJÍ */}
                          {item.ingredients && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {item.ingredients}
                            </p>
                          )}
                        </div>

                        {/* CENA */}
                        <div className="text-right sm:ml-4">
                          <p className="text-lg font-bold text-primary-600">
                            {item.price} Kč
                          </p>
                          {/* CELKOVÁ CENA ZA MNOŽSTVÍ */}
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              celkem: {item.price * item.quantity} Kč
                            </p>
                          )}
                        </div>
                      </div>

                      {/* OVLÁDÁNÍ MNOŽSTVÍ - MOBILNÍ OPTIMALIZOVANÉ */}
                      <div className="flex items-center justify-between mt-4">
                        
                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center touch-manipulation transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          
                          <span className="text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center touch-manipulation transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                          </button>
                        </div>

                        {/* TLAČÍTKO SMAZAT */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-2 touch-manipulation"
                          aria-label="Odebrat z košíku"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SHRNUTÍ OBJEDNÁVKY - STICKY NA DESKTOPU */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Shrnutí objednávky
              </h3>

              {/* DETAIL POLOŽEK */}
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-medium">
                      {item.price * item.quantity} Kč
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* CELKOVÁ CENA */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-800">
                  Celkem:
                </span>
                <span className="text-xl font-bold text-primary-600">
                  {getTotalPrice()} Kč
                </span>
              </div>

              {/* CHECKOUT/OBJEDNÁVKA TLAČÍTKA - PODMÍNĚNÉ */}
              <div className="space-y-3">
                {user ? (
                  // PŘIHLÁŠENÝ UŽIVATEL - PŘÍMÁ OBJEDNÁVKA
                  <>
                    <button
                      onClick={() => handleDirectOrder('delivery')}
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
                        <>🚚 Objednat s rozvojem - {getTotalPrice() + 50} Kč</>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDirectOrder('pickup')}
                      disabled={loading}
                      className="btn btn-secondary w-full py-3 text-base font-medium touch-manipulation"
                    >
                      🏃 Objednat k vyzvednutí - {getTotalPrice()} Kč
                    </button>
                  </>
                ) : (
                  // NEPŘIHLÁŠENÝ UŽIVATEL - CHECKOUT
                  <>
                    <Link
                      to="/checkout"
                      className="btn btn-primary w-full py-4 text-base font-semibold touch-manipulation text-center block"
                    >
                      🛒 Pokračovat k objednávce
                    </Link>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Pro rychlejší objednávání se přihlaste
                      </p>
                      <Link
                        to="/login"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Přihlásit se
                      </Link>
                    </div>
                  </>
                )}
                
                <Link
                  to="/"
                  className="btn btn-secondary w-full py-3 text-base font-medium touch-manipulation text-center block"
                >
                  ← Pokračovat v nákupu
                </Link>
              </div>

              {/* DODATEČNÉ INFO */}
              <div className="mt-6 text-xs text-gray-500 text-center">
                <p>📞 Máte dotazy? Volejte: 722 272 252</p>
                <p className="mt-1">🕐 Po - So: 17:00 - 20:30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;