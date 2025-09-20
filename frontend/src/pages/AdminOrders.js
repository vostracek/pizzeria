import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Chyba při načítání objednávek:', error);
      showError('Chyba při načítání objednávek');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      showSuccess('Status objednávky byl aktualizován');
      loadOrders();
    } catch (error) {
      console.error('Chyba při aktualizaci statusu:', error);
      showError('Chyba při aktualizaci statusu');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Čeká';
      case 'confirmed': return 'Potvrzeno';
      case 'preparing': return 'Připravuje se';
      case 'ready': return 'Připraveno';
      case 'delivered': return 'Doručeno';
      case 'cancelled': return 'Zrušeno';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date().toDateString();
      return new Date(order.createdAt).toDateString() === today;
    }
    if (filter === 'active') {
      return ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);
    }
    return order.status === filter;
  });

  const sortedOrders = filteredOrders.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Načítám objednávky...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Správa objednávek</h1>
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Všechny objednávky</option>
            <option value="today">Dnes</option>
            <option value="active">Aktivní</option>
            <option value="pending">Čeká</option>
            <option value="confirmed">Potvrzeno</option>
            <option value="preparing">Připravuje se</option>
            <option value="ready">Připraveno</option>
            <option value="delivered">Doručeno</option>
            <option value="cancelled">Zrušeno</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objednávka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zákazník & Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Položky
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ/Adresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Celkem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    {/* OBJEDNÁVKA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                        </div>
                        <div className="text-gray-500">
                          {new Date(order.createdAt).toLocaleString('cs-CZ')}
                        </div>
                      </div>
                    </td>

                    {/* ZÁKAZNÍK & KONTAKT */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 mb-1">
                          {order.customerInfo.name}
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <span className="mr-1">📞</span>
                            <a 
                              href={`tel:${order.customerInfo.phone}`} 
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {order.customerInfo.phone}
                            </a>
                          </div>
                          {order.customerInfo.email && (
                            <div className="flex items-center">
                              <span className="mr-1">📧</span>
                              <a 
                                href={`mailto:${order.customerInfo.email}`}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                {order.customerInfo.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* POLOŽKY */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-gray-900">
                            {item.quantity}× {item.pizza.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* TYP/ADRESA */}
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <span className="mr-1">
                            {order.orderType === 'delivery' ? '🚚' : '🏃'}
                          </span>
                          <span className="font-medium">
                            {order.orderType === 'delivery' ? 'Rozvoz' : 'Vyzvednutí'}
                          </span>
                        </div>
                        {order.orderType === 'delivery' && order.customerInfo.address && (
                          <div className="text-gray-600">
                            <div className="flex items-start">
                              <span className="mr-1 mt-0.5">📍</span>
                              <div>
                                <div>{order.customerInfo.address}</div>
                                {order.customerInfo.city && (
                                  <div>{order.customerInfo.city}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {order.customerInfo.notes && (
                          <div className="text-gray-500 text-xs mt-2 italic">
                            💬 {order.customerInfo.notes}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* CELKEM */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.totalPrice} Kč
                      </div>
                      {order.deliveryFee > 0 && (
                        <div className="text-xs text-gray-500">
                          (+ {order.deliveryFee} Kč doprava)
                        </div>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>

                    {/* AKCE */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="pending">Čeká</option>
                        <option value="confirmed">Potvrzeno</option>
                        <option value="preparing">Připravuje se</option>
                        <option value="ready">Připraveno</option>
                        <option value="delivered">Doručeno</option>
                        <option value="cancelled">Zrušeno</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sortedOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Žádné objednávky nenalezeny
            </div>
          )}
        </div>

        {/* Statistiky */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Čeká na potvrzení</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {orders.filter(o => ['confirmed', 'preparing'].includes(o.status)).length}
            </div>
            <div className="text-sm text-gray-600">V přípravě</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'ready').length}
            </div>
            <div className="text-sm text-gray-600">Připraveno</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {orders.filter(o => {
                const today = new Date().toDateString();
                return new Date(o.createdAt).toDateString() === today;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Dnes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;