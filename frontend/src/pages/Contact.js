import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const Contact = () => {
  // STAVY KOMPONENTY
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false); // Loading stav formuláře
  const [success, setSuccess] = useState(false); // Success stav po odeslání
  
  const { showSuccess, showError } = useToast(); // Toast notifikace

  // FUNKCE PRO ZMĚNU INPUT HODNOT
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructuring z input elementu
    setFormData(prev => ({
      ...prev, // Spread - zkopíruje stávající hodnoty
      [name]: value // Dynamický klíč - upraví konkrétní pole
    }));
  };

  // FUNKCE PRO ODESLÁNÍ FORMULÁŘE
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zabrání refresh stránky
    setLoading(true); // Zapne loading stav

    try {
      // SIMULACE API VOLÁNÍ - v reálné aplikaci by zde byl fetch
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ÚSPĚCH - zobrazí success stránku
      setSuccess(true);
      showSuccess('Zpráva byla úspěšně odeslána!');
      
      // RESET FORMULÁŘE
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      // CHYBA - zobrazí error toast
      showError('Chyba při odesílání zprávy. Zkuste to znovu.');
    } finally {
      setLoading(false); // Vypne loading stav
    }
  };

  // SUCCESS STRÁNKA KOMPONENTA
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
          {/* SUCCESS IKONA */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Zpráva odeslána!
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            Děkujeme za vaši zprávu. Odpovíme vám co nejdříve!
          </p>
          
          {/* MOBILNÍ OPTIMALIZOVANÉ TLAČÍTKO */}
          <button 
            onClick={() => setSuccess(false)} // Vrátí se na formulář
            className="btn btn-primary w-full py-3 text-base font-semibold touch-manipulation"
          >
            Poslat další zprávu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* MOBILNÍ OPTIMALIZOVANÁ HLAVIČKA */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Kontaktujte nás
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Máte otázky, připomínky nebo chcete udělat speciální objednávku? 
            Rádi se s vámi spojíme!
          </p>
        </div>

        {/* RESPONZIVNÍ LAYOUT - na mobilu stack, na desktopu grid */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12">
          
          {/* KONTAKTNÍ FORMULÁŘ */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Napište nám zprávu
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              
              {/* JMÉNO A EMAIL - na mobilu pod sebou, na tabletu vedle sebe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jméno *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="Vaše jméno"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email" // Automaticky validuje email
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="vas@email.cz"
                  />
                </div>
              </div>

              {/* TELEFON */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon (volitelné)
                </label>
                <input
                  type="tel" // Speciální typ pro telefony - mobilní klávesnice
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="777 123 456"
                />
              </div>

              {/* ZPRÁVA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zpráva *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base resize-none"
                  placeholder="Vaše zpráva, dotaz nebo připomínka..."
                />
              </div>

              {/* MOBILNÍ SUBMIT TLAČÍTKO */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full py-4 text-base font-semibold touch-manipulation"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    {/* LOADING SPINNER */}
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Odesílám...
                  </span>
                ) : (
                  'Odeslat zprávu'
                )}
              </button>
            </form>
          </div>

          {/* KONTAKTNÍ INFORMACE */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* PŘÍMÝ KONTAKT */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Přímý kontakt
              </h3>
              <div className="space-y-4">
                
                {/* TELEFON - klikací na mobilu */}
                <a 
                  href="tel:722272252"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors touch-manipulation"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Telefon</div>
                    <div className="text-green-600 font-medium">722 272 252</div>
                  </div>
                </a>

                {/* EMAIL - klikací na mobilu */}
                <a 
                  href="mailto:info@pizzafresca.cz"
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors touch-manipulation"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-blue-600 font-medium">info@pizzafresca.cz</div>
                  </div>
                </a>

                {/* ADRESA - klikací na mobilu pro mapy */}
                <a 
                  href="https://maps.google.com/?q=Hany+Kvapilové+19,+Praha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors touch-manipulation"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Adresa</div>
                    <div className="text-purple-600 font-medium">Hany Kvapilové 19, Praha</div>
                  </div>
                </a>
              </div>
            </div>

            {/* OTEVÍRACÍ DOBA */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Otevírací doba
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Pondělí - Sobota</span>
                  <span className="font-semibold text-primary-600">17:00 - 20:30</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-700">Neděle</span>
                  <span className="font-semibold text-red-600">Odpočíváme</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                  <p className="mb-2 font-medium text-gray-700">Dodatečné informace:</p>
                  <ul className="space-y-1">
                    <li>• Rozvoz: Po-So 17:00-20:00</li>
                    <li>• Osobní odběr: Po-So 17:00-20:30</li>
                    <li>• Poslední objednávka: 30 min před zavíračkou</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RYCHLÉ AKCE - pouze na mobilu */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-4 sm:p-6 text-white lg:hidden">
              <h3 className="text-lg font-semibold mb-4">Rychlé akce</h3>
              <div className="space-y-3">
                <a 
                  href="tel:722272252" 
                  className="flex items-center justify-center w-full py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors touch-manipulation"
                >
                  Zavolat nyní
                </a>
                <a 
                  href="/"
                  className="flex items-center justify-center w-full py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors touch-manipulation"
                >
                  Zobrazit menu
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;