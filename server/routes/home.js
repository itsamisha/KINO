const router = require('express').Router()
const { query } = require('express');
const pool = require('../database')
const axios = require('axios');

//signIn
router.post("/signin",async(req,res)=>
{try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const userInfo = result.rows[0];
    if (password !== userInfo.password) {
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
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }

})

//Registration
router.post("/register", async (req,res) => {
    try {
        const {email,password, name, phoneNumber, userType } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1 ", [email])

        if(user.rows.length === 1){
            res.send({success:false, message : "Email already in use"})
        }

        else{
            const newUser = await pool.query(
                "INSERT INTO users (email, password, name, phone_number, user_type, registration_date) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *",
                [email, password, name, phoneNumber, userType]
            );
            res.status(200).send({ success: true, data: newUser.rows });
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({success: false, error: error.message})
    }
})

//Fetch popular products
router.get("/popular", async(req,res)=>{
    try {
        const products = await pool.query("SELECT * FROM product ORDER BY purchase_count DESC")
        res.status(200).send(products.rows)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})

//Fetch New Arrivals
router.get("/new-arrival", async(req,res) =>{
    try {
        const products = await pool.query("SELECT * FROM product ORDER BY product_id DESC LIMIT 10")
        res.status(200).send(products.rows)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
})

//setting images 
// router.get("/photos", async (req, res) => {
//     try {
//         const products = await pool.query("SELECT * FROM product");

//         // Fetch Unsplash photos for each product
//         const productsWithPhotos = await Promise.all(products.rows.map(async (product) => {
//             const unsplashResponse = await axios.get('https://api.unsplash.com/photos?', {
//                 params: {
//                     query: product.name, 
//                     client_id: 'QARjXzyZmHpJwHJrc61TbUpz6D3ghMa_nk2wcjxU33U',
//                 },
//             });
//             console.log(product.name)

            
          
            
//                 // await pool.query("UPDATE product SET photo_url = $1 WHERE product_id = $2",['https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',product.product_id])
//                 const data = JSON.parse(unsplashResponse)
//                 const randomIndex = Math.floor(Math.random() * data.results.length);

//                 const randomPhotoUrl = data.results[randomIndex].urls.regular;
//                 console.log(randomPhotoUrl)
                
           
//         }));

//         res.status(200).send(productsWithPhotos);
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// });
let randomPhotoUrl;
router.get("/photos", async (req, res) => {
    try {
        const products = await pool.query("SELECT * FROM product WHERE product_id < 3");

        // Fetch Unsplash photos for each product
        const productsWithPhotos = await Promise.all(products.rows.map(async (product) => {
            try {
                const unsplashResponse = await axios.get('https://api.unsplash.com/photos/', {
                    params: {
                        query: 'cats',
                        // client_id: 'QARjXzyZmHpJwHJrc61TbUpz6D3ghMa_nk2wcjxU33U',
                        client_id: 'GjsMBVfSCqxwVL05d9vPtatujrcKnHhxgyu0oUy5I8Y'
                    },
                });
                console.log(product.name)
                // Assuming unsplashResponse.data is already in JSON format
                const data = unsplashResponse.data;
                // console.log(data)
                
                randomPhotoUrl= data[0].urls.regular;

                console.log(randomPhotoUrl);

                // Update the product with the photo URL
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