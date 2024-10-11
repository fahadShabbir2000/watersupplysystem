import connection from '../db/connection.js'; // Import the connection
import { v4 as uuidv4 } from 'uuid'; // Import the connection
import { Schema } from 'mongoose'; // Import Schema from mongoose

const adminSchema = new Schema({
    AdminID: { type: String, default: uuidv4, unique: true }, 
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Phone: { type: String, unique: true },
    Role: { type: String, enum: ['admin', 'superadmin'], default: 'admin'},
    created_at: { type: Date, default: Date.now }
});

const Admin = connection.model('Admin', adminSchema);

export default Admin;
