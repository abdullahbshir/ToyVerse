// const express = require('express');
// const sql = require('mssql');
// const cors = require('cors');
// const bcrypt = require('bcrypt');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // SQL Server config – toyuser login
// const config = {
//   server: 'localhost',
//   port: 1433,
//   database: 'ToyVerseDB',
//   options: {
//     trustedConnection: true,
//     trustServerCertificate: true,
//   },
// };

// let pool;
// async function getPool() {
//   if (!pool) {
//     pool = await sql.connect(config);
//     console.log('✅ SQL Server se connect ho gaya');
//   }
//   return pool;
// }

// // Signup API
// app.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'All fields required' });
//     }
//     if (password.length < 6) {
//       return res.status(400).json({ error: 'Password min 6 chars' });
//     }

//     const db = await getPool();

//     const check = await db.request()
//       .input('email', sql.NVarChar, email)
//       .query('SELECT id FROM Users WHERE email = @email');
//     if (check.recordset.length > 0) {
//       return res.status(409).json({ error: 'Email already registered' });
//     }

//     const hash = await bcrypt.hash(password, 10);
//     const result = await db.request()
//       .input('name', sql.NVarChar, name)
//       .input('email', sql.NVarChar, email)
//       .input('password', sql.NVarChar, hash)
//       .query(`
//         INSERT INTO Users (name, email, password_hash)
//         OUTPUT INSERTED.id, INSERTED.name, INSERTED.email
//         VALUES (@name, @email, @password)
//       `);

//     const user = result.recordset[0];
//     const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fbbf24&color=fff`;

//     res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, avatar } });
//   } catch (err) {
//     console.error('Signup error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Login API
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password required' });
//     }

//     const db = await getPool();
//     const result = await db.request()
//       .input('email', sql.NVarChar, email)
//       .query('SELECT id, name, email, password_hash FROM Users WHERE email = @email');

//     const user = result.recordset[0];
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     const match = await bcrypt.compare(password, user.password_hash);
//     if (!match) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Login log insert karo
//     await db.request()
//       .input('user_id', sql.Int, user.id)
//       .input('ip', sql.NVarChar, req.ip)
//       .query('INSERT INTO LoginLogs (user_id, ip_address) VALUES (@user_id, @ip)');

//     const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fbbf24&color=fff`;

//     res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, avatar } });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Backend API ready: http://localhost:${PORT}`);
// });
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: 'tvuser',
  password: 'Tv@12345',
  server: 'localhost',
  port: 1435,           // 👈 static port 1435
  database: 'ToyVerseDB',
  options: {
    trustServerCertificate: true,
  },
};

let pool;
async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log('✅ SQL Server se connect ho gaya');
  }
  return pool;
}

// Signup – Users table mein insert
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password min 6 chars' });

    const db = await getPool();

    const check = await db.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM Users WHERE email = @email');
    if (check.recordset.length > 0) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const result = await db.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hash)
      .query(`INSERT INTO Users (name, email, password_hash) OUTPUT INSERTED.id, INSERTED.name, INSERTED.email VALUES (@name, @email, @password)`);

    const user = result.recordset[0];
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fbbf24&color=fff`;
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, avatar } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login – Users verify + LoginLogs insert
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const db = await getPool();
    const result = await db.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id, name, email, password_hash FROM Users WHERE email = @email');
    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    await db.request()
      .input('user_id', sql.Int, user.id)
      .input('ip', sql.NVarChar, req.ip)
      .query('INSERT INTO LoginLogs (user_id, ip_address) VALUES (@user_id, @ip)');

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fbbf24&color=fff`;
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, avatar } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Checkout API – CheckoutOrders table mein insert
app.post('/checkout', async (req, res) => {
  try {
    const {
      firstName, lastName, email,
      address, city, state, zipCode, country,
      paymentMethod, totalAmount, userId
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode || !paymentMethod || totalAmount == null) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const db = await getPool();

    await db.request()
      .input('user_id', sql.Int, userId || null)
      .input('first_name', sql.NVarChar, firstName)
      .input('last_name', sql.NVarChar, lastName)
      .input('email', sql.NVarChar, email)
      .input('address', sql.NVarChar, address)
      .input('city', sql.NVarChar, city)
      .input('state', sql.NVarChar, state)
      .input('zip_code', sql.NVarChar, zipCode)
      .input('country', sql.NVarChar, country || 'United States')
      .input('payment_method', sql.NVarChar, paymentMethod)
      .input('total_amount', sql.Decimal(10, 2), totalAmount)
      .query(`INSERT INTO CheckoutOrders 
              (user_id, first_name, last_name, email, address, city, state, zip_code, country, payment_method, total_amount)
              VALUES (@user_id, @first_name, @last_name, @email, @address, @city, @state, @zip_code, @country, @payment_method, @total_amount)`);

    res.json({ success: true, message: 'Order placed successfully' });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend API ready: http://localhost:${PORT}`));