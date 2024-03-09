const router = require('express').Router()
const pool = require('../database')

router.post("/purchase", async (req,res) => {
    try {
        const {amount,message,to_email,from_user_id,design} = req.body;
        await pool.query(`SELECT purchase_gift_card($1,$2,$3,$4,$5)`,[amount,message,to_email,from_user_id,design])
        res.json({success:true,  message: `Gift card from -- ${from_user_id} -- to -- ${to_email}` });
    } catch (error) {
        console.error(`Error in /giftcard/purchase route: ${error.message}`);
        res.status(500).send({success: false, error: error.message})
    }
  })
  //Received gift cards 
router.get("/received/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const giftcards = await pool.query(
            `SELECT amount,initial_amount, message, (SELECT name FROM users WHERE user_id = from_user_id) AS name, gift_card_code, design, purchase_date
            FROM gift_card WHERE user_id = $1
            ORDER BY amount DESC;`, [user_id] 
        );
        if (giftcards.rows.length !== 0) {
            res.json(giftcards.rows); 
        } else {
            res.status(404).json({ message: 'Gift card not found' });
        }
    } catch (error) {
        console.error(`Error in /giftcard/received/:user_id` + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Sent gift cards
router.get("/sent/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const giftcards = await pool.query(
            `SELECT (SELECT name FROM users WHERE user_id = G.user_id) AS name, initial_amount, message,gift_card_code,design, purchase_date
            FROM gift_card G
            WHERE G.from_user_id = $1;`, [user_id] 
        );
        if (giftcards.rows.length !== 0) {
            res.json(giftcards.rows); 
        } else {
            res.status(404).json({ message: 'Gift card not found' });
        }
    } catch (error) {
        console.error(`Error in /giftcard/sent/:user_id` + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Valid to_email 
router.get("/valid_email/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await pool.query(
            `SELECT user_id FROM users WHERE email = $1`, [email] 
        );
        if (user.rows.length === 1) {
            res.json(user.rows[0]); 
        } else {
            res.status(404).json({ user_id : -1 });
        }
    } catch (error) {
        console.error(`Error in /giftcard/:\n` + error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  module.exports = router;