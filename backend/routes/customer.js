const express = require('express');
const router = express.Router();
const { addCustomer, getCustomers } = require('../controllers/customerController');

router.post('/', addCustomer); // #Link Frontend Submit Form
router.get('/', getCustomers); // #Link Frontend Show List

module.exports = router;
