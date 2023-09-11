const Distributorstore = require('../models/distributorStoreModel');

// Controller for getting all stores
const getAllStores = async (req, res) => {
    try {
        const stores = await Distributorstore.find();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stores', error });
    }
};

// Controller for getting a store by ID
const getStoreById = async (req, res) => {
    const { id } = req.params;
    try {
        const store = await Distributorstore.findById(id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching store', error });
    }
};

// Controller for creating a new store
const createStore = async (req, res) => {
    const storeData = req.body;
    try {
        const newStore = await Distributorstore.create(storeData);
        res.status(201).json(newStore);
    } catch (error) {
        res.status(400).json({ message: 'Error creating store', error });
    }
};

// Controller for updating a store by ID
const updateStore = async (req, res) => {
    const { id } = req.params;
    const updatedStoreData = req.body;
    try {
        const updatedStore = await Distributorstore.findByIdAndUpdate(id, updatedStoreData, {
            new: true,
        });
        if (!updatedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(updatedStore);
    } catch (error) {
        res.status(400).json({ message: 'Error updating store', error });
    }
};

// Controller for deleting a store by ID
const deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedStore = await Distributorstore.findByIdAndRemove(id);
        if (!deletedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting store', error });
    }
};

module.exports = {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
};
