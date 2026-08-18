const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 記憶體商品資料庫（初始化為空）
let products = [];
let isAuth = true; // 管理員驗證狀態

// 1. 管理員驗證與登入
app.get('/api/admin/check-auth', (req, res) => {
  res.json({ authenticated: isAuth });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === "laopi_shopp" && password === "laopi274628") {
    isAuth = true;
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: '帳號密碼錯誤' });
});

app.post('/api/admin/logout', (req, res) => {
  isAuth = false;
  res.json({ success: true });
});

// 2. 取得所有商品 (前後端通用)
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 3. 新增商品
app.post('/api/products', (req, res) => {
  const { name, price, category, imageUrl, description } = req.body;
  const newProduct = {
    id: Date.now(),
    name: name || '未命名商品',
    price: Number(price) || 0,
    category: category || '預設分類',
    imageUrl: imageUrl || '',
    description: description || '',
    isActive: true
  };
  products.unshift(newProduct);
  res.json({ success: true, product: newProduct });
});

// 4. 編輯商品
app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, price, category, imageUrl, description } = req.body;
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      name: name || products[index].name,
      price: Number(price) || products[index].price,
      category: category || products[index].category,
      imageUrl: imageUrl || products[index].imageUrl,
      description: description || products[index].description
    };
    return res.json({ success: true, product: products[index] });
  }
  res.status(404).json({ success: false, message: '找不到商品' });
});

// 5. 上下架商品
app.patch('/api/products/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    product.isActive = !product.isActive;
    return res.json({ success: true, product });
  }
  res.status(404).json({ success: false, message: '找不到商品' });
});

// 6. 刪除商品
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});