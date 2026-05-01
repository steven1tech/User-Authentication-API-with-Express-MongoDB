const { body } = require('express-validator');
const User = require('../userModel');

const validationSchema = () => {
    return [
        body('fullName')
            .notEmpty().withMessage('the name is required')
            .isLength({ min: 3 }).withMessage('the name is at least 3 chars'),
        body('username')
            .notEmpty().withMessage('the username is required')
            .isLength({ min: 3 }).withMessage('the name is at least 3 chars')
            .custom(async (value)=>{
                const username = await User.findOne({username:value});
                if(username) throw new Error('the username is used');
                return true;
            }),
        body('email')
            .notEmpty().withMessage('the email is required')
            .isEmail().withMessage('it not right formatted of email')
            .normalizeEmail()
            .custom(async (value) => {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw new Error('the email already registered');
                }
                return true;
            }),
        body('password')
            .notEmpty().withMessage('the password is required')
            .isLength({ min: 8 }).withMessage('the password is at least 8 chars')
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).withMessage('the password is weak!!!\nYour password should be contain at least one number, lower case , upper case and symbol'),
        body('phone')
            .notEmpty().withMessage('the phone is required')
            .trim()
            .blacklist('- ')
            .isMobilePhone('ar-EG').withMessage('wrong number!!!'),
        body('role')
            .optional()
            .trim()
            .isIn(['customer', 'provider', 'admin']).withMessage('The entered role is incorrect, it should be customer, provider or admin'),
    ]
}

const validationUpdate = () => {
    return [
        body('fullName')
            .optional()
            .isLength({ min: 3 }).withMessage('the name is at least 3 chars'),

        body('username')
            .optional()
            .isLength({ min: 3 }).withMessage('the username is at least 3 chars'),

        body('phone')
            .optional()
            .isMobilePhone('ar-EG').withMessage('wrong number'),

        body('role')
            .optional()
            .isIn(['customer', 'provider', 'admin'])
    ];
}

const validationLogin = () => {
    return [
        body('email')
            .notEmpty().withMessage('the email is required')
            .isEmail().withMessage('it not right formatted of email')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('the password is required'),
    ]
}

module.exports = {
    validationSchema,
    validationUpdate,
    validationLogin
};