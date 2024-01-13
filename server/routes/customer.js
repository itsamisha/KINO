
const router = require('express').Router()
const pool = require('../database')

router.get("/:user_id", async (req, res) => {
    try {
      const { user_id } = req.params;
      const customer = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
      if (customer.rows.length === 1) {
        res.json(customer.rows);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
 
  router.put("/change_password", async (req, res) => {
    try {
      
      console.log("here")
      
      const { id,newPassword } = req.body;
      
      // Update the password
      const update = await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [newPassword, id]);
  
      if (update.rowCount > 0) {
        res.json({ message: 'Password changed successfully' });
      } else {
        res.status(500).json({ message: 'Failed to change password' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router