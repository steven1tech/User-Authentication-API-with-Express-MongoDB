const { model } = require('mongoose');
const User = require('../userModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const getAllUsers = async (req, res) => {
    const users = await User.find().select('-email');
    if (users.length === 0) {
        return res.status(200).json({ message: 'the database does not have data' });
    }
    res.status(200).json(users);
}

const getSingleUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userid);
        if (!user) {
            return res.status(404).json({ message: 'this user not found' });
        }
        return res.json(user);
    }
    catch (err) {
        next(err)
    }
}

const getSingleUserByUserName = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'this user not found' });
        }
        return res.json(user);
    }
    catch (err) {
        next(err)
    }
}

const addUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json({ success: true, message: 'User registered successfully' });
    }
    catch (error) {
        next(error)
    }
}

const loginUser = async (req, res , next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const { email, password } = req.body;
        const userdata = await User.findOne({ email }).select('+password');
        if (!userdata) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, userdata.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.status(200).json({ success: true, message: 'Login successful' });

    }
    catch (error) {
        next(error)
    }
}

const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const { email, password, ...restOfData } = req.body;
        const user = await User.findByIdAndUpdate(req.params.userid, restOfData, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'this user not found' });
        }
        return res.status(200).json({ message: 'User update successfully' });
    }
    catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.deleteOne({ _id: req.params.userid });
        return res.status(200).json({ message: 'User delete successfully' });
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getAllUsers,
    getSingleUserById,
    getSingleUserByUserName,
    addUser,
    loginUser,
    updateUser,
    deleteUser
}