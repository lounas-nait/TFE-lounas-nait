import React from "react";
import { HiOutlineMenuAlt2, HiOutlineHome } from "react-icons/hi";
import { CiShoppingCart, CiDeliveryTruck } from "react-icons/ci";
import { IoHeartOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useCart } from "./CartContext"; 

const Sidebar = () => {
  const { cartCount } = useCart(); 

  return (
    <div className="fixed top-0 left-0 h-screen p-2 bg-gradient-to-b from-gray-300 from-5% via-stone-500 via-60% to-gray-700 to-80% ...">
      <ul className="p-5 space-y-8">
        <li>
          <button>
            <HiOutlineMenuAlt2 size={"1.5rem"} />
          </button>
        </li>

        <li>
          <NavLink to="/">
            <button>
              <HiOutlineHome size={"1.5rem"} />
            </button>
          </NavLink>
        </li>

        <li>
          <NavLink to="/cart">
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
          <NavLink to="/favs">
            <button>
              <IoHeartOutline size={"1.5rem"} />
            </button>
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders">
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
