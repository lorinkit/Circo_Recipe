import { NextApiRequest, NextApiResponse } from 'next';
import { pool  } from '@/configs/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
      const values = [username, password];
      const [rows]: any = await pool.execute(query, values);

      if (rows.length > 0) {
        return res.status(200).json({ message: 'Login successful!', user: rows[0] });
      } else {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Database error. Please try again later.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

