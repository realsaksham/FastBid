require('dotenv').config();
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

exports.reDirect = (req , res) => {
    let success = false;
    try {

        console.log(req.user)
         //Creating a data object that is to be given to the server for autherozing the user
         const data = {
            user:{
                id: req.user.id
            }
        }
        const userId = req.user.id

        //Generating a JWT token
        var authToken = jwt.sign(data, JWT_SECRET,{ expiresIn: '10h' })

        res.redirect(`http://localhost:1234/Home?token=${authToken}`)


        success = true;
        return res.status(200).json({ success , message: 'Successfully redirected' , authToken , userId })
    } catch (error) {
        console.error(error)
        res.status(501).json({ success , error: 'Error while redirecting' })
    }
}