import mysql, { MysqlError } from 'mysql';
import User from '@/types/user';


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'circodb',
  connectionLimit: 100,
});

const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM `users`", (error: { message: any; }, results: User[] | PromiseLike<User[]>) => {
      if (error) {
        console.log("MySQL Error:", error.message);
        reject(error.message);
        return;
      }
      resolve(results);
    });
  });
};

const insertUser = async (userData: { fullName: string; email: string; username: string; password: string }) => {
  return new Promise<void>((resolve, reject) => {
    const query = "INSERT INTO `users` (`fullname`, `email`, `username`, `password`) VALUES (?, ?, ?, ?)";
    const values = [userData.fullName, userData.email, userData.username, userData.password];

    pool.query(query, values, (error: MysqlError | null) => {
        if (error) {
          console.log("MySQL Error:", error.message);
          reject(error.message);
          return;
        }
        resolve();
      });
  });
};

export { getUsers, insertUser };