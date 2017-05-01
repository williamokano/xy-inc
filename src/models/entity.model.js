import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    entity: {
        type: String,
        index: {
            unique: true
        }
    },
    fields: Array
}, {timestamps: true});

export default mongoose.model('entity', schema, 'resource');
