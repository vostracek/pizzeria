import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  // STAVY KOMPONENTY
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false); // Loading stav formuláře
  const [showPassword, setShowPassword] = useState(false); // Toggle pro zobrazení hesla
  const [errors, setErrors] = useState({}); // Objekt s chybami validace
  
  // HOOKY Z CONTEXTŮ
  const { register } = useAuth(); // Funkce pro registraci z AuthContext
  const { showSuccess, showError } = useToast(); // Toast notifikace
  const navigate = useNavigate(); // Navigace mezi stránkami

  // FUNKCE PRO ZMĚNU INPUTŮ
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructuring - vytáhne name a value z inputu
    
    setFormData(prev => ({
      ...prev, // Spread operator - zkopíruje všechny staré hodnoty
      [name]: value // Dynamický klíč - změní hodnotu podle name inputu
    }));
    
    // Vymaže chybu pokud uživatel začne psát
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '' // Nastaví chybu na prázdný string
      }));
    }
  };

  // VALIDACE FORMULÁŘE
  const validateForm = () => {
    const newErrors = {}; // Objekt pro sběr chyb

    if (!formData.name.trim()) { // .trim() odstraní mezery na začátku/konci
      newErrors.name = 'Jméno je povinné';
    }

    if (!formData.email) {
      newErrors.email = 'Email je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // RegEx pro validaci emailu
      newErrors.email = 'Neplatný email';
    }

    if (!formData.password) {
      newErrors.password = 'Heslo je povinné';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Heslo musí mít alespoň 6 znaků';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hesla se neshodují';
    }

    setErrors(newErrors); // Nastaví všechny chyby najednou
    return Object.keys(newErrors).length === 0; // Vrátí true pokud není žádná chyba
  };

  // ODESLÁNÍ FORMULÁŘE
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zabrání refresh stránky
    
    if (!validateForm()) { // Pokud validace neprošla, ukonči funkci
      return;
    }

    setLoading(true); // Zapne loading stav

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      showSuccess('Registrace proběhla úspěšně! Nyní se můžete přihlásit.');
      navigate('/login');
    } else {
      showError(result.error || 'Chyba při registraci');
    }
    
    setLoading(false); // Vypne loading stav
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      
      {/* MOBILNÍ HLAVIČKA */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">
            Pizza Fresca
          </h1>
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">🍕</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Vytvořte si účet
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Už máte účet?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 touch-manipulation">
              Přihlaste se zde
            </Link>
          </p>
        </div>
      </div>

      {/* FORMULÁŘ */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-xl rounded-xl sm:px-8 sm:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* INPUT - JMÉNO */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                👤 Celé jméno
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-4 text-base border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors touch-manipulation ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Jan Novák"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* INPUT - EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-4 text-base border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors touch-manipulation ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="jan@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* INPUT - HESLO */}
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
                  className={`w-full px-4 py-4 pr-12 text-base border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors touch-manipulation ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Minimálně 6 znaků"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center touch-manipulation"
                >
                  {showPassword ? (
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* INPUT - POTVRZENÍ HESLA */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                🔓 Potvrzení hesla
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-4 text-base border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors touch-manipulation ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Zadejte heslo znovu"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* CHECKBOX - SOUHLAS S PODMÍNKAMI */}
            <div className="flex items-start">
              <input
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                required
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded touch-manipulation mt-1"
              />
              <label htmlFor="accept-terms" className="ml-3 block text-sm text-gray-900 leading-relaxed">
                Souhlasím s{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500 underline">
                  obchodními podmínkami
                </Link>{' '}
                a{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500 underline">
                  zpracováním osobních údajů
                </Link>
              </label>
            </div>

            {/* TLAČÍTKO ODESLÁNÍ */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 touch-manipulation"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registruji...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  Vytvořit účet
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;