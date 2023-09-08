const Salesman = require('../models/salesmanModel');

// Controller for getting all salesman
const getAllSalesman = async (req, res) => {
    try {
        const salesman = await Salesman.find();
        res.json(salesman);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salesman', error });
    }
};

// Controller for getting a salesman by ID
const getSalesmanById = async (req, res) => {
    const { id } = req.params;
    try {
        const salesman = await Salesman.findById(id);
        if (!salesman) {
            return res.status(404).json({ message: 'Salesman not found' });
        }
        res.json(salesman);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salesman', error });
    }
};

// Controller for creating a new salesman
const createSalesman = async (req, res) => {
    const salesmanData = req.body;
    try {
        const newSalesman = await Salesman.create(salesmanData);
        res.status(201).json(newSalesman);
    } catch (error) {
        res.status(400).json({ message: 'Error creating salesman', error });
    }
};

// Controller for updating a salesman by ID
const updateSalesman = async (req, res) => {
    const { id } = req.params;
    const updatedSalesmanData = req.body;
    try {
        const updatedSalesman = await Salesman.findByIdAndUpdate(id, updatedSalesmanData, {
            new: true,
        });
        if (!updatedSalesman) {
            return res.status(404).json({ message: 'Salesman not found' });
        }
        res.json(updatedSalesman);
    } catch (error) {
        res.status(400).json({ message: 'Error updating salesman', error });
    }
};

// Controller for deleting a salesman by ID
const deleteSalesman = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSalesman = await Salesman.findByIdAndRemove(id);
        if (!deletedSalesman) {
            return res.status(404).json({ message: 'Salesman not found' });
        }
        res.json({ message: 'Salesman deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting salesman', error });
    }
};

module.exports = {
    getAllSalesman,
    getSalesmanById,
    createSalesman,
    updateSalesman,
    deleteSalesman,
};
