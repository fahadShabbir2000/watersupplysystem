// models/counter.js
import connection from '../db/connection.js';
import { Schema } from 'mongoose';

// Define the schema for the counter
const counterSchema = new Schema({
    name: { type: String, required: true, unique: true }, // E.g., 'orderID'
    sequence_value: { type: Number, required: true, default: 0 }
});

// Create the model from the schema
const Counter = connection.model('Counter', counterSchema);

export default Counter;
