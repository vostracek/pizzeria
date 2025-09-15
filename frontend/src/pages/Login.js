import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  // STAVY KOMPONENTY
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); // Loading stav při odesílání
  const [showPassword, setShowPassword] = useState(false); // Toggle pro zobrazení hesla
  
  // HOOKS Z CONTEXTŮ
  const { login } = useAuth(); // Login funkce z AuthContext
  const { showSuccess, showError } = useToast(); // Toast notifikace
  const navigate = useNavigate(); // Navigace mezi stránkami

  // FUNKCE PRO ZMĚNU INPUT HODNOT
  const handleChange = (e) => {
    setFormData({
      ...formData, // Spread - zkopíruje všechny stávající hodnoty
      [e.target.name]: e.target.value // Dynamický klíč - změní jen editovanou hodnotu
    });
  };

  // FUNKCE PRO ODESLÁNÍ FORMULÁŘE
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zabrání refresh stránky
    setLoading(true); // Zapne loading stav

    // VOLÁNÍ LOGIN FUNKCE
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // ÚSPĚCH - zobrazí toast a přesměruje
      showSuccess('Úspěšně jste se přihlásili!');
      navigate('/');
    } else {
      // CHYBA - zobrazí error toast
      showError(result.error || 'Chyba při přihlašování');
    }
    
    setLoading(false); // Vypne loading stav
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      
      {/* MOBILNÍ OPTIMALIZOVANÁ HLAVIČKA */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* LOGO S GRADIENTEM */}
          <div className="mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Pizza Fresca
            </h1>
            <p className="text-sm text-gray-500 mt-1">Dosta & Pizza & Bito</p>
          </div>
          
          {/* PIZZA IKONA */}
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">🍕</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Vítejte zpět!
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Přihlaste se do svého účtu
          </p>
        </div>
      </div>

      {/* HLAVNÍ FORMULÁŘ */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-xl rounded-xl sm:px-8 sm:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* EMAIL INPUT */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email adresa
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="appearance-none block w-full px-4 py-4 text-base border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all touch-manipulation"
                  placeholder="vas@email.cz"
                />
                {/* EMAIL IKONA */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* HESLO INPUT S TOGGLE ZOBRAZENÍ */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Heslo
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="appearance-none block w-full px-4 py-4 pr-12 text-base border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all touch-manipulation"
                  placeholder="Vaše heslo"
                />
                {/* TLAČÍTKO PRO ZOBRAZENÍ/SKRYTÍ HESLA */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center touch-manipulation"
                >
                  {showPassword ? (
                    <svg className="h-6 w-6 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* ZAPAMATOVAT A ZAPOMENUTÉ HESLO */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded touch-manipulation"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-900">
                  Zapamatovat si mě
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 touch-manipulation">
                  Zapomenuté heslo?
                </Link>
              </div>
            </div>

            {/* SUBMIT TLAČÍTKO */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 touch-manipulation"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Přihlašuji...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"></path>
                    </svg>
                    Přihlásit se
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* REGISTRACE LINK */}
          <div className="mt-6 text-center">
            <p className="text-base text-gray-600">
              Ještě nemáte účet?
            </p>
            <Link
              to="/register"
              className="mt-2 w-full flex justify-center py-3 px-4 border border-primary-500 rounded-lg text-base font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 touch-manipulation"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Vytvořit nový účet
            </Link>
          </div>
        </div>
      </div>

      {/* RYCHLÉ AKCE PRO MOBILY */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            🍕 Objednejte si rychle
          </h3>
          
          <div className="space-y-3">
            <a
              href="tel:722272252"
              className="flex items-center justify-center w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-base touch-manipulation"
            >
              📞 Zavolat: 722 272 252
            </a>

            <Link
              to="/"
              className="flex items-center justify-center w-full py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-base touch-manipulation"
            >
              🍕 Zobrazit menu
            </Link>
          </div>
        </div>
      </div>

      {/* KONTAKTNÍ INFO */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>📍 Hany Kvapilové 19, Praha</p>
        <p>🕐 Po - So: 17:00 - 20:30</p>
      </div>
    </div>
  );
};

export default Login;
