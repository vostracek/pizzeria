import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// VYTVOŘENÍ CONTEXTU
const AuthContext = createContext();

// HOOK PRO POUŽÍVÁNÍ AUTH CONTEXTU
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musí být použit uvnitř AuthProvider');
  }
  return context;
};

// PROVIDER KOMPONENTA
export const AuthProvider = ({ children }) => {
  // STAVY
  const [user, setUser] = useState(null);      // Aktuálně přihlášený uživatel
  const [loading, setLoading] = useState(true); // Loading při načítání

  // EFFECT PRO KONTROLU TOKENU PŘI NAČTENÍ STRÁNKY
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Pokud je token v localStorage, ověř ho
      checkTokenValidity();
    } else {
      // Pokud není token, zastav loading
      setLoading(false);
    }
  }, []);

  // FUNKCE PRO OVĚŘENÍ PLATNOSTI TOKENU
  const checkTokenValidity = async () => {
    try {
      // Zavolá backend endpoint /auth/me
      const response = await api.get('/auth/me');
      setUser(response.data); // Nastaví uživatelská data
    } catch (error) {
      // Pokud token není platný, smaže ho
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false); // Ukončí loading
    }
  };

  // PŘIHLÁŠENÍ UŽIVATELE
  const login = async (email, password) => {
    try {
      // Pošle přihlašovací data na backend
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Uloží token do localStorage
      localStorage.setItem('token', token);
      // Nastaví uživatele do stavu
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Chyba při přihlášení' 
      };
    }
  };

  // REGISTRACE UŽIVATELE (UPRAVENÁ VERZE)
  const register = async (name, email, password) => {
    try {
      // Pošle registrační data na backend
      const response = await api.post('/auth/register', { name, email, password });
      
      // ZMĚNA: NEAUTOMATICKÉ PŘIHLÁŠENÍ
      // Pouze vrátí úspěch, nepřihlašuje uživatele
      return { success: true, data: response.data };
      
      // ODSTRANĚNO: Automatické přihlášení po registraci
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // setUser(user);
      
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Chyba při registraci' 
      };
    }
  };

  // ODHLÁŠENÍ UŽIVATELE
  const logout = () => {
    localStorage.removeItem('token'); // Smaže token z localStorage
    setUser(null);                   // Vymaže uživatele ze stavu
  };

  // HODNOTY KTERÉ POSKYTNE CONTEXT
  const value = {
    user,                              // Objekt s daty uživatele
    login,                             // Funkce pro přihlášení
    register,                          // Funkce pro registraci
    logout,                            // Funkce pro odhlášení
    loading,                           // Boolean - načítá se?
    isAuthenticated: !!user,           // Boolean - je přihlášen? (!!)=převede na boolean)
    isAdmin: user?.role === 'admin'    // Boolean - je admin? (?.=optional chaining)
  };

  // VRÁTÍ PROVIDER S HODNOTAMI
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};