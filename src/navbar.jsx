import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

export const Navbar = ({ items }) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="z-50 w-full absolute px-4 md:pl-24 md:pr-12 py-4 flex justify-between md:items-center font-medium">
      <div
        className="md:hidden absolute right-6 top-9"
        onClick={handleMenuToggle}
      ></div>
      <ul
        className={
          "flex-col bg-white md:bg-transparent shadow-md md:shadow-none py-4 px-12 md:p-0 md:flex-row md:flex gap-1 md:gap-4 md:items-center text-lg "
        }
      >
        {items.map((item) => (
          <li key={item.page}>
            <Link
              to={`/${item.page}`}
              className={`flex justify-center items-center gap-1 rounded-md md:bg-[#ffd900ee] px-3 py-2 text-sm font-semibold text-[green-700] md:hover:text-[#B22222] ${
                currentPage === `/${item.page}`
                  ? "active text-[#B22222] italic md:hover:shadow-none"
                  : "md:shadow-lg md:shadow-[#b2222251] "
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
