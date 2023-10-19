const Retailer = require('../models/retailerModel');

// Controller for getting all retailers
const getAllRetailers = async (req, res) => {
    try {
        const retailers = await Retailer.find();
        res.json(retailers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching retailers', error });
    }
};

// Controller for getting a retailer by ID
const getRetailerById = async (req, res) => {
    const { id } = req.params;
    try {
        const retailer = await Retailer.findById(id);
        if (!retailer) {
            return res.status(404).json({ message: 'Retailer not found' });
        }
        res.json(retailer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching retailer', error });
    }
};

// Controller for creating a new retailer
const createRetailer = async (req, res) => {
    const retailerData = req.body;
    try {

        const newRetailer = await Retailer.create(retailerData);
        res.status(201).json(newRetailer);
    } catch (error) {
        res.status(400).json({ message: 'Error creating retailer', error });
    }
};

// Controller for updating a retailer by ID
const updateRetailer = async (req, res) => {
    const { id } = req.params;
    const updatedRetailerData = req.body;
    try {
        const updatedRetailer = await Retailer.findByIdAndUpdate(id, updatedRetailerData, {
            new: true,
        });
        if (!updatedRetailer) {
            return res.status(404).json({ message: 'Retailer not found' });
        }
        res.json(updatedRetailer);
    } catch (error) {
        res.status(400).json({ message: 'Error updating retailer', error });
    }
};

// Controller for deleting a retailer by ID
const deleteRetailer = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRetailer = await Retailer.findByIdAndRemove(id);
        if (!deletedRetailer) {
            return res.status(404).json({ message: 'Retailer not found' });
        }
        res.json({ message: 'Retailer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting retailer', error });
    }
};

module.exports = {
    getAllRetailers,
    getRetailerById,
    createRetailer,
    updateRetailer,
    deleteRetailer,
};
