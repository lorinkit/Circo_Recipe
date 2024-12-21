import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

// Database connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'circo_db',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    // Validate ID
    if (!id || typeof id !== 'string' || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    try {
      // Retrieve the image path from the database
      const [animalRows] = await db.query<mysql.RowDataPacket[]>('SELECT image FROM recipes WHERE id = ?', [id]);
      if (animalRows.length === 0) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const recipe = animalRows[0];
      const imagePath = path.join(process.cwd(), 'public', 'images', 'recipes', recipe.image.replace('images/recipes/', ''));

      // Log the image path for debugging
      console.log("Image Path:", imagePath);

      // Delete the image file from the server if it exists
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image: ${imagePath}`);
      } else {
        console.warn(`Image not found for deletion: ${imagePath}`);
      }

      // Delete the recipe from the database
      const [deleteResult] = await db.query<mysql.ResultSetHeader>('DELETE FROM recipes WHERE id = ?', [id]);
      
      // Check if the recipe was actually deleted
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ error: 'Recipe not found in the database' });
      }

      return res.status(200).json({ message: 'Recipe deleted successfully!' });
    } catch (error) {
      // Type guard for unknown errors
      if (error instanceof Error) {
        console.error('Error deleting recipe data:', error.message);
        res.status(500).json({ error: 'Failed to delete recipe', details: error.message });
      } else {
        console.error('Unexpected error deleting recipe:', error);
        res.status(500).json({ error: 'Failed to delete recipe' });
      }
    }
  } else {
    // Handle method not allowed error
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}