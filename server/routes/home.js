const router = require('express').Router()
const pool = require('../database')
const axios = require('axios');
const bcrpyt = require('bcrypt')


//signIn
router.post("/signin",async(req,res)=>
{try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }
    
    const userInfo = result.rows[0];

    const isMatch = await bcrpyt.compare(password,userInfo.password)
    if (!isMatch) {
        return res.json({ success: false, message: 'Invalid email or password' });
      }

    if (userInfo.user_type === 'customer') {
        // res.json({ success: true, message: 'Sign-in successful', redirectTo: `/customer-info/${userInfo.user_id}`, userInfo});
        res.json({ success: true, message: 'Sign-in successful', redirectTo: "/", userInfo});
      }

      else {
        res.json({ success: true, message: 'Sign-in successful', redirectTo: `/seller-dashboard/${userInfo.user_id}`});
      }

  } catch (error) {
    console.error(`Error in /signin route: ${error.message}`);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }

})

//Registration
router.post("/register", async (req,res) => {
    try {
        const {email,password, name, phoneNumber, userType } = req.body;

        const hash = await bcrpyt.hash(password,10)
        const user = await pool.query("SELECT * FROM users WHERE email = $1 ", [email])

        if(user.rows.length === 1){
            res.send({success:false, message : "Email already in use"})
        }

        else{
            const newUser = await pool.query(
                "INSERT INTO users (email, password, name, phone_number, user_type, registration_date) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *",
                [email, hash, name, phoneNumber, userType]
            );
            res.status(200).send({ success: true, data: newUser.rows });
        }
        
    } catch (error) {
        console.error(`Error in /register route: ${error.message}`);
        res.status(500).send({success: false, error: error.message})
    }
})
// //getting categories
router.get('/category', async (req, res) => {
    try {
      const categoriesQuery = 'SELECT DISTINCT(category_name) FROM category ORDER BY category_name';
      const categoriesResult = await pool.query(categoriesQuery);
      
      // Extract category names from the result
      const categoryNames = categoriesResult.rows.map(row => row.category_name);
  
      res.status(200).json({ categories: categoryNames });
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
//search
// router.get('/search', async (req, res) => {
//     try {
//         const { search, option, category, minPrice, maxPrice } = req.query;

//         if (!search || !option) {
//             return res.status(400).json({ error: 'Both search and option parameters are required' });
//         }

//         let searchQuery;
//         let queryParams = [`%${search}%`];
//         switch (option) {
//             case 'product':
//                 searchQuery = `SELECT DISTINCT p.* FROM product  p JOIN category c ON (p.product_id=c.product_id)  WHERE LOWER(name) LIKE LOWER($1)`;
//                 if (category) {
//                     searchQuery += ` AND LOWER(category_name) LIKE LOWER($${queryParams.length + 1})`;
//                     queryParams.push(`%${category}%`);
//                 }
//                 break;

//             case 'seller':
//                 searchQuery = `SELECT DISTINCT p.* FROM product  p JOIN category c ON (p.product_id=c.product_id) JOIN users ON users.user_id = product.user_id 
//                                WHERE LOWER(users.name) LIKE LOWER($1)`;
//                                if (category) {
//                     searchQuery += ` AND LOWER(category_name) LIKE LOWER($${queryParams.length + 1})`;
//                     queryParams.push(`%${category}%`);
//                 }
//                 if (category) {
//                     searchQuery += ` AND LOWER(category_name) LIKE LOWER($${queryParams.length + 1})`;
//                     queryParams.push(`%${category}%`);
//                 }
//                 break;
//             default:
//                 return res.status(400).json({ error: 'Invalid search option' });
//         }

//         if (minPrice) {
//             searchQuery += ` AND price >= $${queryParams.length + 1}`;
//             queryParams.push(minPrice);
//         }
//         if (maxPrice) {
//             searchQuery += ` AND price <= $${queryParams.length + 1}`;
//             queryParams.push(maxPrice);
//         }

//         searchQuery += ` ORDER BY purchase_count DESC;`;

//         const searchResults = await pool.query(searchQuery, queryParams);
//         res.status(200).json({ success: true, results: searchResults.rows });
//     } catch (error) {
//         console.error(`Error in search route: ${error.message}`);
//         res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
// });
router.get("/search", async (req, res) => {
  try {
    const { search, option } = req.query;

    // Validate query parameters
    if (!search || !option) {
      return res
        .status(400)
        .json({ error: "Both search and option parameters are required" });
    }

    let searchQuery;
    switch (option) {
      case "product":
        searchQuery = `SELECT P.*, ROUND((D.discount_percentage*100),0) AS discount_pct,
        ROUND(P.price*(1-D.discount_percentage),2) AS new_price
        FROM product P LEFT JOIN discount D
        ON P.product_id = D.product_id
        WHERE LOWER(P.name) LIKE LOWER($1)
        AND P.stock_quantity > 0
        ORDER BY P.purchase_count DESC`;
        break;
        
      case "seller":
        searchQuery = `SELECT 	P.* FROM product P JOIN users U
        ON U.user_id = P.user_id 
       WHERE LOWER(U.name) LIKE LOWER($1) AND U.user_type='seller'
       AND P.stock_quantity > 0
       ORDER BY purchase_count DESC;`;
        break;
      default:
        return res.status(400).json({ error: "Invalid search option" });
    }

    const searchResults = await pool.query(searchQuery, [`%${search}%`]);
    res.status(200).json({ success: true, results: searchResults.rows });
  } catch (error) {
    console.error(`Error in search route: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


//Fetch popular products
router.get("/popular", async(req,res)=>{
    try {
        const products = await pool.query(`SELECT P.*, ROUND((D.discount_percentage*100),0) AS discount_pct,
        ROUND(P.price*(1-D.discount_percentage),2) AS new_price
        FROM product P LEFT JOIN discount D
        ON P.product_id = D.product_id
        AND P.stock_quantity > 0
        ORDER BY P.purchase_count DESC
        LIMIT 12`)
        res.status(200).send(products.rows)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})

//Fetch New Arrivals
router.get("/new-arrival", async(req,res) =>{
    try {
        const products = await pool.query(`
        SELECT P.*, ROUND((D.discount_percentage*100),0) AS discount_pct,
        ROUND(P.price*(1-D.discount_percentage),2) AS new_price
        FROM product P LEFT JOIN discount D
        ON P.product_id = D.product_id
        AND P.stock_quantity > 0
        ORDER BY P.product_id DESC
        LIMIT 12`)
        res.status(200).send(products.rows)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})
//Fetch discount products
router.get("/discount-product", async(req,res) =>{
    try {
        const products = await pool.query(`SELECT P.*, ROUND((D.discount_percentage*100),0) AS discount_pct,
        ROUND(P.price*(1-D.discount_percentage),2) AS new_price
        FROM product P JOIN discount D
        ON P.product_id = D.product_id
        AND P.stock_quantity > 0
        ORDER BY D.discount_percentage DESC
        LIMIT 12`)
        res.status(200).send(products.rows)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})

//Fetch Similar Products
router.get("/similar-products/:product_id", async(req,res) =>{
  try {
      const {product_id} = req.params
      const products = await pool.query(`SELECT P.*,
      ROUND(P.price*(1-D.discount_percentage),2) as new_price,
      ROUND(D.discount_percentage*100,0) as discount_pct
      FROM product P LEFT JOIN product SP
      ON P.user_id = SP.user_id
      LEFT JOIN discount D 
      ON D.product_id = P.product_id
      WHERE P.user_id = (SELECT user_id FROM product
      WHERE product_id= $1)
      AND P.product_id <> $1
      AND P.stock_quantity > 0
      GROUP BY P.product_id, D.discount_percentage
      ORDER BY RANDOM()
      LIMIT 12;`,[product_id])
      res.status(200).send(products.rows)
  } catch (error) {
      console.log(error.message)
      res.status(400).send(error.message)
  }
})

//Fetch Specific product
router.get("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    const products = await pool.query(
      `SELECT P.*, U.name AS Shop,
      STRING_AGG(C.category_name, ', ') AS category_name,
      ROUND((P.price - COALESCE(D.discount_percentage, 0) * P.price), 2) AS new_price 
      FROM product P 
      JOIN users U ON U.user_id = P.user_id AND product_id = $1
      LEFT JOIN category C ON C.product_id = P.product_id 
      LEFT JOIN discount D ON D.product_id = P.product_id
      GROUP BY P.product_id, U.name, P.price, D.discount_percentage;`,
      [product_id]
    );

    if (!products.rows.length) {
      res.status(404).send("Product not found");
      return;
    }

    console.log(products.rows[0]);
    res.status(200).send(products.rows[0]);
  } catch (error) {
    console.error(`Error in /popular route: ${error.message}`);
    res.status(400).send(error.message);
  }
});





router.get("/photos", async (req, res) => {
    try {
        const products = await pool.query("SELECT * FROM product");

        // Fetch Unsplash photos for each product
        const productsWithPhotos = await Promise.all(products.rows.map(async (product) => {
            try {
                
                const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos?', {
                    params: {
                        query: `${product.name}`,
                        // client_id: 'QARjXzyZmHpJwHJrc61TbUpz6D3ghMa_nk2wcjxU33U',
                        // client_id: 'GjsMBVfSCqxwVL05d9vPtatujrcKnHhxgyu0oUy5I8Y'
                        client_id: 'IOK4GGRXvtyG32o5Ze-qOZoFq_HH7a_UMs70TqvJD48'
                    },
                });
                console.log(product.name)
                console.log(`Unsplash API URL: https://api.unsplash.com/photos/?query=${product.name}&client_id=GjsMBVfSCqxwVL05d9vPtatujrcKnHhxgyu0oUy5I8Y`);

                const randomPhotoUrl= unsplashResponse.data.results[0].urls.regular;

                console.log(randomPhotoUrl);

                await pool.query("UPDATE product SET photo_url = $1 WHERE product_id = $2", [randomPhotoUrl, product.product_id]);
                
            } catch (error) {
                console.error(`Error fetching or updating for product ${product.product_id}: ${error.message}`);
            }
        }));

        res.status(200).send(productsWithPhotos);
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
});

module.exports = router;
