const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";
  
  


  


  // Extract Bearer token
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;



  if (!token) {
    return res.status(401).json({ message: "Missing token" })

  }
 

    
  




  

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
    req.user = payload; 
    next();
  } catch (e) {
    console.error("JWT Verify Error:", e.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
