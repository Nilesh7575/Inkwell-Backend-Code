const express = require('express');
const router = express.Router();
const distributorstoreController = require('../controllers/distributorStoreController');


router.get('/', distributorstoreController.getAllStores);
router.get('/:id', distributorstoreController.getStoreById);
router.post('/', distributorstoreController.createStore);
router.put('/:id', distributorstoreController.updateStore);
router.delete('/:id', distributorstoreController.deleteStore);

module.exports = router;
