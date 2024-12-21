"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MainLayout from '@/components/layout/MainLayout';
import { auth, GoogleAuthProvider, signInWithPopup } from '@/configs/firebase';

const LogIn: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setStatusMessage("Please fill in both fields.");
      setIsSuccessful(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.message || "Something went wrong.");
        setIsSuccessful(false);
      } else {
        setStatusMessage("Login successful!");
        setIsSuccessful(true);
        // Store the username in session storage or a state to persist user data
        sessionStorage.setItem("username", formData.username);
        router.push("/"); // Redirect after successful login
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setStatusMessage("An error occurred. Please try again.");
      setIsSuccessful(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google Sign-In successful:', user);
      // Handle the user (e.g., store user data or redirect)
      router.push('/'); // Example redirect after successful login
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setStatusMessage('Google Sign-In failed. Please try again.');
      setIsSuccessful(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
        <div className="text-center mb-6">
          <img src="/images/circo logo.png" alt="Circo Recipe Share" className="h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">Log In</h1>
          <p className="text-gray-600 mt-2">Welcome back! Please log in to continue.</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full p-2 text-sm border rounded-md"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full p-2 text-sm border rounded-md"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {statusMessage && (
              <div className={`mb-4 text-sm ${isSuccessful ? 'text-green-500' : 'text-red-500'}`}>
                {statusMessage}
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full"
            >
              Log In
            </button>
          </form>
          <div className="text-center my-4 text-gray-500 text-sm">or Sign in with</div>
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md w-full"
          >
            Sign in with Google
          </button>

          <div className="text-center mt-6 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/sign/signup')}
              className="text-blue-500 hover:underline font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LogIn;