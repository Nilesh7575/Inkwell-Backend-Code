const Retailerstore = require('../models/retailerStoreModel');

// Controller for getting all retailer stores
const getAllRetailerstores = async (req, res) => {
    try {
        const retailerstores = await Retailerstore.find();
        res.json(retailerstores);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching retailer stores', error });
    }
};

// Controller for getting a retailer store by ID
const getRetailerstoreById = async (req, res) => {
    const { id } = req.params;
    try {
        const retailerstore = await Retailerstore.findById(id);
        if (!retailerstore) {
            return res.status(404).json({ message: 'Retailer store not found' });
        }
        res.json(retailerstore);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching retailer store', error });
    }
};

// Controller for creating a new retailer store
const createRetailerstore = async (req, res) => {
    const retailerstoreData = req.body;
    try {
        const newRetailerstore = await Retailerstore.create(retailerstoreData);
        res.status(201).json(newRetailerstore);
    } catch (error) {
        res.status(400).json({ message: 'Error creating retailer store', error });
    }
};

// Controller for updating a retailer store by ID
const updateRetailerstore = async (req, res) => {
    const { id } = req.params;
    const updatedRetailerstoreData = req.body;
    try {
        const updatedRetailerstore = await Retailerstore.findByIdAndUpdate(id, updatedRetailerstoreData, {
            new: true,
        });
        if (!updatedRetailerstore) {
            return res.status(404).json({ message: 'Retailer store not found' });
        }
        res.json(updatedRetailerstore);
    } catch (error) {
        res.status(400).json({ message: 'Error updating retailer store', error });
    }
};

// Controller for deleting a retailer store by ID
const deleteRetailerstore = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRetailerstore = await Retailerstore.findByIdAndRemove(id);
        if (!deletedRetailerstore) {
            return res.status(404).json({ message: 'Retailer store not found' });
        }
        res.json({ message: 'Retailer store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting retailer store', error });
    }
};

module.exports = {
    getAllRetailerstores,
    getRetailerstoreById,
    createRetailerstore,
    updateRetailerstore,
    deleteRetailerstore,
};
