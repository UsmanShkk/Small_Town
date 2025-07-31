const jwt = require('jsonwebtoken');

exports.protect = (req,res,next) => {
  const token = req.cookies.token;

  if(!token){
    res.status(100).json({message : 'Not authorized, token missing'});
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  }catch(err){
    return res.status(401).json({message : 'Invalid or Expired Token'});
  }
};


exports.authorizeRoles = (...allowedRoles) => {
  return (req,res,next) => {
    if (!allowedRoles.includes(req.user.role)){
      return res.status(403).json({message:'Acess Denied'})
    }
    next();
  }
}

