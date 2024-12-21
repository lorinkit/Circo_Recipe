import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="container mx-auto flex flex-col items-center">
        <h2 className="text-xl font-semibold">Circo</h2>
        <p className="text-sm">&copy; 2024 Circo Recipes. All rights reserved.</p>
        <p className="text-xs mt-2">"Creating recipes that inspire."</p>
      </div>
    </footer>
  );
};

export default Footer;