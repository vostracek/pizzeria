import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart musí být použit uvnitř CartProvider');
  }
  return context;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.pizza._id === action.payload._id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.pizza._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { pizza: action.payload, quantity: 1 }]
      };
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.pizza._id !== action.payload)
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.pizza._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: []
  });

  const addToCart = (pizza) => {
    dispatch({ type: 'ADD_ITEM', payload: pizza });
  };

  const removeFromCart = (pizzaId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: pizzaId });
  };

  const updateQuantity = (pizzaId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: pizzaId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      return total + (item.pizza.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};