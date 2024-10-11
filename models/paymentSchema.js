import connection from '../db/connection.js'; // Import the connection
import { v4 as uuidv4 } from 'uuid'; // Import the connection
import mongoose, { Schema } from 'mongoose'; // Import Schema from mongoose

const paymentSchema = new Schema({
    PaymentID: { type: Number, required: true, unique: true },
    OrderID: { type: Schema.Types.Number, ref: 'Order' },
    CustomerID: { type: Schema.Types.Number, ref: 'Customer' },
    PaymentDate: { type: Date },
    Amount: { type: mongoose.Decimal128 },
    PaymentMethod: { type: String },
    Status: { type: String },
    created_at: { type: Date, default: Date.now }
});

const Payment = connection.model('Payment', paymentSchema);

export default Payment;
