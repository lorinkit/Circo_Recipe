// pages/api/recipes/update.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'circo_db',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDirectory = path.join(process.cwd(), 'public', 'images', 'recipes');

// Helper functions
const fileExists = (filePath: string): boolean => fs.existsSync(filePath);

const handleFileError = (error: any, res: NextApiResponse) => {
  console.error('Error handling file upload:', error);
  res.status(500).json({ error: 'Error handling file upload', details: error.message || 'Unknown error occurred' });
};

const handleValidationError = (message: string, res: NextApiResponse) => {
  res.status(400).json({ error: message });
};

const handleDatabaseError = (error: any, res: NextApiResponse) => {
  console.error('Error interacting with the database:', error);
  res.status(500).json({ error: 'Failed to update recipe data', details: error.message || 'Unknown error occurred' });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        handleFileError(err, res);
        return;
      }

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
      } = fields;

      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      // Prepare the fields to update dynamically
      const updatedFields: any = {};

      if (recipeName) updatedFields.recipeName = recipeName;
      if (recipeAuthor) updatedFields.recipeAuthor = recipeAuthor;
      if (preptime) updatedFields.preptime = preptime;
      if (cooktime) updatedFields.cooktime = cooktime;
      if (totaltime) updatedFields.totaltime = totaltime;
      if (servings) updatedFields.servings = servings;
      if (description) updatedFields.description = description;
      if (category) updatedFields.category = category;
      if (ingredients) updatedFields.ingredients = ingredients;
      if (instructions) updatedFields.instructions = instructions;

      // Only handle image upload if a new file is provided
      let newImagePath = null;
      if (file) {
        try {
          // Check if the recipe exists
          const [existingRecipeRows] = await db.query<mysql.RowDataPacket[]>('SELECT image FROM recipes WHERE id = ?', [id]);
          if (existingRecipeRows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
          }

          const existingRecipe = existingRecipeRows[0];
          const oldImagePath = path.join(uploadDirectory, existingRecipe.image.replace('images/recipes/', ''));

          // Delete the old image if it exists
          if (fileExists(oldImagePath)) fs.unlinkSync(oldImagePath);

          // Generate new image path
          const fileName = file.originalFilename || '';
          if (!fileName) return handleValidationError('Invalid file name', res);

          newImagePath = `images/recipes/${fileName}`;
          const uploadPath = path.join(uploadDirectory, fileName);

          // Copy the new image to the upload directory
          fs.copyFileSync(file.filepath, uploadPath);
          fs.unlinkSync(file.filepath);  // Clean up the temp file
        } catch (error) {
          return handleFileError(error, res);
        }
      }

      // If an image was provided, include it in the update fields
      if (newImagePath) updatedFields.image = newImagePath;

      // If no fields are provided for update, return validation error
      if (Object.keys(updatedFields).length === 0) {
        return handleValidationError('At least one field must be provided for update', res);
      }

      try {
        // Update only the fields that were changed
        const updateQuery = 'UPDATE recipes SET ? WHERE id = ?';
        await db.query(updateQuery, [updatedFields, id]);

        res.status(200).json({ message: 'Recipe updated successfully!' });
      } catch (error) {
        return handleDatabaseError(error, res);
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
