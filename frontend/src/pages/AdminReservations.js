import React, { useState, useEffect } from 'react';
import { reservationAPI } from '../services/api';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await reservationAPI.getAll();
      setReservations(response.data);
    } catch (error) {
      console.error('Chyba při načítání rezervací:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      await reservationAPI.updateStatus(reservationId, newStatus);
      loadReservations();
    } catch (error) {
      console.error('Chyba při aktualizaci statusu:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Čeká na potvrzení';
      case 'confirmed': return 'Potvrzeno';
      case 'cancelled': return 'Zrušeno';
      case 'completed': return 'Dokončeno';
      default: return status;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date().toDateString();
      return new Date(reservation.date).toDateString() === today;
    }
    if (filter === 'upcoming') {
      return new Date(reservation.date) >= new Date() && reservation.status !== 'cancelled';
    }
    return reservation.status === filter;
  });

  const sortedReservations = filteredReservations.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.time);
    const dateB = new Date(b.date + ' ' + b.time);
    return dateB - dateA;
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Načítám rezervace...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Správa rezervací</h1>
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Všechny rezervace</option>
            <option value="today">Dnes</option>
            <option value="upcoming">Nadcházející</option>
            <option value="pending">Čeká na potvrzení</option>
            <option value="confirmed">Potvrzené</option>
            <option value="completed">Dokončené</option>
            <option value="cancelled">Zrušené</option>
          </select>
        </div>

        {/* Přehled dnešních rezervací */}
        {filter === 'all' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dnešní rezervace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservations
                .filter(res => new Date(res.date).toDateString() === new Date().toDateString())
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(reservation => (
                <div key={reservation._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{reservation.time}</p>
                      <p className="text-sm text-gray-600">{reservation.guests} hostů</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                  <p className="font-medium">{reservation.name}</p>
                  <p className="text-sm text-gray-600">{reservation.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabulka všech rezervací */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Datum & Čas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Zákazník
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hosté
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Poznámka
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedReservations.map(reservation => (
                <tr key={reservation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(reservation.date).toLocaleDateString('cs-CZ')}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.time}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{reservation.name}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">{reservation.phone}</div>
                      {reservation.email && (
                        <div className="text-sm text-gray-500">{reservation.email}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.guests} hostů</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {reservation.notes || '-'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {reservation.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateReservationStatus(reservation._id, 'confirmed')}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            Potvrdit
                          </button>
                          <button 
                            onClick={() => updateReservationStatus(reservation._id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Zrušit
                          </button>
                        </>
                      )}
                      
                      {reservation.status === 'confirmed' && (
                        <button 
                          onClick={() => updateReservationStatus(reservation._id, 'completed')}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Dokončit
                        </button>
                      )}
                      
                      <select 
                        value={reservation.status}
                        onChange={(e) => updateReservationStatus(reservation._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Čeká</option>
                        <option value="confirmed">Potvrzeno</option>
                        <option value="completed">Dokončeno</option>
                        <option value="cancelled">Zrušeno</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedReservations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Žádné rezervace nenalezeny
            </div>
          )}
        </div>

        {/* Statistiky rezervací */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {reservations.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Čeká na potvrzení</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {reservations.filter(r => r.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Potvrzených</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {reservations.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-sm text-gray-600">Dnes</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {reservations.filter(r => new Date(r.date) >= new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Nadcházející</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;