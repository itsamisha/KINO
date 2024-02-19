const router = require("express").Router();
const pool = require("../database");
const bcrpyt = require("bcrypt");
const fetch = require("node-fetch");

async function fetchRandomUserData() {
  const response = await fetch("https://randomuser.me/api/?results=10"); //
  const data = await response.json();
  return data.results;
}

async function insertUsersIntoDatabase(users) {
  for (const user of users) {
    const {
      email,
      login: { password },
      name,
      phone,
    } = user;
    const hash = await bcrpyt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (email, password, name, phone_number, user_type, registration_date) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)",
      [email, hash, `${name.first} ${name.last}`, phone, "customer"]
    );
  }
}

async function generateRandomReviews(userId) {
  const positiveReviewTexts = [
    "Absolutely love this store! Their products are top-notch and the customer service is superb!",
"I've been a loyal customer for years and have never been disappointed. Quality products and fast shipping!",
"Great selection and fantastic prices. Always my go-to for all my shopping needs.",
"Super easy to navigate the website and find what I'm looking for. 10/10 recommend!",
"Impressed with the quality of the items I ordered. Will definitely be back for more!",
"Fast delivery and everything arrived exactly as described. Couldn't be happier!",
"Excellent communication from the seller and the product exceeded my expectations.",
"I love supporting this store. They always have unique items you can't find elsewhere.",
"The online shopping experience here is seamless. I never have any issues!",
"Amazing customer service! They really go above and beyond to make sure you're satisfied.",
"I've recommended this store to all my friends and family. You won't be disappointed!",
"The website is user-friendly and the checkout process is quick and easy.",
"High-quality products at affordable prices. What more could you ask for?",
"I've ordered from this store multiple times and have never been let down. A+!",
"The shipping was lightning-fast and everything was well-packaged. Very impressed!",
"The variety of products available is outstanding. I always find something I love.",
"The prices are unbeatable and the quality is unmatched. Such a great combination!",
"I'm always excited to see what new items they have in stock. Never disappoints!",
"I received my order earlier than expected and it was exactly what I wanted.",
"I've had nothing but positive experiences shopping here. Highly recommend!",
"The customer service team is so friendly and helpful. They really care about their customers.",
"Every purchase I've made has been a great investment. Love this store!",
"I appreciate the attention to detail in packaging. It shows they really care about their products.",
"The prices are so reasonable, I can't resist treating myself every now and then.",
"I love that I can shop from the comfort of my own home and still get amazing products.",
"The products are even better in person than they look online. Such high quality!",
"I've never had any issues with returns or exchanges. The process is seamless.",
"This store has become my one-stop-shop for all my shopping needs. So convenient!",
"The website is always up-to-date with the latest trends. I love staying in style with this store.",
"I'm always impressed by how quickly they restock popular items. They really listen to their customers.",
"I've shopped around and this store consistently has the best prices. No need to go anywhere else!",
"The customer reviews really help me make informed decisions about my purchases.",
"I love that they offer a variety of payment options. Makes checkout a breeze!",
"The loyalty rewards program is a nice bonus. I feel appreciated as a repeat customer.",
"I've never had any issues with the quality of the products. Everything I've ordered has been top-notch.",
"I've recommended this store to all my coworkers and they've all had positive experiences.",
"The website layout is clean and organized, making it easy to find what I'm looking for.",
"The sales and discounts they offer are unbeatable. I always score a great deal!",
"The packaging is always secure, so I never have to worry about items arriving damaged.",
"I love that they offer free shipping on orders over a certain amount. It really adds value to my purchase.",
"The customer service team is always quick to respond to any questions or concerns I have.",
"I appreciate that they prioritize sustainability in their packaging and products.",
"I've shopped here for years and have never had a bad experience. Consistently excellent!",
"The product descriptions are thorough and accurate, so I always know exactly what I'm getting.",
"The store offers a great selection of eco-friendly and ethically sourced products. Love supporting businesses with a conscience!",
"The checkout process is a breeze and I always receive confirmation emails promptly.",
"The website is mobile-friendly, so I can easily shop on the go. Such a time-saver!",
"I've had to contact customer service a couple of times and they've always been incredibly helpful and friendly.",
"I appreciate that they offer hassle-free returns. It gives me peace of mind when making a purchase.",
"I've ordered gifts for friends and family from this store and they've always been a hit!",
"The product selection is diverse, catering to a wide range of interests and preferences.",
"I love that they offer personalized recommendations based on my past purchases. It makes shopping so much easier!",
"The website is secure, so I feel confident entering my payment information.",
"I've had items delivered internationally and they always arrive on time and in perfect condition.",
"I love that they offer free gift wrapping. It adds a special touch to my purchases.",
"The website features customer reviews prominently, which helps me make informed decisions.",
"I appreciate that they offer a satisfaction guarantee. It shows they stand behind their products.",
"The store offers a great selection of products for every budget. There's something for everyone!",
"I've never had any issues with orders being lost or delayed. Everything arrives in a timely manner.",
"I've shopped around and this store consistently offers the best value for my money. I'm a customer for life!"

  ];

  const negativeReviewTexts = [
    "Disappointed with my recent purchase. The product didn't meet my expectations at all.",
    "Terrible experience with this store. The item I received was damaged and unusable.",
    "Avoid shopping here! They have poor quality products and unreliable customer service.",
    "Waste of money. The product fell apart after just a few uses.",
    "I regret ordering from this store. The shipping took forever and the item was subpar.",
    "Frustrating experience. The website is glitchy and difficult to navigate.",
    "Unimpressed with the product selection. They don't offer anything unique or special.",
    "I won't be shopping here again. The customer service was rude and unhelpful.",
    "Stay away from this store. The prices are too high for the low-quality products.",
    "Extremely disappointed with my order. It arrived late and was completely wrong.",
    "Horrible shopping experience. The checkout process was a nightmare.",
    "I feel cheated by this store. The product description was misleading and inaccurate.",
    "Unreliable shipping. My package was lost in transit and customer service was unresponsive.",
    "The product looked nothing like the picture online. I feel deceived.",
    "I'm frustrated with this store's return policy. It's complicated and inconvenient.",
    "The product broke within days of receiving it. Complete waste of money.",
    "I wouldn't recommend shopping here. The items are overpriced and low quality.",
    "Poorly made products. It's obvious they cut corners on manufacturing.",
    "I'm disappointed in the lack of communication from this store. They never update on shipping status.",
    "I received the wrong item and customer service was unhelpful in resolving the issue.",
    "This store is a scam. Don't trust their false advertising.",
    "I'm unsatisfied with my purchase. The item arrived damaged and poorly packaged.",
    "I'm fed up with this store's lack of professionalism. They never respond to inquiries.",
    "The product arrived late and wasn't worth the wait. I'm extremely disappointed.",
    "I'm upset with the poor quality of the item I received. It's not worth the price.",
    "This store's return policy is a joke. They make it nearly impossible to get a refund.",
    "I regret giving this store my business. The product I received was a complete letdown.",
    "Avoid shopping here at all costs. The items are cheaply made and overpriced.",
    "I'm frustrated with this store's lack of transparency. They hide negative reviews and manipulate ratings.",
    "The customer service team was unhelpful and dismissive of my concerns.",
    "I'm tired of dealing with this store's incompetence. They can't get a simple order right.",
    "The product arrived damaged and customer service refused to offer a replacement.",
    "I'm disappointed in the lack of variety on this store's website. It's all generic and uninspired.",
    "I've had multiple bad experiences with this store. I won't be shopping here again.",
    "The product I received was clearly used and not in new condition. I feel cheated.",
    "This store's shipping fees are outrageous. They charge way too much for standard delivery.",
    "I'm tired of this store's false promises. They never deliver on time and the products are always disappointing.",
    "I'm unsatisfied with the overall shopping experience. It's not worth the hassle.",
    "The product I received was missing parts and customer service was unresponsive.",
    "I've had nothing but problems with this store. They can't seem to get anything right.",
    "I'm upset with the lack of accountability from this store. They blame the customer for their own mistakes.",
    "The product I received was clearly defective. I'm disappointed in the lack of quality control.",
    "I'm fed up with this store's constant excuses. They never take responsibility for their errors.",
    "This store's prices are outrageous for the low-quality products they sell.",
    "I'm disappointed with the lack of professionalism from this store's customer service team.",
    "I've had multiple items arrive damaged from this store. It's unacceptable.",
    "This store's return process is a nightmare. They make it impossible to get a refund.",
    "I'm unsatisfied with the shipping speed. It took far too long for my order to arrive.",
    "I'm frustrated with this store's lack of communication. They never provide updates on order status.",
    "This store's website is slow and glitchy. It's frustrating to navigate.",
    "I've received expired products from this store. It's unacceptable.",
    "I'm disappointed with this store's lack of customer appreciation. They don't value repeat business.",
    "The product I received was nothing like the description. It was a complete waste of money.",
    "I'm unsatisfied with this store's lack of transparency. They hide negative reviews to boost their ratings.",
    "This store's products are overpriced for the poor quality you get.",
    "I'm tired of this store's deceptive advertising. They make false promises to lure in customers.",
    "I'm frustrated with this store's shipping policies. They charge too much for standard delivery.",
    "The product I received was clearly used and not in new condition. I'm extremely disappointed.",
    "I'm disappointed in this store's lack of professionalism. They don't take customer complaints seriously.",
    "I'm unsatisfied with this store's lack of accountability. They refuse to take responsibility for their mistakes."    

  ];

  const generatedReviews = new Set();

  const minMaxQuery =
    "SELECT MIN(product_id) AS min_id, MAX(product_id) AS max_id FROM product WHERE user_id = $1";
  const minMaxResult = await pool.query(minMaxQuery, [userId]);
  const { min_id, max_id } = minMaxResult.rows[0];

    while (generatedReviews.size < 150) {
      const productId = Math.floor(
        Math.random() * (max_id - min_id + 1) + min_id
      );
      const productExists = await pool.query(
        "SELECT EXISTS (SELECT 1 FROM product WHERE product_id = $1)",
        [productId]
      );
      const rating = Math.floor(Math.random() * 5) + 1; 
      let reviewText;
      if(rating>2){
        reviewText =
        positiveReviewTexts[Math.floor(Math.random() * positiveReviewTexts.length)];
      }
      else{
        reviewText =
        negativeReviewTexts[Math.floor(Math.random() * negativeReviewTexts.length)];
      }
        
      const customerId = Math.floor(Math.random() * (500 - 35 + 1) + 35);

      // Ensure uniqueness of review text
      const reviewTuple = JSON.stringify([
        productId,
        customerId,
        reviewText,
        rating,
      ]);

      if (productExists.rows[0].exists && !generatedReviews.has(reviewTuple)) {
        generatedReviews.add(reviewTuple);
        await pool.query(
          "INSERT INTO review (product_id, user_id, review_text, rating, created_at) VALUES ($1, $2, $3, $4, CURRENT_DATE)",
          [productId, customerId, reviewText, rating]
        );
      }
    }
}

router.get("/insert-user", async (req, res) => {
  try {
    const randomUsers = await fetchRandomUserData();
    await insertUsersIntoDatabase(randomUsers);
    res.status(200).json({
      success: true,
      message: "Database populated successfully with random users",
    });
  } catch (error) {
    console.error("Error populating database:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/insert-reviews-clothes/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await generateRandomReviews(userId);
    res.status(200).json({
      success: true,
      message: "Database populated successfully with reviews.",
    });
  } catch (error) {
    console.error("Error populating database:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
