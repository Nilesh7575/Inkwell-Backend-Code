const express = require('express');
const router = express.Router();
const salesmanController = require('../controllers/salesmanController');

// Define routes for the Salesman model
router.get('/', salesmanController.getAllSalesman);
router.get('/:id', salesmanController.getSalesmanById);
router.post('/', salesmanController.createSalesman);
router.put('/:id', salesmanController.updateSalesman);
router.delete('/:id', salesmanController.deleteSalesman);

module.exports = router;
