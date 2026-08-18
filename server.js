const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 記憶體中暫存的商品列表
let products = [];

// 👑 最新管理員帳號與密碼
const ADMIN_USER = "laopi_shopp";
const ADMIN_PASS = "laopi274628";

// 1. 管理員登入 API
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true, token: 'laopi-admin-token-123' });
  } else {
    return res.status(401).json({ success: false, message: '帳號或密碼錯誤！' });
  }
});

// 2. 取得所有商品 API
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 3. 新增商品 API
app.post('/api/products', (req, res) => {
  const { name, price, description, imageUrl } = req.body;
  const newProduct = {
    id: Date.now(),
    name: name || '未命名商品',
    price: price || 0,
    description: description || '',
    imageUrl: imageUrl || ''
  };
  products.unshift(newProduct);
  res.json({ success: true, product: newProduct });
});

// 4. 刪除商品 API
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ 伺服器已成功啟動！網址：http://localhost:${PORT}`);
});