import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { reservationAPI } from '../services/api';

const Reservations = () => {
  // STAVY KOMPONENTY
  const { showSuccess, showError } = useToast(); // Toast notifikace
  const navigate = useNavigate(); // Navigace mezi stránkami
  const [loading, setLoading] = useState(false); // Loading stav formuláře
  const [success, setSuccess] = useState(false); // Zobrazení success stránky
  
  // FORMULÁŘ DATA - stav všech input polí
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '', // Prázdné - uživatel musí vybrat
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // ČASOVÉ SLOTY - pole dostupných časů
  const timeSlots = [
    '17:00', '17:15', '17:30', '17:45', 
    '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30'
  ];

  // FUNKCE PRO ZMĚNU INPUT HODNOT
  const handleChange = (e) => {
    // Destructuring - vytáhne name a value z input elementu
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev, // Spread - zkopíruje všechny stávající hodnoty
      [name]: value // Dynamický klíč - změní jen tu hodnotu co se edituje
    }));
  };

  // FUNKCE PRO ODESLÁNÍ FORMULÁŘE
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zabrání refresh stránky
    setLoading(true); // Zapne loading stav

    try {
      // VOLÁNÍ API PRO VYTVOŘENÍ REZERVACE
      const response = await reservationAPI.create(formData);
      console.log('Rezervace vytvořena:', response.data);
      
      // ÚSPĚCH - zobrazí success stránku
      setSuccess(true);
      showSuccess('Rezervace byla úspěšně odeslána!');
      
      // RESET FORMULÁŘE
      setFormData({
        date: '',
        time: '',
        guests: '',
        name: '',
        phone: '',
        email: '',
        notes: ''
      });
    } catch (error) {
      // CHYBA - zobrazí error toast
      console.error('Chyba při vytváření rezervace:', error);
      showError('Chyba při odesílání rezervace. Zkuste to znovu.');
    } finally {
      setLoading(false); // Vypne loading stav
    }
  };

  // SUCCESS STRÁNKA - zobrazí se po úspěšné rezervaci
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
            Rezervace potvrzena!
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            Vaše rezervace byla úspěšně odeslána. Brzy vás budeme kontaktovat pro potvrzení.
          </p>
          
          {/* MOBILNÍ OPTIMALIZOVANÉ TLAČÍTKO */}
          <button 
            onClick={() => navigate('/')} // Navigace na domovskou stránku
            className="btn btn-primary w-full py-3 text-base font-semibold touch-manipulation"
          >
            Zpět na hlavní stránku
          </button>
          
          {/* KONTAKTNÍ INFO */}
          <div className="mt-4 sm:mt-6 text-sm text-gray-500">
            <p>📞 Dotazy: 722 272 252</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-16">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* MOBILNÍ OPTIMALIZOVANÁ HLAVIČKA */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Rezervace stolu
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Rezervujte si stůl v naší pizzerii Pizza Fresca
          </p>
        </div>

        {/* RESPONZIVNÍ LAYOUT - na mobilu stack, na desktopu grid */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-12">
          
          {/* FORMULÁŘ REZERVACE */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Rezervační formulář
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              
              {/* DATUM A ČAS - na mobilu pod sebou, na tabletu vedle sebe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Datum *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]} // Minimální datum = dnes
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Čas *
                  </label>
                  {/* SELECT S ČASOVÝMI SLOTY */}
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  >
                    <option value="">Vyberte čas</option>
                    {/* MAP FUNKCE - projde timeSlots pole a vytvoří option pro každý čas */}
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* POČET HOSTŮ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Počet hostů *
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                >
                  <option value="">Vyberte počet hostů</option>
                  {/* ARRAY.FROM - vytvoří pole čísel 1-20 pro počet hostů */}
                  {Array.from({length: 20}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'host' : 'hostů'}
                    </option>
                  ))}
                </select>
              </div>

              {/* KONTAKTNÍ ÚDAJE */}
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
                  type="tel" // Speciální typ pro telefony - mobilní klávesnice
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="777 123 456"
                />
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

              {/* POZNÁMKA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poznámka (volitelné)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Speciální požadavky, oslava narozenin, dětská židlička..."
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base resize-none"
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
                  'Rezervovat stůl'
                )}
              </button>
            </form>
          </div>

          {/* INFORMAČNÍ PANEL */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* REZERVAČNÍ INFORMACE */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ℹ️ Informace o rezervaci
              </h3>
              <div className="space-y-3 text-gray-600 text-sm sm:text-base">
                <p>• Rezervace doporučujeme minimálně 24 hodin předem</p>
                <p>• Stůl držíme 15 minut od rezervovaného času</p>
                <p>• Pro skupiny nad 8 osob volejte přímo: 722 272 252</p>
                <p>• Možnost rezervace dětské židličky v poznámce</p>
                <p>• Rezervace je zdarma</p>
              </div>
            </div>

            {/* OTEVÍRACÍ DOBA */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🕐 Otevírací doba
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Pondělí - Sobota</span>
                  <span className="font-medium">17:00 - 20:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Neděle</span>
                  <span className="font-medium text-red-600">Odpočíváme</span>
                </div>
                <div className="mt-4 pt-4 border-t text-sm">
                  <p className="font-medium text-gray-700 mb-2">Dodatečné informace:</p>
                  <p>📍 Hany Kvapilové 19, Praha</p>
                  <p>📞 722 272 252</p>
                  <p>🍕 Každý den čerstvé těsto</p>
                </div>
              </div>
            </div>

            {/* RYCHLÉ AKCE - pouze na mobilu */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-4 sm:p-6 text-white lg:hidden">
              <h3 className="text-lg font-semibold mb-4">🚀 Rychlé akce</h3>
              <div className="space-y-3">
                <a 
                  href="tel:722272252" 
                  className="flex items-center justify-center w-full py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors touch-manipulation"
                >
                  📞 Zavolat přímo
                </a>
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center w-full py-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors touch-manipulation"
                >
                  🍕 Zobrazit menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;