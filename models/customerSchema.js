import connection from '../db/connection.js'; // Import the connection
import { v4 as uuidv4 } from 'uuid';
import mongoose,{ Schema } from 'mongoose'; // Import Schema from mongoose

const customerSchema = new Schema({
  CustomerID: { type: Number, default: uuidv4, unique: true },
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Phone: { type: String, required: true, unique: true },
  Address: { type: String, required: true, unique: true },
  SubscriptionType: { type: String, default: 'standard' },
  PaymentMethod: { type: String, default: 'COD' },
  Balance: { type: mongoose.Decimal128 },
  Role: { type: String, enum: ['customer'], default: 'customer' },
  created_at: { type: Date, default: Date.now }
});

const Customer = connection.model('Customer', customerSchema);

export default Customer;
