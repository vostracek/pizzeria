// frontend/src/contexts/CartContext.js - JEDNODUCHÁ VERZE BEZ VELIKOSTÍ
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart musí být použit uvnitř CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // PŘIDÁNÍ PIZZY DO KOŠÍKU - POUŽÍVÁ CELÝ PIZZA OBJEKT
  const addToCart = (pizza) => {
    const cartItem = {
      id: pizza._id, // MongoDB ObjectId
      pizzaId: pizza._id, // Pro API volání
      name: pizza.name,
      price: parseFloat(pizza.price) || 200,
      quantity: 1,
      image: pizza.image || '/api/placeholder/200/200',
      description: pizza.description,
      ingredients: Array.isArray(pizza.ingredients) 
        ? pizza.ingredients.join(', ') 
        : (pizza.ingredients || 'Základní ingredience'),
      // Uloží celý pizza objekt pro případné budoucí použití
      pizza: pizza
    };

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === cartItem.id);
      
      if (existingItem) {
        // Zvyš množství existující položky
        return currentItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Přidej novou položku
        return [...currentItems, cartItem];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: parseInt(newQuantity) || 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => {
      const itemQuantity = parseInt(item.quantity) || 0;
      return total + itemQuantity;
    }, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};