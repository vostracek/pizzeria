import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { addToCart } = useCart();
  const { showSuccess } = useToast();

  // DATA ZE SEED SOUBORU - PŘESNĚ STEJNÁ JAKO V BACKENDU
  const mockMenuItems = [
    {
      _id: '1',
      name: "MARGHERITA",
      description: "Italské rajčata san marzano, bazalka, olivový olej, sůl",
      price: 140,
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
      category: "klasické",
      ingredients: ["rajčatová omáčka", "mozzarella", "bazalka", "olivový olej"],
      available: true
    },
    {
      _id: '2',
      name: "FUNGHI",
      description: "Čerstvé žampiony, česnek, petržel, olivový olej",
      price: 140,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
      category: "vegetariánské",
      ingredients: ["rajčatová omáčka", "mozzarella", "žampiony", "česnek", "petržel"],
      available: true
    },
    {
      _id: '3',
      name: "GORGONZOLA",
      description: "Gorgonzola sýr, ořechy, med",
      price: 190,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
      category: "speciální",
      ingredients: ["rajčatová omáčka", "mozzarella", "gorgonzola", "ořechy", "med"],
      available: true
    },
    {
      _id: '4',
      name: "SPINACI",
      description: "Čerstvý špenát, ricotta, česnek",
      price: 160,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
      category: "vegetariánské",
      ingredients: ["rajčatová omáčka", "mozzarella", "špenát", "ricotta", "česnek"],
      available: true
    },
    {
      _id: '5',
      name: "PROSCIUTTO",
      description: "Parma šunka, rukola, parmazán",
      price: 210,
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500",
      category: "meat",
      ingredients: ["rajčatová omáčka", "mozzarella", "prosciutto", "rukola", "parmazán"],
      available: true
    },
    {
      _id: '6',
      name: "QUATTRO FORMAGGI",
      description: "Čtyři druhy sýrů - mozzarella, gorgonzola, parmazán, pecorino",
      price: 190,
      image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500",
      category: "speciální",
      ingredients: ["mozzarella", "gorgonzola", "parmazán", "pecorino"],
      available: true
    },
    {
      _id: '7',
      name: "PEPPERONI",
      description: "Pikantní salám pepperoni, olivy",
      price: 170,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
      category: "meat",
      ingredients: ["rajčatová omáčka", "mozzarella", "pepperoni", "olivy"],
      available: true
    },
    {
      _id: '8',
      name: "NAPOLETANA",
      description: "Ančovičky, kapary, olivy, oregano",
      price: 170,
      image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500",
      category: "klasické",
      ingredients: ["rajčatová omáčka", "mozzarella", "ančovičky", "kapary", "olivy", "oregano"],
      available: true
    },
    {
      _id: '9',
      name: "PROSCIUTTO & RUCOLA",
      description: "Prosciutto di Parma, čerstvá rukola, parmazán, olivový olej",
      price: 210,
      image: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=500",
      category: "meat",
      ingredients: ["rajčatová omáčka", "mozzarella", "prosciutto di Parma", "rukola", "parmazán"],
      available: true
    },
    {
      _id: '10',
      name: "CALZONE FORMAGGIO",
      description: "Zavřená pizza plněná třemi sýry",
      price: 170,
      image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500",
      category: "speciální",
      ingredients: ["mozzarella", "ricotta", "parmazán", "bazalka"],
      available: true
    }
  ];

  // KATEGORIE PODLE BACKENDU
  const categories = [
    { id: 'all', name: 'Všechny' },
    { id: 'klasické', name: 'Klasické' },
    { id: 'meat', name: 'Masové' },
    { id: 'vegetariánské', name: 'Vegetariánské' },
    { id: 'speciální', name: 'Speciální' }
  ];

  useEffect(() => {
    const loadMenuItems = async () => {
      setLoading(true);
      // Simulace načítání
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMenuItems(mockMenuItems);
      setLoading(false);
    };

    loadMenuItems();
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (pizza) => {
    addToCart(pizza);
    showSuccess(`${pizza.name} přidána do košíku!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Autentická italská pizza v Praze
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Čerstvé těsto, prémiové ingredience a tradiční recepty z Neapole
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#menu"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Zobrazit menu
            </a>
            <a
              href="tel:722272252"
              className="bg-white bg-opacity-20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
            >
              Zavolat: 722 272 252
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">5+</div>
              <div className="text-gray-600">Let zkušeností</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">10</div>
              <div className="text-gray-600">Druhů pizz</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">24h</div>
              <div className="text-gray-600">Zrající těsto</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">480°C</div>
              <div className="text-gray-600">Kamenná pec</div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Naše menu
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Každá pizza je připravená z čerstvých ingrediencí a pečená v kamenné peci při 480°C
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Menu Items Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((pizza) => (
                <div key={pizza._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={pizza.image} 
                      alt={pizza.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500';
                      }}
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{pizza.name}</h3>
                      <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                        {categories.find(cat => cat.id === pizza.category)?.name}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 text-sm">{pizza.description}</p>
                    
                    {/* Ingredience */}
                    {pizza.ingredients && pizza.ingredients.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">
                          {pizza.ingredients.join(', ')}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {pizza.price} Kč
                      </div>
                      <button
                        onClick={() => handleAddToCart(pizza)}
                        disabled={!pizza.available}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          pizza.available 
                            ? 'bg-primary-500 text-white hover:bg-primary-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {pizza.available ? 'Do košíku' : 'Nedostupné'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Žádné pizzy nenalezeny v kategorii "{categories.find(cat => cat.id === activeCategory)?.name}"
              </h3>
              <p className="text-gray-600">
                Zkuste vybrat jinou kategorii
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Proč si vybrat Pizza Fresca?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Čerstvé ingredience</h3>
              <p className="text-gray-600">
                Všechny ingredience dovážíme denně od ověřených dodavatelů z Itálie
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Kamenná pec</h3>
              <p className="text-gray-600">
                Pečeme při 480°C pro autentickou italskou chuť a křupavý okraj
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Rychlé doručení</h3>
              <p className="text-gray-600">
                Doručíme za 30-45 minut přímo k vám domů nebo si vyzvednete
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Máte chuť na autentickou italskou pizzu?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Objednejte si ještě dnes a ochutnejte rozdíl pravé neapolské pizzy
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link 
                to="/cart"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Zobrazit košík
              </Link>
              <Link 
                to="/reservations"
                className="bg-white bg-opacity-20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
              >
                Rezervovat stůl
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;