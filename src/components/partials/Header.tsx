"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  const [isSignUpDropdownVisible, setIsSignUpDropdownVisible] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const showExploreDropdown = () => setIsDropdownVisible(true);
  const hideExploreDropdown = () => setIsDropdownVisible(false);

  const showSignUpDropdown = () => setIsSignUpDropdownVisible(true);
  const hideSignUpDropdown = () => setIsSignUpDropdownVisible(false);

  const toggleProfileDropdown = () =>
    setIsProfileDropdownVisible((prev) => !prev);

  useEffect(() => {
    const savedUsername = sessionStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    setUsername(null);
    window.location.href = '/sign'; // Redirect to the sign-up page after logout
  };
  

  return (
    <header className="relative z-50 flex justify-between items-center h-16 bg-gray-100 px-4 shadow-md">
      <div className="flex items-center gap-4">
        <Image
          src="/images/circo logo.png"
          alt="Circo Logo"
          width={50}
          height={50}
        />
        
      </div>

      <nav className="flex items-center">
        <ul className="flex gap-6 items-center">
          <li>
            <Link href="/">Home</Link>
          </li>

          {/* Dropdown for Browse Recipe*/}
          <li
            className="relative"
            onMouseEnter={showExploreDropdown}
            onMouseLeave={hideExploreDropdown}
          >
            <button className="relative z-10 bg-transparent border-none cursor-pointer">
              Browse Recipes
            </button>
            {isDropdownVisible && (
              <div
                className="absolute top-full left-0 shadow-lg rounded-md py-2 w-56 z-50"
                onMouseEnter={showExploreDropdown}
                onMouseLeave={hideExploreDropdown}
              >
                <ul className="flex flex-col">
                  <li className="px-4 py-3 bg-[#F5F5F5] text-black hover:bg-[#eae3c9]">
                    <Link href="/recipes/recipelist/appetizers">Appetizers</Link>
                  </li>
                  <li className="px-4 py-3 bg-[#F5F5F5] text-black hover:bg-[#eae3c9]">
                    <Link href="/recipes/recipelist/desserts">Desserts</Link>
                  </li>
                  <li className="px-4 py-3 bg-[#F5F5F5] text-black hover:bg-[#eae3c9]">
                    <Link href="/recipes/recipelist/main-course">Main Course</Link>
                  </li>
                  
                </ul>
              </div>
            )}
          </li>

          <li>
            <Link href="/recipes/submit-recipe">Share Recipe</Link>
          </li>

          {username ? (
            <li className="relative">
              <button
                className="cursor-pointer"
                onClick={toggleProfileDropdown}
              >
                Profile
              </button>

              {isProfileDropdownVisible && (
                <div className="absolute right-0 top-full bg-white shadow-md rounded-md w-48 py-2 z-50">
                  <div className="px-4 py-2 text-gray-700">
                    <span>{username}</span>
                  </div>
                  <div className="px-4 py-2">
                    <button
                      onClick={handleLogout}
                      className="text-blue-500 hover:underline block"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link href="/sign">Sign Up</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
