import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/configs/database'; // Ensure this is the correct import
import { OkPacket, RowDataPacket } from 'mysql2'; // Import OkPacket and RowDataPacket from mysql2

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;

  try {
    // Handle GET requests to fetch recipes by category
    if (method === 'GET') {
      const { category } = query;

      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }

      // Fetch recipes by category
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM recipes WHERE category = ?',
        [category]
      );
      

      if (rows.length === 0) {
        return res.status(404).json({ error: `No recipes found for category: ${category}` });
      }

      return res.status(200).json(rows);
    }

    // Handle POST requests to create a new recipe
    else if (method === 'POST') {
      const {
        recipeName,
        recipeAuthor,
        preptime,
        cooktime,
        totaltime,
        servings,
        description,
        category,
        ingredients,
        instructions,
        image,
      } = body;

      // Validation: Ensure all required fields are provided
      if (
        !recipeName ||
        !recipeAuthor ||
        !preptime ||
        !cooktime ||
        !totaltime ||
        !servings ||
        !description ||
        !category ||
        !ingredients ||
        !instructions ||
        !image
      ) {
        return res.status(400).json({
          error: 'All fields are required: recipeName, recipeAuthor, preptime, cooktime, totaltime, servings, description, category, ingredients, instructions, and image',
        });
      }

      // Insert a new recipe into the database
      const [result] = await pool.execute<OkPacket>(
        'INSERT INTO recipes (recipeName, recipeAuthor, preptime, cooktime, totaltime, servings, description, category, ingredients, instructions, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          recipeName,
          recipeAuthor,
          preptime,
          cooktime,
          totaltime,
          servings,
          description,
          category,
          ingredients,
          instructions,
          image,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(500).json({ error: 'Failed to create recipe' });
      }

      return res.status(201).json({ message: 'Recipe created successfully!' });
    }

    // Handle PUT requests to update recipe information
    else if (method === 'PUT') {
      const { id } = query;

      if (!id) {
        return res.status(400).json({ error: 'Recipe ID is required for update' });
      }

      // Parsing data from the body
      const {
        recipeName,
        recipeAuthor,
        preptime,
        cooktime,
        totaltime,
        servings,
        description,
        category,
        ingredients,
        instructions,
        image,
      } = body;

      // Validation: Ensure all required fields are provided
      if (
        !recipeName ||
        !recipeAuthor ||
        !preptime ||
        !cooktime ||
        !totaltime ||
        !servings ||
        !description ||
        !category ||
        !ingredients ||
        !instructions ||
        !image
      ) {
        return res.status(400).json({
          error: 'All fields are required: recipeName, recipeAuthor, preptime, cooktime, totaltime, servings, description, category, ingredients, instructions, and image',
        });
      }

      // Update the recipe's details in the database
      const [result] = await pool.execute<OkPacket>(
        'UPDATE recipes SET recipeName = ?, recipeAuthor = ?, preptime = ?, cooktime = ?, totaltime = ?, servings = ?, description = ?, category = ?, ingredients = ?, instructions = ?, image = ? WHERE id = ?',
        [
          recipeName,
          recipeAuthor,
          preptime,
          cooktime,
          totaltime,
          servings,
          description,
          category,
          ingredients,
          instructions,
          image,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Recipe not found or no updates applied' });
      }

      return res.status(200).json({ message: 'Recipe updated successfully!' });
    }

    // Handle unsupported HTTP methods
    else {
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling request:', error);

    // Generic error response
    return res.status(500).json({ error: 'An unexpected error occurred', details: String(error) });
  }
}
