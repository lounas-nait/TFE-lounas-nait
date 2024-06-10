import React from "react";
import { HiOutlineMenuAlt2, HiOutlineHome, HiOutlinePlusCircle } from "react-icons/hi";
import { CiShoppingCart, CiDeliveryTruck } from "react-icons/ci";
import { IoHeartOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated } = useAuth0();

  const isAdmin = isAuthenticated && user.email.startsWith("admin");

  return (
    <div className="fixed top-0 left-0 h-screen w-16 p-0 bg-gradient-to-b from-gray-300 from-5% via-stone-500 via-60% to-gray-700 to-80% ...">
      <ul className="p-5 space-y-8">
      <li>
          <button className="hover:text-orange-600">
            <HiOutlineMenuAlt2 size={"1.5rem"} />
          </button>
        </li>

        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-orange-600" : "hover:text-orange-600")}>
            <button>
              <HiOutlineHome size={"1.5rem"} />
            </button>
          </NavLink>
        </li>

        {!isAdmin && (
          <>
            <li>
              <NavLink to="/cart" className={({ isActive }) => (isActive ? "text-orange-600" : "hover:text-orange-600")}>
                <button className="relative">
                  <CiShoppingCart size={"1.5rem"} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 left-4 inline-block w-4 h-4 bg-red-500 text-white rounded-full text-center text-xs">
                      {cartCount}
                    </span>
                  )}
                </button>
              </NavLink>
            </li>

            <li>
              <NavLink to="/favs" className={({ isActive }) => (isActive ? "text-orange-600" : "hover:text-orange-600")}>
                <button>
                  <IoHeartOutline size={"1.5rem"} />
                </button>
              </NavLink>
            </li>
          </>
        )}

        {isAdmin && (
          <li>
            <NavLink to="/addInstrumentForm" className={({ isActive }) => (isActive ? "text-orange-600" : "hover:text-orange-600")}>
              <button>
                <HiOutlinePlusCircle size={"1.7rem"} />
              </button>
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "text-orange-600" : "hover:text-orange-600")}>
            <button>
              <CiDeliveryTruck size={"1.5rem"} />
            </button>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
