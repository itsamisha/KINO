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
// app.get('/categories', async (req, res) => {
//     try {
//       const categoriesQuery = 'SELECT * FROM category ORDER BY category_name;';
//       const categoriesResult = await pool.query(categoriesQuery);
//       res.json({ categories: categoriesResult.rows });
//     } catch (error) {
//       console.error('Error fetching categories:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
//search
router.get('/search', async (req, res) => {
    try {
        const { search, option } = req.query;

        // Validate query parameters
        if (!search || !option) {
            return res.status(400).json({ error: 'Both search and option parameters are required' });
        }

        let searchQuery;
        switch (option) {
            case 'product':
                searchQuery = `SELECT * FROM product WHERE LOWER(name) LIKE LOWER($1) ORDER BY purchase_count DESC;`;
                break;
            case 'category':
                // Adjust this query based on your actual schema
                searchQuery = `SELECT * FROM product p JOIN category c
                ON (p.product_id=c.product_id)  
                WHERE LOWER(category_name) LIKE LOWER($1) 
                ORDER BY purchase_count DESC;`;
                break;
            case 'seller':
                searchQuery = `SELECT * FROM product JOIN users
                 ON users.user_id = product.user_id 
                WHERE LOWER(users.name) LIKE LOWER($1) 
                ORDER BY purchase_count DESC;`;
                break;
            default:
                return res.status(400).json({ error: 'Invalid search option' });
        }

        const searchResults = await pool.query(searchQuery, [`%${search}%`]);
        res.status(200).json({ success: true, results: searchResults.rows });
    } catch (error) {
        console.error(`Error in search route: ${error.message}`);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

  

//Fetch popular products
router.get("/popular", async(req,res)=>{
    try {
        const products = await pool.query("SELECT * FROM product ORDER BY purchase_count DESC LIMIT 12")
        res.status(200).send(products.rows)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})

//Fetch New Arrivals
router.get("/new-arrival", async(req,res) =>{
    try {
        const products = await pool.query("SELECT * FROM product ORDER BY product_id  DESC LIMIT 12")
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
        "SELECT p.* FROM product p WHERE p.product_id = $1",
        [product_id]
      );
      res.status(200).send(products.rows[0]);
      console.log(products.rows)
    } catch (error) {
        console.error(`Error in /popular route: ${error.message}`)
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

  

module.exports = router

