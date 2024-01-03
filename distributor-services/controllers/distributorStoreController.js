const distributorModel = require("../models/distributorModel");
const distributorStoreModel = require("../models/distributorStoreModel");

// Controller for getting all stores
const getAllStores = async (req, res) => {
    try {
        const stores = await distributorStoreModel.find();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stores", error });
    }
};

// Controller for getting a store by ID
const getStoreById = async (req, res) => {
    const { id } = req.params;
    try {
        const store = await distributorStoreModel.findById(id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: "Error fetching store", error });
    }
};

// Controller for creating a new store
const createStore = async (req, res) => {
    const storeData = req.body;
    try {
        const newStore = await distributorStoreModel.create(storeData);
        const addStoreId = await distributorModel.findByIdAndUpdate(storeData.distrubutorId, { $push: { stores: newStore._id } });

        res.status(201).json(newStore);
    } catch (error) {
        res.status(200).json({ message: "Error creating store", error });
    }
};

// Controller for updating a store by ID
const updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const { businessCategory, store_name, address, phone_number, email, gst_number, pan, vat_number, business_license_number, business_registration_number, tax_exempt_status } = req.body;

        let storeUpdateData = {}

        if (businessCategory) {
            storeUpdateData.businessCategory = businessCategory
        }

        if (store_name) {
            storeUpdateData.store_name = store_name
        }
        if (address) {
            storeUpdateData.address = address
        }
        if (phone_number) {
            storeUpdateData.phone_number = phone_number
        }
        if (email) {
            storeUpdateData.email = email
        }
        if (gst_number) {
            storeUpdateData.gst_number = gst_number
        }
        if (pan) {
            storeUpdateData.pan = pan
        }
        if (vat_number) {
            storeUpdateData.vat_number = vat_number
        }
        if (business_license_number) {
            storeUpdateData.business_license_number = business_license_number
        }
        if (business_registration_number) {
            storeUpdateData.business_registration_number = business_registration_number
        }
        if (tax_exempt_status) {
            storeUpdateData.tax_exempt_status = tax_exempt_status
        }

        const updatedStore = await distributorStoreModel.findByIdAndUpdate(id, storeUpdateData, { new: true, });

        if (!updatedStore) {
            return res.status(200).json({ message: "Store not found" });
        }

        res.status(200).json(updatedStore);

    } catch (error) {
        res.status(200).json({ message: "Error updating store", error });
    }
};

// Controller for deleting a store by ID
const deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedStore = await distributorStoreModel.findByIdAndRemove(id);
        if (!deletedStore) {
            return res.status(404).json({ message: "Store not found" });
        }
        res.json({ message: "Store deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting store", error });
    }
};

module.exports = {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
};
