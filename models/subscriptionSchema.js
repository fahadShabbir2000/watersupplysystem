import connection from '../db/connection.js'; // Import the connection
import { v4 as uuidv4 } from 'uuid'; // Import the connection
import { Schema } from 'mongoose'; // Import Schema from mongoose

const subscriptionSchema = new Schema({
    SubscriptionID: { type: Number, required: true, unique: true },
    CustomerID: { type: Schema.Types.Number, ref: 'Customer' },
    StartDate: { type: Date },
    EndDate: { type: Date },
    NumberOfBottlesPerMonth: { type: Number },
    Status: { type: String },
    created_at: { type: Date, default: Date.now }
});

const Subscription = connection.model('Subscription', subscriptionSchema);

export default Subscription;
