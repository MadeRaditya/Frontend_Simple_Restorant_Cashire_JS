'use client';

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import IconsList from "../../../../../public/assets/icons/IconsList";


const CartSidebar = ({ showCart, onClose }) => {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
        alert('Cart is empty! Please select items first.');
        return;
    }
    router.push('/orderCreate');
  };

  return (
    showCart && (
      <div className="fixed top-0 right-0 w-3/4 md:w-1/3 h-full bg-white dark:bg-gray-900 shadow-2xl p-6 z-50 overflow-y-auto rounded-lg transform transition-transform ease-in-out duration-300 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-gray-900 dark:text-white dark:hover:text-gray-100 hover:scale-105">
          <IconsList.CloseIcons/>
        </button>

        <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">Cart</h3>

        {cart.length > 0 ? (
          <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-4 px-2 rounded-md border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                <div className="flex items-center space-x-4">
                  <img src={`/public/assets/img/${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div className="text-sm">
                    <h4 className="font-bold text-xl md:text-md text-black dark:text-gray-100">{item.name}</h4>
                    <p className="text-black dark:text-gray-100 font-semibold">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-gray-900 dark:text-gray-100">Rp {item.price * item.quantity}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 font-semibold text-red-500 hover:text-red-700 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-end">
            <button className="font-bold bg-gray-800 text-gray-100 py-2 px-4 mt-2 rounded-lg hover:bg-black-700 transition duration-300 dark:text-gray-200 dark:bg-gray-700"
            onClick={clearCart}
            >Clear Cart</button>
          </div>
          
          </>
        ) : (
          <p className="text-black dark:text-gray-100 text-3xl font-bold justify-center items-center flex">Your cart is empty.</p>
        )}


        <div className="mt-7">
            <div className="mt-6 mb-2 font-semibold text-black dark:text-white">
                <p className="text-lg">Total: Rp {calculateTotal()}</p>
            </div>
            <button
                onClick={handleCheckout}
                className="bg-black dark:bg-white w-full py-3  text-white dark:text-black font-semibold rounded-lg hover:bg-zinc-900 dark:hover:bg-gray-200 transition duration-300"
            >
                Proceed to Checkout
            </button>
        </div>
      </div>
    )
  );
};

export default CartSidebar;