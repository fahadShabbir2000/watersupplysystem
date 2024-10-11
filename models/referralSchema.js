import connection from '../db/connection.js'; // Import the connection
import { v4 as uuidv4 } from 'uuid'; // Import the connection
import { Schema } from 'mongoose'; // Import Schema from mongoose

const referralSchema = new Schema({
    ReferralID: { type: Number, required: true, unique: true },
    CustomerID: { type: Schema.Types.Number, ref: 'Customer' },
    ReferredCustomerID: { type: Schema.Types.Number, ref: 'Customer' },
    ReferralDate: { type: Date },
    Reward: { type: String },
    created_at: { type: Date, default: Date.now }
});

const Referral = connection.model('Referral', referralSchema);

export default Referral;
