import connection from '../db/connection.js'; // Import the connection
import { getNextSequenceValue } from '../utils/autoIncrement.js';
import { Schema } from 'mongoose'; // Import Schema from mongoose

const orderSchema = new Schema({
    OrderID: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^ORD-\d{4}-\d{2}-\d{2}-\d{4}$/.test(v); // regex for ORD-YYYY-MM-DD-XXXX
            },
            message: props => `${props.value} is not a valid Order ID format!`
        }
    },
    CustomerID: { type: Schema.Types.Number, ref: 'Customer' },
    DeliveryBoyID: { type: Schema.Types.Number, ref: 'DeliveryBoy' },
    OrderDate: { type: Date,  default: Date.now },
    NumberOfBottles: { type: Number, required: true },
    Status: { type: String, required: true },
    EmptyBottlesReturned: { type: Number, default: 0 },
    TotalPrice: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

orderSchema.pre('save', async function (next) {
    // Only generate OrderID if it doesn't already exist
    if (!this.OrderID) {
        const sequenceValue = await getNextSequenceValue('orderID'); // Get the next sequence
        const currentDate = new Date();

        // Format the date as YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add leading zero
        const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero

        // Generate OrderID in format ORD-YYYY-MM-DD-XXXX
        this.OrderID = `ORD-${year}-${month}-${day}-${sequenceValue.toString().padStart(4, '0')}`;
    }

    next(); // Proceed with saving the document
});

const Order = connection.model('Order', orderSchema);

export default Order;
