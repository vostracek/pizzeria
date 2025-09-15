import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO SEKCE S MOBILNÍM DESIGNEM */}
      <section className="relative bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* BACKGROUND PATTERN - jen na větších obrazovkách */}
        <div className="absolute inset-0 opacity-20 hidden sm:block">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Naše příběh
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Pizza Fresca - kde se tradice potkává s čerstvostí
          </p>
        </div>
      </section>

      {/* MAIN CONTENT - MOBILNÍ OPTIMALIZOVANÝ LAYOUT */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* PŘÍBĚH PIZZERIE */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                <div className="order-2 lg:order-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                    🍕 Jak to všechno začalo
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p className="text-base sm:text-lg">
                      Pizza Fresca vznikla z lásky k autentické italské kuchyni. 
                      Naši zakladatelé strávili měsíce v Itálii, kde se učili 
                      tradiční techniky přípravy těsta a výběru nejlepších ingrediencí.
                    </p>
                    <p className="text-base sm:text-lg">
                      Vrátili se s vizí přinést do Prahy skutečnou italskou pizzu - 
                      s křupavým okrajem, jemným těstem a čerstvými ingrediencemi 
                      dováženými přímo z Itálie.
                    </p>
                    <p className="text-base sm:text-lg">
                      Dnes už 5 let servírujeme pizzy, které chutnají jako 
                      z neapolských uliček, ale s českým srdcem.
                    </p>
                  </div>
                </div>
                {/* OBRÁZEK - na mobilu nahoře, na desktopu vpravo */}
                <div className="order-1 lg:order-2">
                  <img 
                    src="/images/about-pizza-making.jpg" 
                    alt="Příprava pizzy"
                    className="w-full h-64 sm:h-72 lg:h-80 object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* HODNOTY PIZZERIE - MOBILNÍ GRID */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
              ⭐ Naše hodnoty
            </h2>
            {/* RESPONZIVNÍ GRID - 1 na mobilu, 2 na tabletu, 3 na desktopu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* ČERSTVOST */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  Čerstvost
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Těsto připravujeme každý den čerstvé. Ingredience dovážíme 
                  několikrát týdně přímo od ověřených dodavatelů.
                </p>
              </div>

              {/* KVALITA */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  Kvalita
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Používáme pouze prémiové ingredience - San Marzano rajčata, 
                  pravou mozzarellu di bufala a extra panenský olivový olej.
                </p>
              </div>

              {/* TRADICE */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🇮🇹</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  Tradice
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Naše recepty pocházejí z Neapole. Dodržujeme tradiční 
                  italské postupy přípravy a pečení v kamenné peci.
                </p>
              </div>
            </div>
          </div>

          {/* TÝM - MOBILNÍ LAYOUT */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
              👥 Náš tým
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="space-y-6 sm:space-y-8">
                
                {/* MAJITEL */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">👨‍🍳</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      Marco Rossi - Majitel & Hlavní kuchař
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      15 let zkušeností v italských pizzeriích. Absolvoval kurzy 
                      v Neapolské akademii pizzy a přinesl autentické recepty do Prahy.
                    </p>
                  </div>
                </div>

                {/* SOUS CHEF */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">👩‍🍳</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      Anna Nováková - Sous chef
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      Specialistka na těsta a omáčky. Každý den připravuje 
                      čerstvé těsto podle tradičních italských receptů.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CALL TO ACTION - MOBILNÍ OPTIMALIZOVANÝ */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-6 sm:p-8 text-white">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
                🍕 Ochutnejte rozdíl!
              </h2>
              <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Přijďte k nám ochutnat pizzu připravenou s láskou podle 
                tradičních italských receptů. Každý kousek je příběh.
              </p>
              
              {/* MOBILNÍ CTA TLAČÍTKA */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <Link 
                  to="/reservations"
                  className="flex-1 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center touch-manipulation"
                >
                  📅 Rezervovat stůl
                </Link>
                <a 
                  href="tel:722272252"
                  className="flex-1 bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-colors text-center touch-manipulation"
                >
                  📞 Zavolat
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;