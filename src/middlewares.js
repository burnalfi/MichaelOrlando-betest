const jwt = require('jsonwebtoken');

async function verifyToken (req, res, next) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if(!token) return res.status(403).json({ status: "failed", content: "Bearer token is not provided." });
  
    const decodedToken = jwt.verify(token, process.env.secret_key);
  
    console.log(Math.floor(new Date().getTime() / 1000) > decodedToken.exp);
  
    if (Math.floor(new Date().getTime() / 1000) > decodedToken.exp) return res.status(403).json({ status: "failed", content: "Bearer token expired." });
  
    next();
  } catch (e) {
    return res.status(403).json({
      status: "failed",
      content: e.message
    });
  }
}

module.exports = { verifyToken };