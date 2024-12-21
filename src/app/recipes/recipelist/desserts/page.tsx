"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { FaEdit, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const Appetizers: React.FC = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const [editFormData, setEditFormData] = useState({
    recipeName: '',
    recipeAuthor: '',
    preptime: '',
    cooktime: '',
    totaltime: '',
    servings: '',
    description: '',
    ingredients: '',
    instructions: '',
    image: null as File | null,
    previewImage: '',
  });

  // Refs to handle clicks outside of the modal
  const successModalRef = useRef<HTMLDivElement | null>(null);

  // Fetch recipes based on category when the component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      console.log('Fetching recipes with category Dessert...');

      const response = await fetch(`/api/recipe?category=Dessert`);

      if (!response.ok) {
        console.error('Failed to fetch recipes:', response.status, response.statusText);
        throw new Error(`Failed to fetch recipes: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched recipes:', data);

      if (data.length === 0) {
        console.log('No desserts found in the database.');
      }

      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
      alert('An error occurred while fetching recipe data.');
    }
  };

  const resolveImagePath = (image: string) => {
    return image ? `/images/${image.replace(/^images\//, '')}` : '/images/default-image.png';
  };

  const openDetailModal = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRecipe(null);
  };

  const openEditModal = () => {
    if (selectedRecipe) {
      setEditFormData({
        recipeName: selectedRecipe.recipeName || '',
        recipeAuthor: selectedRecipe.recipeAuthor || '',
        preptime: selectedRecipe.preptime || '',
        cooktime: selectedRecipe.cooktime || '',
        totaltime: selectedRecipe.totaltime || '',
        servings: selectedRecipe.servings || '',
        description: selectedRecipe.description || '',
        ingredients: selectedRecipe.ingredients || '',
        instructions: selectedRecipe.instructions || '',
        image: null,
        previewImage: resolveImagePath(selectedRecipe.image || ''),
      });
      setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData({
        ...editFormData,
        image: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedRecipe) return;

    const formData = new FormData();

    Object.keys(editFormData).forEach((key) => {
      const value = editFormData[key as keyof typeof editFormData];
      if (value && key !== 'previewImage') {
        formData.append(key, value as string | Blob);
      }
    });

    try {
      const response = await fetch(`/api/recipe/update?id=${selectedRecipe.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessModalOpen(true);
        fetchRecipes();
        closeEditModal();
        closeDetailModal();
      } else {
        alert(data.error || 'Failed to update recipe');
      }
    } catch (error) {
      console.error('Error during update:', error);
      alert('An error occurred while updating the recipe.');
    }
  };

  const handleDelete = async () => {
    if (!selectedRecipe) return;

    try {
      const response = await fetch(`/api/recipe/delete?id=${selectedRecipe.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSuccessModalOpen(true);
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== selectedRecipe.id));
        closeDeleteModal();
        closeDetailModal();
      } else {
        console.error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (successModalRef.current && !successModalRef.current.contains(e.target as Node)) {
      setSuccessModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#FAF6E3]"
      style={{
        backgroundImage: 'url("/images/circo bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="text-center p-4 max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-black mb-6 drop-shadow-lg">
            Circo Recipe Share
          </h1>
          <p className="mb-8 text-xl text-black/80 tracking-wide font-light">
            Appetizers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.length > 0 ? (
              recipes.map((recipe, index) => (
                <div key={index} className="group block" onClick={() => openDetailModal(recipe)}>
                  <div className="rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={resolveImagePath(recipe.image)}
                      alt={recipe.recipeName || 'Recipe image'}
                      className="w-full h-48 object-contain transition-transform duration-200"
                    />
                    <div className="p-4 bg-orange-200 text-center">
                      <span className="font-semibold">{recipe.recipeName}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No appetizer recipes submitted yet!</p>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-end"
          onClick={handleClickOutside}
        >
          <div
            ref={successModalRef}
            className="bg-green-200 p-6 rounded-lg  w-96 flex items-center justify-center mb-8"
          >
            <FaCheckCircle className="text-black text-xl mr-4" />
            <p className="text-black text-xl">Recipe updated successfully!</p>
          </div>
        </div>
      )}


      {/* Detail Modal */}
      {isDetailModalOpen && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-orange-100 p-6 rounded-lg shadow-lg w-[1000px] max-h-[90vh] overflow-y-auto relative">
            {/* Arrow Button */}
            <button
              onClick={closeDetailModal}
              className="absolute top-2 left-2 text-black bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition duration-200"
            >
              <FaArrowLeft className="text-lg" />
            </button>

            {/* Recipe Name */}
            <h2 className="text-2xl font-bold text-center mt-4">
              {selectedRecipe.recipeName}
            </h2>

            {/* Recipe Image */}
            <img
              src={resolveImagePath(selectedRecipe.image)}
              alt={selectedRecipe.recipeName}
              className="w-full h-48 object-contain mt-4"
            />

            {/* Recipe Details */}
            <p className="text-md mt-2">By: {selectedRecipe.recipeAuthor}</p>
            <p className="text-lg mt-4">{selectedRecipe.description}</p>
            <p className="text-md mt-2">Prep Time: {selectedRecipe.preptime}</p>
            <p className="text-md mt-2">Cook Time: {selectedRecipe.cooktime}</p>
            <p className="text-md mt-2">Total Time: {selectedRecipe.totaltime}</p>
            <p className="text-md mt-2">Servings: {selectedRecipe.servings}</p>
            <p className="text-md mt-4">Ingredients:</p>
            <ul className="list-disc list-inside">
              {selectedRecipe.ingredients.split('\n').map((ingredient: string, index: number) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <p className="text-md mt-4">Instructions:</p>
            <ol className="list-decimal list-inside">
              {selectedRecipe.instructions.split('\n').map((instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>

            {/* Edit and Delete Buttons */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={openEditModal}
                className="flex items-center gap-2 bg-green-200 text-black px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={openDeleteModal}
                className="flex items-center gap-2 bg-red-300 text-black px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-orange-100 p-6 rounded-lg shadow-lg w-[1000px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-center mb-4">Edit Recipe</h2>
              
            </div>

            <div className="mb-4">
              <label htmlFor="recipeName" className="block text-lg font-medium text-gray-700">
                Recipe Name
              </label>
              <input
                id="recipeName"
                type="text"
                name="recipeName"
                value={editFormData.recipeName}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Recipe Name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="recipeAuthor" className="block text-lg font-medium text-gray-700">
                Author
              </label>
              <input
                id="recipeAuthor"
                type="text"
                name="recipeAuthor"
                value={editFormData.recipeAuthor}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Author"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="preptime" className="block text-lg font-medium text-gray-700">
                Prep Time
              </label>
              <input
                id="preptime"
                type="text"
                name="preptime"
                value={editFormData.preptime}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Prep Time"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="cooktime" className="block text-lg font-medium text-gray-700">
                Cook Time
              </label>
              <input
                id="cooktime"
                type="text"
                name="cooktime"
                value={editFormData.cooktime}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Cook Time"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="totaltime" className="block text-lg font-medium text-gray-700">
                Total Time
              </label>
              <input
                id="totaltime"
                type="text"
                name="totaltime"
                value={editFormData.totaltime}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Total Time"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="servings" className="block text-lg font-medium text-gray-700">
                Servings
              </label>
              <input
                id="servings"
                type="text"
                name="servings"
                value={editFormData.servings}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Servings"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Description"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="ingredients" className="block text-lg font-medium text-gray-700">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={editFormData.ingredients}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Ingredients (one per line)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="instructions" className="block text-lg font-medium text-gray-700">
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={editFormData.instructions}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Instructions (one per line)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-lg font-medium text-gray-700">
                Upload Image
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditImageChange}
                className="w-full p-2 border rounded"
              />
              {editFormData.previewImage && (
                <img
                  src={editFormData.previewImage}
                  alt="Preview"
                  className="w-full h-32 object-cover mt-2 rounded border"
                />
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="text-center text-gray-700 mb-6">
              Are you sure you want to delete <strong>{selectedRecipe?.recipeName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Appetizers;
