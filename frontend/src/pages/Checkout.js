import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  // HOOKS PRO STAV KOMPONENTY
  const { items, getTotalPrice, clearCart } = useCart(); // Získá data z košíku
  const { showSuccess, showError } = useToast(); // Toast notifikace
  const navigate = useNavigate(); // Navigace mezi stránkami
  const [loading, setLoading] = useState(false); // Loading stav formuláře
  const [orderType, setOrderType] = useState('delivery'); // delivery nebo pickup
  
  // FORMULÁŘ DATA - stav všech input polí
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });

  // KALKULACE CEN
  const totalPrice = getTotalPrice(); // Celková cena pizz
  const deliveryFee = orderType === 'delivery' ? 50 : 0; // Poplatek za rozvoz
  const finalPrice = totalPrice + deliveryFee; // Konečná cena

  // FUNKCE PRO ZMĚNU INPUT HODNOT
  const handleChange = (e) => {
    // Destructuring - vytáhne name a value z input elementu
    const { name, value } = e.target;
    setFormData({
      ...formData, // Spread - zkopíruje všechny stávající hodnoty
      [name]: value // Dynamický klíč - změní jen tu hodnotu co se edituje
    });
  };

  // FUNKCE PRO ODESLÁNÍ FORMULÁŘE
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zabrání refresh stránky
    setLoading(true); // Zapne loading stav

    try {
      // PŘÍPRAVA DAT PRO API
      const orderData = {
        // Transformuje košík data na formát pro backend
        items: items.map(item => ({
          pizza: item.pizza._id, // ID pizzy z databáze
          quantity: item.quantity, // Počet kusů
          price: item.pizza.price // Cena za kus
        })),
        customerInfo: formData, // Zákaznické údaje
        orderType, // delivery nebo pickup
        totalPrice: finalPrice, // Celková cena včetně rozvozu
        deliveryFee, // Poplatek za rozvoz
        status: 'pending' // Výchozí stav objednávky
      };

      // VOLÁNÍ API
      const response = await orderAPI.create(orderData);
      
      // ÚSPĚCH - zobrazí toast a přesměruje
      showSuccess('Objednávka byla úspěšně odeslána!');
      clearCart(); // Vyprázdní košík
      navigate('/order-success', { 
        state: { 
          orderId: response.data.order._id,
          totalPrice: finalPrice 
        }
      });
    } catch (error) {
      // CHYBA - zobrazí error toast
      console.error('Chyba při vytváření objednávky:', error);
      showError('Chyba při odesílání objednávky. Zkuste to znovu.');
    } finally {
      setLoading(false); // Vypne loading stav
    }
  };

  // POKUD JE KOŠÍK PRÁZDNÝ - přesměruj na košík
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          Dokončení objednávky
        </h1>

        {/* MOBILNÍ LAYOUT - na mobilu stack, na desktopu grid */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          
          {/* FORMULÁŘ OBJEDNÁVKY */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Údaje objednávky
            </h2>

            {/* VÝBĚR TYPU OBJEDNÁVKY - Mobilní optimalizované radio buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Způsob předání
              </label>
              {/* GRID LAYOUT - na mobilu 1 sloupec, na tabletu 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* ROZVOZ OPTION */}
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={orderType === 'delivery'} // True pokud je vybrán delivery
                    onChange={(e) => setOrderType(e.target.value)} // Změní orderType stav
                    className="sr-only" // Screen reader only - skryje default radio
                  />
                  {/* CUSTOM RADIO DESIGN - mění barvy podle stavu */}
                  <div className={`border-2 rounded-lg p-4 transition-all touch-manipulation ${
                    orderType === 'delivery' 
                      ? 'border-primary-500 bg-primary-50' // Aktivní styl
                      : 'border-gray-300 hover:border-gray-400' // Neaktivní styl
                  }`}>
                    <div className="font-semibold text-base">🚚 Rozvoz</div>
                    <div className="text-sm text-gray-600">+ 50 Kč</div>
                  </div>
                </label>
                
                {/* OSOBNÍ ODBĚR OPTION */}
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="orderType"
                    value="pickup"
                    checked={orderType === 'pickup'}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`border-2 rounded-lg p-4 transition-all touch-manipulation ${
                    orderType === 'pickup' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <div className="font-semibold text-base">🏪 Osobní odběr</div>
                    <div className="text-sm text-gray-600">Zdarma</div>
                  </div>
                </label>
              </div>
            </div>

            {/* FORMULÁŘ ZÁKAZNICKÝCH ÚDAJŮ */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              
              {/* JMÉNO A TELEFON - na mobilu pod sebou, na tabletu vedle sebe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jméno a příjmení *
                  </label>
                  <input
                    type="text"
                    name="name" // Klíč pro formData objekt
                    value={formData.name} // Hodnota ze stavu
                    onChange={handleChange} // Volá se při každé změně
                    required // HTML5 validace
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base" // text-base pro mobily
                    placeholder="Jan Novák"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel" // Speciální typ pro telefony
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="777 123 456"
                  />
                </div>
              </div>

              {/* EMAIL */}
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

              {/* ADRESA - zobrazuje se jen při rozvozu */}
              {orderType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresa *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required={orderType === 'delivery'} // Povinné jen pro rozvoz
                      placeholder="Ulice a číslo popisné"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
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
                      placeholder="Praha"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    />
                  </div>
                </>
              )}

              {/* INFO BOX PRO OSOBNÍ ODBĚR */}
              {orderType === 'pickup' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Místo odběru:</h4>
                  <div className="text-blue-700 space-y-1">
                    <p>📍 Hany Kvapilové 19, Praha</p>
                    <p>⏰ Po - So: 17:00 - 20:30</p>
                    <p>📞 722 272 252</p>
                  </div>
                </div>
              )}

              {/* POZNÁMKA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poznámka k objednávce
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Speciální požadavky, alergie, poznámky pro rozvoze..."
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base resize-none"
                />
              </div>

              {/* MOBILNÍ SUBMIT TLAČÍTKO - větší pro touch */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-success w-full py-4 text-base font-semibold touch-manipulation"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    {/* LOADING SPINNER SVG */}
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Odesílám...
                  </span>
                ) : (
                  `Objednat za ${finalPrice} Kč`
                )}
              </button>
            </form>
          </div>

          {/* SHRNUTÍ OBJEDNÁVKY - sticky na desktopu, normální flow na mobilu */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Vaše objednávka
            </h2>
            
            {/* SEZNAM PIZZ V OBJEDNÁVCE */}
            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.pizza._id} className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <h4 className="font-medium text-gray-900">{item.pizza.name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity}x {item.pizza.price} Kč
                    </p>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {item.quantity * item.pizza.price} Kč
                  </div>
                </div>
              ))}
            </div>

            <hr className="mb-4" />

            {/* CENOVÝ PŘEHLED */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Pizzy:</span>
                <span className="font-medium">{totalPrice} Kč</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {orderType === 'delivery' ? 'Rozvoz:' : 'Osobní odběr:'}
                </span>
                <span className="font-medium">
                  {deliveryFee > 0 ? `${deliveryFee} Kč` : 'Zdarma'}
                </span>
              </div>
              
              <hr className="my-3" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Celkem:</span>
                <span className="text-primary-600">{finalPrice} Kč</span>
              </div>
            </div>

            {/* PLATEBNÍ INFO */}
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
              <p className="font-medium mb-1">💳 Způsob platby:</p>
              <p>Hotově při převzetí</p>
              <p className="mt-2 text-xs">
                📞 Problém s objednávkou? Volejte: 722 272 252
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;