const express = require('express')
const router = express.Router()
const { userSignUp } = require('../controllers/userSignUp')
const { userLogin } = require('../controllers/userLogin')
const { allUsers } = require('../controllers/allUsers')
const { protect } = require('../middleware/authMiddleware')

router.route("/").post(userSignUp).get(protect, allUsers);
router.route('/login').post(userLogin);

module.exports = router