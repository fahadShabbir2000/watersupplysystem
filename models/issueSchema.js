import connection from '../db/connection.js'; // Import the connection
import { v4 as uuidv4 } from 'uuid'; // Import the connection
import { Schema } from 'mongoose'; // Import Schema from mongoose

const issueSchema = new Schema({
    IssueID: { type: Number, required: true, unique: true },
    OrderID: { type: Schema.Types.Number, ref: 'Order' },
    DeliveryBoyID: { type: Schema.Types.Number, ref: 'DeliveryBoy' },
    Description: { type: String },
    Status: { type: String },
    ReportedDate: { type: Date },
    ResolutionDate: { type: Date },
    created_at: { type: Date, default: Date.now }
});

const Issue = connection.model('Issue', issueSchema);

export default Issue;
