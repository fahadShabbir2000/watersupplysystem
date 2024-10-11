import connection from '../db/connection.js'; // Import the connection
import { v4 as uuidv4 } from 'uuid';
import { Schema } from 'mongoose'; // Import Schema from mongoose

const deliveryBoySchema = new Schema({
    DeliveryBoyID: { type: Number, default: uuidv4, unique: true },
    Name: { type: String, required: true, unique: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Phone: { type: String, required: true, unique: true },
    AssignedArea: { type: String, required: true },
    CNIC: { type: String, required: true, unique: true },
    Role: { type: String, enum: ['deliveryboy'], default: 'deliveryboy' },
    created_at: { type: Date, default: Date.now }
});

const DeliveryBoy = connection.model('DeliveryBoy', deliveryBoySchema);

export default DeliveryBoy;
