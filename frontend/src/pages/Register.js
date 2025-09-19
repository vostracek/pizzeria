import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate(); // Hook pro navigaci mezi stránkami
  const { showError, showSuccess } = useToast(); // Toast notifikace z contextu
  const [loading, setLoading] = useState(false); // Stav loading při odesílání formuláře
  const [showPassword, setShowPassword] = useState(false); // Zobrazit/skrýt heslo
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Zobrazit/skrýt potvrzení hesla
  
  // ROZŠÍŘENÝ FORMULÁŘ S ADRESOU A TELEFONEM
  const [formData, setFormData] = useState({
    name: '',           // Jméno a příjmení
    email: '',          // Email adresa
    phone: '',          // Telefon - NOVÉ POLE
    password: '',       // Heslo
    confirmPassword: '', // Potvrzení hesla
    street: '',         // Ulice a číslo popisné - NOVÉ POLE
    city: '',           // Město - NOVÉ POLE
    zipCode: ''         // PSČ - NOVÉ POLE
  });

  // FUNKCE PRO ZMĚNU HODNOT FORMULÁŘE
  const handleChange = (e) => {
    setFormData({
      ...formData,                    // Zkopíruje všechny stávající hodnoty
      [e.target.name]: e.target.value // Aktualizuje pouze změněné pole
    });
  };

  // VALIDACE FORMULÁŘE PŘED ODESLÁNÍM
  const validateForm = () => {
    // Kontrola prázdných polí
    if (!formData.name.trim()) {
      showError('Zadejte prosím vaše jméno');
      return false;
    }
    
    if (!formData.email.trim()) {
      showError('Zadejte prosím email');
      return false;
    }
    
    // Validace emailu pomocí regulárního výrazu
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showError('Zadejte prosím platný email');
      return false;
    }

    // Kontrola telefonu - nepovinné, ale pokud je zadané, musí mít správný formát
    if (formData.phone && !/^[+]?[\d\s\-()]{9,}$/.test(formData.phone.trim())) {
      showError('Zadejte prosím platné telefonní číslo');
      return false;
    }
    
    // Kontrola délky hesla
    if (formData.password.length < 6) {
      showError('Heslo musí mít alespoň 6 znaků');
      return false;
    }
    
    // Kontrola shodnosti hesel
    if (formData.password !== formData.confirmPassword) {
      showError('Hesla se neshodují');
      return false;
    }
    
    return true;
  };

  // FUNKCE PRO ODESLÁNÍ FORMULÁŘE
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zabrání obnovení stránky
    
    if (!validateForm()) return; // Pokud validace neprošla, zastav
    
    setLoading(true); // Zapni loading animaci
    
    try {
      // PŘÍPRAVA DAT PRO API - struktura podle User modelu
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || undefined, // Pokud prázdné, pošle undefined
        address: {
          street: formData.street.trim() || undefined,
          city: formData.city.trim() || undefined, 
          zipCode: formData.zipCode.trim() || undefined
        }
      };

      // API VOLÁNÍ PRO REGISTRACI
      const response = await api.post('/auth/register', registrationData);
      
      // ÚSPĚŠNÁ REGISTRACE
      showSuccess('Účet byl úspěšně vytvořen! Můžete se přihlásit.');
      navigate('/login'); // Přesměruj na přihlášení
      
    } catch (error) {
      // ZACHYTÍ CHYBU Z BACKENDU
      const message = error.response?.data?.error || 'Chyba při vytváření účtu';
      showError(message);
      console.error('Registrace chyba:', error);
    } finally {
      setLoading(false); // Vypni loading animaci
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* HLAVIČKA S LOGEM */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-600 mb-2">
              🍕 Pizza Fresca
            </h1>
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Vytvořit účet
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Zaregistrujte se pro rychlejší objednávání s uloženými údaji
          </p>
        </div>

        {/* REGISTRAČNÍ FORMULÁŘ */}
        <div className="bg-white py-6 px-4 shadow-lg rounded-xl sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* ZÁKLADNÍ ÚDAJE */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Základní údaje
              </h3>
              
              {/* JMÉNO A PŘÍJMENÍ */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Celé jméno *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="Jan Novák"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="jan@email.cz"
                />
              </div>

              {/* TELEFON - NOVÉ POLE */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon (doporučeno pro rychlejší objednávání)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel" // Speciální typ pro telefony - zobrazí číselnou klávesnici na mobilu
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="777 123 456"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Telefon urychlí potvrzení objednávky a umožní přímé objednávání z košíku
                </p>
              </div>
            </div>

            {/* ADRESA - NOVÁ SEKCE */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Adresa (volitelné - pro rychlejší rozvoz)
              </h3>
              
              {/* ULICE */}
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                  Ulice a číslo popisné
                </label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  autoComplete="street-address"
                  value={formData.street}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="Wenceslas Square 1"
                />
              </div>

              {/* MĚSTO A PSČ - VEDLE SEBE NA TABLETU/DESKTOPU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Město
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="Praha"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    PSČ
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    autoComplete="postal-code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="110 00"
                  />
                </div>
              </div>
            </div>

            {/* HESLA */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Zabezpečení
              </h3>
              
              {/* HESLO */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Heslo *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} // Dynamicky mění typ podle stavu
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="Alespoň 6 znaků"
                  />
                  {/* TLAČÍTKO PRO ZOBRAZENÍ/SKRYTÍ HESLA */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle stavu
                    className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation"
                  >
                    <svg 
                      className="h-5 w-5 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        // Ikona pro skrytí hesla
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        // Ikona pro zobrazení hesla
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* POTVRZENÍ HESLA */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Potvrzení hesla *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-4 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="Zopakujte heslo"
                  />
                  {/* TLAČÍTKO PRO ZOBRAZENÍ/SKRYTÍ POTVRZENÍ HESLA */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation"
                  >
                    <svg 
                      className="h-5 w-5 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* SUBMIT TLAČÍTKO */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading} // Zakáže tlačítko během loading
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 touch-manipulation"
              >
                {loading ? (
                  // LOADING ANIMACE
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Vytváří se účet...
                  </>
                ) : (
                  // NORMÁLNÍ STAV
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Vytvořit účet
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ODKAZ NA PŘIHLÁŠENÍ */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Už máte účet?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Přihlaste se
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RYCHLÉ AKCE PRO NEREGISTROVANÉ */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            🍕 Objednejte si i bez registrace
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

export default Register;