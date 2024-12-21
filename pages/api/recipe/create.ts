import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { pool } from '@/configs/database'; 
import { OkPacket } from 'mysql2';

// Upload directory for recipe images
const uploadDirectory = path.join(process.cwd(), 'public', 'images', 'recipes');

// Helper function to check if a file exists 
const fileExists = (filePath: string): boolean => fs.existsSync(filePath);

// Error handling function
const handleError = (error: any, res: NextApiResponse) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'An unexpected error occurred', details: error.message || 'Unknown error' });
};

// This will handle POST request for creating a new recipe (with file upload)
const handleFileUpload = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ multiples: false }); // Form parsing setup

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return handleError(err, res); // Handle error in file upload
    }

    try {
      // Extract values from fields and ensure they are strings, not arrays
      const recipeName = fields.recipeName ? String(fields.recipeName[0]) : '';
      const recipeAuthor = fields.recipeAuthor ? String(fields.recipeAuthor[0]) : '';
      const preptime = fields.preptime ? String(fields.preptime[0]) : '';
      const cooktime = fields.cooktime ? String(fields.cooktime[0]) : '';
      const totaltime = fields.totaltime ? String(fields.totaltime[0]) : '';
      const servings = fields.servings ? String(fields.servings[0]) : '';
      const description = fields.description ? String(fields.description[0]) : '';
      const category = fields.category ? String(fields.category[0]) : '';
      const ingredients = fields.ingredients ? String(fields.ingredients[0]) : '';
      const instructions = fields.instructions ? String(fields.instructions[0]) : '';
      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      // Validate required fields
      if (!recipeName || !description || !category || !ingredients || !instructions) {
        return res.status(400).json({
          error: 'Recipe name, description, category, ingredients, and instructions are required',
        });
      }

      let imagePath = '';

      // Handle file upload if provided
      if (file) {
        const fileName = file.originalFilename || '';
        if (!fileName) {
          return res.status(400).json({ error: 'Invalid file name' });
        }

        imagePath = `images/recipes/${fileName}`; // Set the image path
        const uploadPath = path.join(uploadDirectory, fileName);

        fs.copyFileSync(file.filepath, uploadPath); // Save the uploaded file
        fs.unlinkSync(file.filepath); // Clean up the uploaded file from temp
      }

      console.log('Recipe Name:', recipeName);
      console.log('Author:', recipeAuthor);
      console.log('Prep Time:', preptime);
      console.log('Cook Time:', cooktime);
      console.log('Total Time:', totaltime);
      console.log('Servings:', servings);
      console.log('Description:', description);
      console.log('Category:', category);
      console.log('Ingredients:', ingredients);
      console.log('Instructions:', instructions);
      console.log('Image Path:', imagePath);

      // Insert the new recipe data into the database
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
          imagePath
        ]
      );

      console.log('Result:', result);

      if (result.affectedRows === 0) {
        return res.status(500).json({ error: 'Failed to create recipe' });
      }

      return res.status(201).json({ message: 'Recipe created successfully!' });
    } catch (error) {
      return handleError(error, res);
    }
  });
};

// This will handle POST without file upload (for handling basic recipe creation without images)
const handleSimplePost = async (req: NextApiRequest, res: NextApiResponse) => {
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
  } = req.body;

  // Validation: Ensure all required fields are provided
  if (!recipeName || !description || !category || !ingredients || !instructions) {
    return res.status(400).json({
      error: 'All fields are required: recipeName, description, category, ingredients, and instructions',
    });
  }

  try {
    console.log('Recipe Name:', recipeName);
    console.log('Author:', recipeAuthor);
    console.log('Prep Time:', preptime);
    console.log('Cook Time:', cooktime);
    console.log('Total Time:', totaltime);
    console.log('Servings:', servings);
    console.log('Description:', description);
    console.log('Category:', category);
    console.log('Ingredients:', ingredients);
    console.log('Instructions:', instructions);
    console.log('Image:', image);

    // Insert the new recipe data into the database
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

    console.log('Result:', result);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to create recipe' });
    }

    return res.status(201).json({ message: 'Recipe created successfully!' });
  } catch (error) {
    return handleError(error, res); // Handle error in database insertion
  }
};

// Disable default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// The main handler for the POST request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    if (method === 'POST') {
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        // Use the handler with file parsing
        return handleFileUpload(req, res);
      } else {
        // Handle POST without file upload
        return handleSimplePost(req, res);
      }
    } else {
      // Handle unsupported HTTP methods
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    return handleError(error, res); // Handle error in request handling
  }
}
