const fetch = require('node-fetch');
const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "password",
    host: "localhost",
    port: "5432",
    database: "kino"
})
const apiUrl = 'https://fakestoreapi.com/products/category/jewelery';

async function fetchDataAndInsert() {
  try {
    const response = await fetch(apiUrl);
    const products = await response.json();
    const user_id = 18;
    const stock_quantity = Math.floor(Math.random() * 11);
    const purchase_count = Math.floor(Math.random() * 11)
    // Insert products into the 'products' table
    const productIds = await Promise.all(
      products.map(async (product) => {
        const { title, price, description,image } = product;

        const result = await pool.query(
          'INSERT INTO products (name, price, description, user_id, photo_url, stock_quantity, purchase_count) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [title, price, description,user_id , image, stock_quantity, purchase_count]
        );

        return result.rows[0].id;
      })
    );

    // Insert category information into the 'categories' table
    await Promise.all(
      productIds.map(async (productId, index) => {
        const category = products[index].category;

        await pool.query(
          'INSERT INTO categories (name, product_id) VALUES ($1, $2)',
          [category, productId]
        );
      })
    );

    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error fetching or inserting data:', error.message);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

fetchDataAndInsert();
