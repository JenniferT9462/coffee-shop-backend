const jwt = require('jsonwebtoken');

//Use jwt secret key
const secretKey = process.env.JWT_SECRET;

const auth = ((req, res, next) => {
    // Retrieve the authorization header from the incoming request
    const bearerToken = req.headers.authorization;
    // Verify whether the authorization header is present
    if (!bearerToken) {
        res.status(401).json({
            success: false,
            message: "Error! Token was not provided."
        });
    }
    //Extract the token remove 'Bearer'
    const token = bearerToken.split(' ')[1];
    // Check if the token exists.
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Error! Token was not provided"
        });
    }
    // Verify the token
    const decodedToken = jwt.verify(token, secretKey);
    // Print the received token and decoded token for debugging purposes
    console.log('Token received:', token);
    console.log('Decoded Token:', decodedToken);
    // Attach Decoded Information to the req Object
    req.user = {
        userId: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role
    };
    // Call next() to pass control
    next();
})

//Export auth middleware
module.exports = auth;