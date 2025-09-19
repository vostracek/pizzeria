import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { pizzaAPI } from '../services/api';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();

  // KATEGORIE
  const categories = [
    { id: 'all', name: 'Všechny' },
    { id: 'klasické', name: 'Klasické' },
    { id: 'meat', name: 'Masové' },
    { id: 'vegetariánské', name: 'Vegetariánské' },
    { id: 'speciální', name: 'Speciální' }
  ];

  // NAČTENÍ PIZZ Z API
  useEffect(() => {
    const loadMenuItems = async () => {
      setLoading(true);
      try {
        const response = await pizzaAPI.getAll();
        console.log('Načtené pizzy:', response.data);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Chyba při načítání menu:', error);
        showError('Chyba při načítání menu');
        // Fallback - použije prázdné pole
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [showError]);

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (pizza) => {
    addToCart(pizza); // Předá celý pizza objekt s _id
    showSuccess(`${pizza.name} přidána do košíku!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO SECTION - MOBILNĚ OPTIMALIZOVANÝ */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Autentická italská pizza v Praze
          </h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Čerstvé těsto, prémiové ingredience a tradiční recepty z Neapole
          </p>
          
          {/* CTA BUTTONS - MOBILNĚ OPTIMALIZOVANÉ */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none sm:justify-center">
            <a
              href="#menu"
              className="bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center touch-manipulation"
            >
              🍕 Zobrazit menu
            </a>
            <a
              href="tel:722272252"
              className="bg-white bg-opacity-20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-opacity-30 transition-colors text-center touch-manipulation backdrop-blur-sm"
            >
              📞 Zavolat: 722 272 252
            </a>
          </div>
        </div>
      </section>

      {/* STATS SECTION - RESPONZIVNÍ GRID */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">5+</div>
              <div className="text-sm sm:text-base text-gray-600">Let zkušeností</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">{menuItems.length}+</div>
              <div className="text-sm sm:text-base text-gray-600">Druhů pizz</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">24h</div>
              <div className="text-sm sm:text-base text-gray-600">Zrající těsto</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">480°C</div>
              <div className="text-sm sm:text-base text-gray-600">Kamenná pec</div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* HLAVIČKA MENU */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Naše menu
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Každá pizza je připravená z čerstvých ingrediencí a pečená v kamenné peci při 480°C
            </p>
          </div>

          {/* KATEGORIE FILTRY - MOBILNÍ SCROLL */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-3 sm:gap-4 min-w-max sm:justify-center px-4 sm:px-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap touch-manipulation ${
                    activeCategory === category.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4 sm:p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* MENU ITEMS GRID - RESPONZIVNÍ */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((pizza) => (
                <div key={pizza._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  
                  {/* PIZZA OBRÁZEK S CENOU */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={pizza.image} 
                      alt={pizza.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
                      }}
                    />
                    
                    {/* CENA BADGE */}
                    <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                      {pizza.price} Kč
                    </div>
                    
                    {/* KATEGORIE BADGE */}
                    <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                      {categories.find(cat => cat.id === pizza.category)?.name}
                    </div>

                    {/* QUICK ADD OVERLAY - POUZE NA HOVER/TOUCH */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <button 
                        className="bg-white text-primary-600 px-4 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg touch-manipulation"
                        onClick={() => handleAddToCart(pizza)}
                      >
                        Rychle přidat
                      </button>
                    </div>
                  </div>
                  
                  {/* PIZZA INFO */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 leading-tight">
                      {pizza.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
                      {pizza.description}
                    </p>
                    
                    {/* INGREDIENCE */}
                    {pizza.ingredients && pizza.ingredients.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {pizza.ingredients.join(', ')}
                        </p>
                      </div>
                    )}
                    
                    {/* ADD TO CART BUTTON - MOBILNĚ OPTIMALIZOVANÉ */}
                    <button
                      onClick={() => handleAddToCart(pizza)}
                      disabled={!pizza.available}
                      className={`w-full py-3 sm:py-2 rounded-lg font-semibold transition-all duration-200 text-base sm:text-sm touch-manipulation ${
                        pizza.available 
                          ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg active:scale-95'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {pizza.available ? (
                        <>
                          🍕 Přidat do košíku - {pizza.price} Kč
                        </>
                      ) : (
                        'Momentálně nedostupná'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRÁZDNÝ STAV PRO FILTROVÁNÍ */}
          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍕</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {menuItems.length === 0 ? 'Menu se načítá...' : 'Žádné pizzy v této kategorii'}
              </h3>
              <p className="text-gray-600">
                {menuItems.length === 0 
                  ? 'Nebo zkontrolujte připojení k internetu a obnovte stránku.'
                  : 'Zkuste vybrat jinou kategorii nebo se podívejte na všechny pizzy.'
                }
              </p>
              {menuItems.length > 0 && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="mt-4 btn btn-primary"
                >
                  Zobrazit všechny pizzy
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION - MOBILNĚ OPTIMALIZOVANÁ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl sm:rounded-2xl shadow-xl text-white text-center p-6 sm:p-8 lg:p-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              🍕 Ochutnejte rozdíl!
            </h2>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Přijďte k nám ochutnat pizzu připravenou s láskou podle tradičních italských receptů. Každý kousek je příběh.
            </p>
            
            {/* CTA TLAČÍTKA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <Link 
                to="/reservations"
                className="flex-1 bg-white text-primary-600 px-6 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center touch-manipulation"
              >
                📅 Rezervovat stůl
              </Link>
              <a 
                href="tel:722272252"
                className="flex-1 bg-white bg-opacity-20 text-white px-6 py-3 sm:py-4 rounded-lg font-semibold hover:bg-opacity-30 transition-colors text-center touch-manipulation backdrop-blur-sm"
              >
                📞 Zavolat
              </a>
            </div>
            
            {/* KONTAKTNÍ INFO */}
            <div className="mt-6 sm:mt-8 text-sm sm:text-base opacity-80">
              <p>📍 Hany Kvapilové 19, Praha 4</p>
              <p>🕐 Pondělí - Sobota: 17:00 - 20:30</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;