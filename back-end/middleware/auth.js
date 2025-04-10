import jwt from 'jsonwebtoken';

export const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }
  
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // Add this line to set userId on req object directly
    req.userId = decode.id;
    req.body.userId = decode.id; // Keep this for backward compatibility
    next();
  } catch (error) {
    console.log("error in authUser", error);
    res.status(401).json({ message: 'Unauthorized, token failed' });
  }
};