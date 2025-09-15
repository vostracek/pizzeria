import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, totalPrice } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Objednávka přijata!</h2>
        
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Číslo objednávky:</p>
            <p className="text-lg font-bold text-primary-600">{orderId}</p>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Vaše objednávka za <strong>{totalPrice} Kč</strong> byla úspěšně přijata. 
          Brzy vás budeme kontaktovat s potvrzením a časem připravení.
        </p>
        
        <div className="space-y-3">
          <Link to="/" className="btn btn-primary block">
            Zpět na hlavní stránku
          </Link>
          
          <p className="text-sm text-gray-500">
            📞 V případě dotazů volejte: 722 272 252
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;