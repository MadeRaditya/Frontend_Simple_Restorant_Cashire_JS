"use client"

import { createContext, useState, useContext, useEffect, Children } from "react"

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState(() => {
        if(typeof window !== 'undefined') {
            const storedCart  = window.localStorage.getItem('cart');
            return storedCart  ? JSON.parse(storedCart ) : [];
        }
        return [];
    });

    const addToCart = (items) => {
        setCart((prevCart)=>{
            const updatedCart = [...prevCart];
            const existingItemsIndex = updatedCart.findIndex((cartItems)=>cartItems.id === items.id);

            if(existingItemsIndex > -1){
                updatedCart[existingItemsIndex].quantity += 1;
            }else{
                updatedCart.push({...items, quantity: 1});
            }

            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        })
    }

    const removeFromCart = (itemId)=>{
        setCart((prevCart)=>{
            const updatedCart = prevCart.filter((item)=>item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        })
    }

    const clearCart =()=>{
        setCart([]);
        localStorage.removeItem('cart');
    }

    return (
        <CartContext.Provider value={{cart, addToCart,removeFromCart,clearCart}}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);