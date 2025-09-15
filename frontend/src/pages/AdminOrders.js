import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Chyba při načítání objednávek:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      loadOrders(); // Znovu načti data
    } catch (error) {
      console.error('Chyba při aktualizaci statusu:', error);
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
    if (filter === 'active') return ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);
    return order.status === filter;
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Načítám objednávky...</div>;
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
            <option value="active">Aktivní objednávky</option>
            <option value="pending">Čekající</option>
            <option value="confirmed">Potvrzené</option>
            <option value="preparing">Připravují se</option>
            <option value="ready">Připravené</option>
            <option value="delivered">Doručené</option>
            <option value="cancelled">Zrušené</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Objednávka
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Zákazník
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Položky
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Typ/Adresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Celkem
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
              {filteredOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString('cs-CZ')}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{order.customerInfo.name}</div>
                      <div className="text-sm text-gray-500">{order.customerInfo.phone}</div>
                      {order.customerInfo.email && (
                        <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {order.items.map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.quantity}x {item.pizza.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.orderType === 'delivery' ? '🚚 Rozvoz' : '🏪 Odběr'}
                      </div>
                      {order.orderType === 'delivery' && (
                        <div className="text-sm text-gray-500">
                          {order.customerInfo.address}, {order.customerInfo.city}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.totalPrice} Kč</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
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
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Žádné objednávky nenalezeny
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;