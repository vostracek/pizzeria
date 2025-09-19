import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { orderAPI, reservationAPI, pizzaAPI } from '../services/api';

const AdminDashboard = () => {
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    activeOrders: 0,
    todayReservations: 0,
    totalMenuItems: 0,
    avgOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [todayReservations, setTodayReservations] = useState([]);

  // STATUS KONFIGURACE
  const statusConfig = {
    pending: { name: 'Čeká', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
    confirmed: { name: 'Potvrzeno', color: 'bg-blue-100 text-blue-800', icon: '✅' },
    preparing: { name: 'Připravuje se', color: 'bg-orange-100 text-orange-800', icon: '👨‍🍳' },
    ready: { name: 'Připraveno', color: 'bg-green-100 text-green-800', icon: '🍕' },
    delivered: { name: 'Doručeno', color: 'bg-gray-100 text-gray-800', icon: '🚚' },
    cancelled: { name: 'Zrušeno', color: 'bg-red-100 text-red-800', icon: '❌' }
  };

  // NAČTENÍ DAT PŘI SPUŠTĚNÍ
  useEffect(() => {
    loadDashboardData();
    // Automatické obnovení každých 30 sekund
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // PARALELNÍ NAČÍTÁNÍ DAT PRO RYCHLOST
      const [ordersResponse, reservationsResponse, pizzasResponse] = await Promise.all([
        orderAPI.getAllOrders(),
        reservationAPI.getAll(),
        pizzaAPI.getAll()
      ]);

      const orders = ordersResponse.data;
      const reservations = reservationsResponse.data;
      const pizzas = pizzasResponse.data;

      // FILTROVÁNÍ DNEŠNÍCH DAT
      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
      );
      const todayReservationsList = reservations.filter(reservation => 
        new Date(reservation.date).toDateString() === today
      );

      // KALKULACE STATISTIK
      const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      const activeOrders = orders.filter(order => 
        ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
      ).length;
      const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

      // AKTUALIZACE STAVU
      setStats({
        todayOrders: todayOrders.length,
        todayRevenue,
        activeOrders,
        todayReservations: todayReservationsList.length,
        totalMenuItems: pizzas.length,
        avgOrderValue
      });

      setRecentOrders(orders.slice(0, 5)); // Posledních 5 objednávek
      setTodayReservations(todayReservationsList.slice(0, 5)); // Dnešních 5 rezervací

    } catch (error) {
      console.error('Chyba při načítání dashboard dat:', error);
      showError('Chyba při načítání dat');
    } finally {
      setLoading(false);
    }
  };

  // RYCHLÉ AKCE
  const quickActions = [
    { title: 'Správa objednávek', icon: '📋', link: '/admin/orders', color: 'bg-blue-500' },
    { title: 'Rezervace', icon: '📅', link: '/admin/reservations', color: 'bg-green-500' },
    { title: 'Menu pizzy', icon: '🍕', link: '/admin/menu', color: 'bg-red-500' },
    { title: 'Nová pizza', icon: '➕', link: '/admin/menu', color: 'bg-purple-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Načítám dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HLAVIČKA */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Dashboard - Pizza Fresca
            </h1>
            <p className="text-gray-600">
              Přehled dneška: {new Date().toLocaleDateString('cs-CZ', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={loadDashboardData}
            className="mt-4 sm:mt-0 btn btn-secondary px-4 py-2 text-sm"
          >
            🔄 Obnovit data
          </button>
        </div>

        {/* STATISTIKY - RESPONZIVNÍ GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
          
          {/* DNEŠNÍ OBJEDNÁVKY */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl mr-3">📦</div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                  {stats.todayOrders}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Dnešní objednávky</div>
              </div>
            </div>
          </div>

          {/* DNEŠNÍ TRŽBY */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl mr-3">💰</div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {stats.todayRevenue.toLocaleString()} Kč
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Dnešní tržby</div>
              </div>
            </div>
          </div>

          {/* AKTIVNÍ OBJEDNÁVKY */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl mr-3">🔥</div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-orange-600">
                  {stats.activeOrders}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Aktivní objednávky</div>
              </div>
            </div>
          </div>

          {/* DNEŠNÍ REZERVACE */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl mr-3">📅</div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-purple-600">
                  {stats.todayReservations}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Dnešní rezervace</div>
              </div>
            </div>
          </div>

          {/* MENU POLOŽKY */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl mr-3">🍕</div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-red-600">
                  {stats.totalMenuItems}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Druhů pizz</div>
              </div>
            </div>
          </div>

          {/* PRŮMĚRNÁ OBJEDNÁVKA */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl mr-3">📊</div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-indigo-600">
                  {Math.round(stats.avgOrderValue)} Kč
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Průměr objednávky</div>
              </div>
            </div>
          </div>
        </div>

        {/* RYCHLÉ AKCE */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Rychlé akce</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} text-white rounded-lg p-4 sm:p-6 hover:opacity-90 transition-opacity`}
              >
                <div className="text-2xl sm:text-3xl mb-2">{action.icon}</div>
                <div className="font-semibold text-sm sm:text-base">{action.title}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* OBSAH - RESPONZIVNÍ LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* POSLEDNÍ OBJEDNÁVKY */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Poslední objednávky
                </h3>
                <Link 
                  to="/admin/orders" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Zobrazit všechny →
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Žádné objednávky
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="p-4 sm:p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-800">
                          #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.customerInfo?.name || 'Neznámý zákazník'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary-600">
                          {order.totalPrice} Kč
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString('cs-CZ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {order.items?.length || 0} položek
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {statusConfig[order.status]?.icon} {statusConfig[order.status]?.name || order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DNEŠNÍ REZERVACE */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Dnešní rezervace
                </h3>
                <Link 
                  to="/admin/reservations" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Zobrazit všechny →
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {todayReservations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Žádné rezervace na dnes
                </div>
              ) : (
                todayReservations.map((reservation) => (
                  <div key={reservation._id} className="p-4 sm:p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {reservation.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          📞 {reservation.phone}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">
                          {reservation.time}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.guests} {reservation.guests === 1 ? 'osoba' : reservation.guests < 5 ? 'osoby' : 'osob'}
                        </div>
                      </div>
                    </div>
                    
                    {reservation.notes && (
                      <div className="text-sm text-gray-600 italic mt-2">
                        "{reservation.notes}"
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status === 'confirmed' ? '✅ Potvrzeno' :
                         reservation.status === 'pending' ? '⏳ Čeká' : '❌ Zrušeno'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;