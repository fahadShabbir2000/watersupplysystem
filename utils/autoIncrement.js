// utils/autoIncrement.js
import Counter from '../utils/counter.js';

export const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true } // Create the document if it doesn't exist
    );
    return sequenceDocument.sequence_value;
};