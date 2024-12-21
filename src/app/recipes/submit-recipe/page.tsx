"use client";

import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import MainLayout from "@/components/layout/MainLayout";

interface FormData {
  recipeName: string;
  recipeAuthor: string;
  preptime: string;
  cooktime: string;
  totaltime: string;
  servings: string;
  description: string;
  category: string;
  ingredients: string;
  instructions: string;
  image: File | null;
}

const SubmitPage = ({ recipeId }: { recipeId?: string }) => {
  const [formData, setFormData] = useState<FormData>({
    recipeName: "",
    recipeAuthor: "",
    preptime: "",
    cooktime: "",
    totaltime: "",
    servings: "",
    description: "",
    category: "Dessert",
    ingredients: "",
    instructions: "",
    image: null,
  });
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusColor, setStatusColor] = useState<string>("");

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (recipeId) {
      const fetchRecipeData = async () => {
        try {
          const response = await fetch(`/api/recipe/${recipeId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch recipe data");
          }
          const recipeData = await response.json();
          setFormData({
            recipeName: recipeData.name,
            recipeAuthor: recipeData.author,
            preptime: recipeData.preptime,
            cooktime: recipeData.cooktime,
            totaltime: recipeData.totaltime,
            servings: recipeData.servings,
            description: recipeData.description,
            category: recipeData.category,
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
            image: null,
          });
        } catch (error) {
          console.error("Failed to fetch recipe data:", error);
          setStatusMessage("Failed to fetch recipe data");
          setStatusColor("text-red-500");
        }
      };
      fetchRecipeData();
    }
  }, [recipeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      category: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipeName ||!formData.recipeAuthor ||  !formData.description || !formData.category ||!formData.ingredients || !formData.instructions || !formData.image) {
      setStatusMessage("All fields are required. Please make sure all fields are filled out.");
      setStatusColor("text-red-500");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("recipeName", formData.recipeName);
    formDataToSubmit.append("recipeAuthor", formData.recipeAuthor);
    formDataToSubmit.append("preptime", formData.preptime);
    formDataToSubmit.append("cooktime", formData.cooktime);
    formDataToSubmit.append("totaltime", formData.totaltime);
    formDataToSubmit.append("servings", formData.servings);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("category", formData.category);
    formDataToSubmit.append("ingredients", formData.ingredients);
    formDataToSubmit.append("instructions", formData.instructions);
    if (formData.image) {
      formDataToSubmit.append("image", formData.image);
    }

    try {
      const apiUrl = recipeId ? `/api/recipe/update?id=${recipeId}` : "/api/recipe/create";
      const method = recipeId ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        body: formDataToSubmit,
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage("Recipe successfully added or updated.");
        setStatusColor("text-green-500");
      } else {
        setStatusMessage(result.message || "An error occurred while submitting the data.");
        setStatusColor("text-red-500");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatusMessage("An error occurred while submitting the form. Please try again.");
      setStatusColor("text-red-500");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-[#eeebdb] flex flex-col items-center justify-center px-4"
    >
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 transition"
        onClick={() => router.push("/")}
      >
        <FaArrowLeft size={24} />
      </button>

      {/* Header */}
      <h1 className="text-3xl font-bold text-black mb-6">Share Recipe</h1>

      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="recipeName">Recipe Name:</label>
            <input
              type="text"
              id="recipeName"
              name="recipeName"
              value={formData.recipeName}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="recipeAuthor">Author:</label>
            <input
              type="text"
              id="recipeAuthor"
              name="recipeAuthor"
              value={formData.recipeAuthor}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="preptime">Prep Time:</label>
            <input
              type="text"
              id="preptime"
              name="preptime"
              value={formData.preptime}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="cooktime">Cook Time:</label>
            <input
              type="text"
              id="cooktime"
              name="cooktime"
              value={formData.cooktime}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="totaltime">Total Time:</label>
            <input
              type="text"
              id="totaltime"
              name="totaltime"
              value={formData.totaltime}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="servings">Servings:</label>
            <input
              type="text"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="border rounded-lg p-2 w-full mb-4"
            >
              <option value="Dessert">Dessert</option>
              <option value="Main Course">Main Course</option>
              <option value="Appetizer">Appetizer</option>
            </select>
          </div>

          <div>
            <label htmlFor="ingredients">Ingredients:</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="instructions">Instructions:</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          <div>
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              className="border rounded-lg p-2 w-full mb-4"
            />
          </div>

          {statusMessage && (
            <p className={`mb-4 ${statusColor}`}>{statusMessage}</p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitPage;
