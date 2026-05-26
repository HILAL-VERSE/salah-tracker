const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if(userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        let returndata = user.name;
        return res.status(201).json({
            message: "User registered succesfully",
            returndata,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email});
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }

    const isPasswordCorrect = existingUser 
        ? await bcrypt.compare(password, existingUser.password) 
        : false;

    if (!existingUser || !isPasswordCorrect) {
        return res.status(401).json({
            message: "Invalid Password or Username",
        });
    }

    
    try{
        const payLoad = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
        };

        const token = jwt.sign(
            payLoad,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h'}
        );
        let returnData = existingUser.name;
        return res.status(200).json({
            message: "Login successful.",
            token: token,
            user: returnData,
        });



    }catch (error) {
        return res.status(500).json({
            message: error.message,
        });
        
    }
}

module.exports = {
    registerUser,
    loginUser,
};