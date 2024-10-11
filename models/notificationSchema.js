import connection from '../db/connection.js'; // Import the connection
import { v4 as uuidv4 } from 'uuid'; // Import the connection
import { Schema } from 'mongoose'; // Import Schema from mongoose

const notificationSchema = new Schema({
    NotificationID: { type: Number, required: true, unique: true },
    CustomerID: { type: Schema.Types.Number, ref: 'Customer' },
    DeliveryBoyID: { type: Schema.Types.Number, ref: 'DeliveryBoy' },
    OrderID: { type: Schema.Types.Number, ref: 'Order' },
    Message: { type: String },
    NotificationDate: { type: Date },
    Status: { type: String },
    created_at: { type: Date, default: Date.now }
});

const Notification = connection.model('Notification', notificationSchema);

export default Notification;
