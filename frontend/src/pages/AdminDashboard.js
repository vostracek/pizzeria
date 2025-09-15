import React, { useState, useEffect } from 'react';
import { orderAPI, reservationAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    todayReservations: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        orderAPI.getAllOrders(),
        reservationAPI.getAll()
      ]);

      const orders = ordersRes.data;
      const reservations = reservationsRes.data;

      // Výpočet statistik
      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
      );
      
      const todayReservations = reservations.filter(reservation => 
        new Date(reservation.date).toDateString() === today
      );

      const pendingOrders = orders.filter(order => 
        ['pending', 'confirmed', 'preparing'].includes(order.status)
      );

      setStats({
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalPrice, 0),
        pendingOrders: pendingOrders.length,
        todayReservations: todayReservations.length
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentReservations(reservations.slice(0, 5));

    } catch (error) {
      console.error('Chyba při načítání dat:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Načítám dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Přehled pizzerie Pizza Fresca</p>
        </div>

        {/* Statistiky */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dnešní objednávky</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dnešní tržby</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayRevenue} Kč</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Čekající objednávky</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dnešní rezervace</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayReservations}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Nedávné objednávky */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Nedávné objednávky</h2>
              <a href="/admin/orders" className="text-primary-600 hover:text-primary-800 text-sm">
                Zobrazit všechny
              </a>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order._id} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerInfo.name}</p>
                      <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString('cs-CZ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{order.totalPrice} Kč</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nedávné rezervace */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Nedávné rezervace</h2>
              <a href="/admin/reservations" className="text-primary-600 hover:text-primary-800 text-sm">
                Zobrazit všechny
              </a>
            </div>
            
            <div className="space-y-4">
              {recentReservations.map(reservation => (
                <div key={reservation._id} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{reservation.name}</p>
                      <p className="text-sm text-gray-600">{reservation.phone}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(reservation.date).toLocaleDateString('cs-CZ')} v {reservation.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{reservation.guests} hostů</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rychlé akce */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <a href="/admin/orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Správa objednávek</h3>
              <p className="text-gray-600 text-sm">Upravit statusy a zobrazit detaily</p>
            </div>
          </a>

          <a href="/admin/reservations" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Správa rezervací</h3>
              <p className="text-gray-600 text-sm">Potvrdit a spravovat rezervace</p>
            </div>
          </a>

          <a href="/admin/menu" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Správa menu</h3>
              <p className="text-gray-600 text-sm">Přidat, upravit nebo smazat pizzy</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;