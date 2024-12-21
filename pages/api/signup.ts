import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/configs/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { fullName, email, username, password } = req.body;

    try {
      if (!fullName || !email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const query = `INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)`;
      const values = [fullName, email, username, password];
      await pool.execute(query, values);

      return res.status(201).json({ message: 'User successfully created!' });
    } catch (error: any) {
      console.error('Database error:', error.message, error.stack);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Username or email already exists.' });
      }
      
      return res.status(500).json({ message: 'Database error. Please try again later.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}