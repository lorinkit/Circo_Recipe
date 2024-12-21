// Mark Home as a Client Component
"use client";

import React from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";

const Home: React.FC = () => {
  return (
    <MainLayout>
      <div
        className="flex items-center justify-center min-h-screen bg-[#FAF6E3]"
        style={{
          backgroundImage: 'url("/images/circo bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        

        
        <div className="relative z-10 text-center py-16">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/images/circo logo.png"
              alt="Circo Logo"
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 object-contain"
            />
          </div>

          
          <h1 className="text-5xl font-bold text-black mb-4 ">Circo Recipe Share</h1>
          <p className="text-xl text-black mb-6">Stirring Up Flavor, One Recipe at a Time!</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
