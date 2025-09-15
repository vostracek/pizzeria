import React from 'react';

const HowItsMade = () => {
  const steps = [
    {
      number: 1,
      title: "Příprava těsta",
      description: "Míchání mouky, vody, olivového oleje, soli a droždí. Těsto necháváme zrát minimálně 24 hodin pro správnou konzistenci.",
      duration: "24 hodin",
      color: "bg-blue-500"
    },
    {
      number: 2,
      title: "Válení těsta",
      description: "Zkušený pizzaiolo ručně vytvaruje těsto do dokonalého kruhu, zachovává vzduchové bublinky pro křupavé okraje.",
      duration: "2-3 minuty",
      color: "bg-green-500"
    },
    {
      number: 3,
      title: "Rajčatová omáčka",
      description: "Čerstvá omáčka z italských rajčat San Marzano, ochucená bazalkou, oreganem a olivovým olejem.",
      duration: "30 sekund",
      color: "bg-red-500"
    },
    {
      number: 4,
      title: "Přidání ingrediencí",
      description: "Kvalitní mozzarella a pečlivě vybrané ingredience podle receptury. Každá pizza je unikátní dílo.",
      duration: "1 minuta",
      color: "bg-yellow-500"
    },
    {
      number: 5,
      title: "Pečení v kamenné peci",
      description: "Pizza se peče při teplotě 450°C v autentické kamenné peci. Vysoká teplota zajišťuje dokonalou křupavost.",
      duration: "90 sekund",
      color: "bg-orange-500"
    },
    {
      number: 6,
      title: "Finální úpravy",
      description: "Čerstvá bazalka, kapka olivového oleje a pizza je připravena k servírování.",
      duration: "30 sekund",
      color: "bg-purple-500"
    }
  ];

  const ingredients = [
    { name: "Mouka 00", origin: "Itálie", quality: "Premium italská mouka pro pizzu" },
    { name: "Rajčata San Marzano", origin: "Kampánie, Itálie", quality: "Chráněné označení původu" },
    { name: "Mozzarella di Bufala", origin: "Kampánie, Itálie", quality: "Z mléka buvolíc" },
    { name: "Olivový olej", origin: "Toskánsko, Itálie", quality: "Extra virgin, za studena lisovaný" },
    { name: "Čerstvá bazalka", origin: "Místní pěstitelé", quality: "Denně čerstvá dodávka" },
    { name: "Mořská sůl", origin: "Sicílie", quality: "Tradiční sicilská sůl" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Jak vzniká naše pizza</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Odhalujeme tajemství autentické italské pizzy - od výběru ingrediencí po finální servírování
          </p>
        </div>

        {/* Process Steps */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Proces výroby</h2>
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}>
                <div className="flex-1">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center mb-4">
                      <div className={`${step.color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mr-4`}>
                        {step.number}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      Čas: {step.duration}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">Foto - Krok {step.number}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ingredients Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Naše ingredience</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{ingredient.name}</h3>
                <p className="text-primary-600 font-medium text-sm mb-2">{ingredient.origin}</p>
                <p className="text-gray-600 text-sm">{ingredient.quality}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fun Facts */}
        <section className="bg-white rounded-2xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Zajímavosti</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">450°C</div>
              <div className="text-gray-600">Teplota v peci</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">90s</div>
              <div className="text-gray-600">Doba pečení</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24h</div>
              <div className="text-gray-600">Zrání těsta</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">100%</div>
              <div className="text-gray-600">Italské ingredience</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItsMade;