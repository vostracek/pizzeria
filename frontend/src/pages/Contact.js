import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* HLAVIČKA */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            Kontaktujte nás
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Máte otázky, připomínky nebo chcete udělat speciální objednávku? 
            Rádi se s vámi spojíme!
          </p>
        </div>

        {/* KONTAKTNÍ INFORMACE - MOBILNĚ OPTIMALIZOVANÉ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* PŘÍMÝ KONTAKT */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
              📞 Přímý kontakt
            </h2>
            
            {/* TELEFON */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">Telefon</div>
                  <a 
                    href="tel:722272252"
                    className="text-lg font-semibold text-green-600 hover:text-green-700 transition-colors touch-manipulation"
                  >
                    722 272 252
                  </a>
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">Email</div>
                  <a 
                    href="mailto:info@pizzafresca.cz"
                    className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors touch-manipulation"
                  >
                    info@pizzafresca.cz
                  </a>
                </div>
              </div>
            </div>

            {/* ADRESA */}
            <div>
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">Adresa</div>
                  <a 
                    href="https://maps.google.com/?q=Hany+Kvapilové+19,+Praha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-purple-600 hover:text-purple-700 transition-colors touch-manipulation"
                  >
                    Hany Kvapilové 19, Praha
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* OTEVÍRACÍ DOBA */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
              🕐 Otevírací doba
            </h2>
            
            <div className="space-y-4">
              {/* PRACOVNÍ DNY */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">Pondělí - Sobota</div>
                  <div className="text-sm text-gray-600">Objednávky a rozvoz</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">17:00 - 20:30</div>
                  <div className="text-sm text-green-600 font-medium">Otevřeno</div>
                </div>
              </div>

              {/* NEDĚLE */}
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">Neděle</div>
                  <div className="text-sm text-gray-600">Den odpočinku</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">Zavřeno</div>
                  <div className="text-sm text-red-600">Odpočíváme</div>
                </div>
              </div>
            </div>

            {/* DODATEČNÉ INFORMACE */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">📋 Dodatečné informace:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Rozvoz: Po-So 17:00-20:00</li>
                <li>• Osobní odběr: Po-So 17:00-20:30</li>
                <li>• Poslední objednávka: 30 min před zavřením</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RYCHLÉ AKCE - MOBILNĚ OPTIMALIZOVANÉ */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-xl text-white text-center p-6 sm:p-8 lg:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            🍕 Máte chuť na pizzu?
          </h2>
          <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Zavolejte nám nebo si objednejte online. Připravíme vám čerstvou pizzu podle tradičních italských receptů!
          </p>
          
          {/* AKČNÍ TLAČÍTKA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
            <a 
              href="tel:722272252"
              className="flex-1 bg-white text-primary-600 px-6 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center touch-manipulation"
            >
              📞 Zavolat hned
            </a>
            <a 
              href="/"
              className="flex-1 bg-white bg-opacity-20 text-white px-6 py-3 sm:py-4 rounded-lg font-semibold hover:bg-opacity-30 transition-colors text-center touch-manipulation backdrop-blur-sm"
            >
              🍕 Online menu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;