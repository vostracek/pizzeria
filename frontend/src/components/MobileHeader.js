import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const totalItems = getTotalItems();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* HLAVNÍ HEADER */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            
            {/* LOGO */}
            <Link 
              to="/" 
              onClick={closeMenu}
              className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
            >
              Pizza Fresca
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="nav-link">Domů</Link>
              <Link to="/about" className="nav-link">O nás</Link>
              <Link to="/how-its-made" className="nav-link">Jak vzniká pizza</Link>
              <Link to="/reservations" className="nav-link">Rezervace</Link>
              <Link to="/contact" className="nav-link">Kontakt</Link>
              
              <Link to="/cart" className="nav-link relative">
                Košík
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 hidden lg:block">Ahoj, {user.name}!</span>
                  {user.role === 'admin' && (
                    <div className="relative group">
                      <span className="nav-link cursor-pointer">Admin ▼</span>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                        <Link to="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Objednávky</Link>
                        <Link to="/admin/reservations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rezervace</Link>
                        <Link to="/admin/menu" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Menu</Link>
                      </div>
                    </div>
                  )}
                  <button onClick={logout} className="btn btn-primary text-sm px-4 py-2">
                    Odhlásit
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link 
                    to="/login" 
                    className="btn btn-outline text-sm px-4 py-2 border border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    Přihlásit
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary text-sm px-4 py-2"
                  >
                    Registrovat
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILNÍ TLAČÍTKA */}
            <div className="md:hidden flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 touch-manipulation">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 4M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z"></path>
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none touch-manipulation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILNÍ MENU OVERLAY */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMenu}
          />
          
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 overflow-y-auto">
            <div className="p-4">
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={closeMenu}
                  className="p-2 text-gray-500 hover:text-gray-700 touch-manipulation"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-4">
                <Link 
                  to="/" 
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                    isActivePath('/') 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🏠 Domů
                </Link>
                
                <Link 
                  to="/about" 
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                    isActivePath('/about') 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ℹ️ O nás
                </Link>
                
                <Link 
                  to="/how-its-made" 
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                    isActivePath('/how-its-made') 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🍕 Jak vzniká pizza
                </Link>
                
                <Link 
                  to="/reservations" 
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                    isActivePath('/reservations') 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  📅 Rezervace
                </Link>
                
                <Link 
                  to="/contact" 
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                    isActivePath('/contact') 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  📞 Kontakt
                </Link>

                {/* RYCHLÉ OBJEDNÁNÍ SEKCE */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    🍕 Objednejte si rychle
                  </h3>
                  
                  <div className="space-y-3">
                    <a
                      href="tel:722272252"
                      onClick={closeMenu}
                      className="flex items-center justify-center w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-base touch-manipulation"
                    >
                      📞 Zavolat: 722 272 252
                    </a>

                    <Link
                      to="/"
                      onClick={closeMenu}
                      className="flex items-center justify-center w-full py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-base touch-manipulation"
                    >
                      🍕 Zobrazit menu
                    </Link>
                  </div>
                </div>

                {/* PŘIHLÁŠENÍ SEKCE */}
                {isAuthenticated ? (
                  <div className="border-t pt-4 mt-6">
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Přihlášen jako: {user.name}
                    </div>
                    
                    {user.role === 'admin' && (
                      <>
                        <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b mb-2">
                          Admin panel:
                        </div>
                        <Link to="/admin" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 touch-manipulation">
                          📊 Dashboard
                        </Link>
                        <Link to="/admin/orders" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 touch-manipulation">
                          📦 Objednávky
                        </Link>
                        <Link to="/admin/reservations" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 touch-manipulation">
                          📋 Rezervace
                        </Link>
                        <Link to="/admin/menu" onClick={closeMenu} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 touch-manipulation">
                          🍕 Menu
                        </Link>
                      </>
                    )}
                    
                    <button 
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full text-left px-4 py-3 mt-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 touch-manipulation"
                    >
                      🚪 Odhlásit
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-4 mt-6 space-y-2">
                    <Link 
                      to="/login" 
                      onClick={closeMenu}
                      className="block w-full text-center py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium touch-manipulation"
                    >
                      Přihlásit se
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={closeMenu}
                      className="block w-full text-center py-3 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors font-medium touch-manipulation"
                    >
                      Registrovat
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileHeader;