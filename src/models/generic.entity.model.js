import mongoose from 'mongoose';

let models = {};

export default function createModel(entity_name) {
    return new Promise(resolve => {
        const schema = new mongoose.Schema({}, {timestamps: true, strict: false});

        if (!models[entity_name]) {
            models[entity_name] = mongoose.model(entity_name, schema, entity_name);
        }

        resolve(models[entity_name]);
    });
};
