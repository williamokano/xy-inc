import mongoose from 'mongoose';
import EntityModel from './entity.model';

let models = {};

function buildSchemaFromDoc(doc) {
    let schema = {};
    for (const field of doc.fields) {
        schema[field.name] = mapType(field.type);
    }

    return schema;
}

function mapType (type) {
    switch (type) {
        case 'int':
        case 'float':
            return Number;
        case 'array':
            return Array;
        case 'date':
            return Date;
        case 'string':
        default:
            return String;
    }
}

export default function createModel(entity_name) {
    return new Promise((resolve, reject) => {
        // Create a dynamic schema
        EntityModel
            .findOne({entity: entity_name})
            .then(doc => {
                if (doc !== null) {
                    const schema = new mongoose.Schema(buildSchemaFromDoc(doc), {timestamps: true, strict: true});

                    if (!models[entity_name]) {
                        models[entity_name] = mongoose.model(entity_name, schema, entity_name);
                    }

                    resolve(models[entity_name]);
                } else {
                    reject({status: 404, error: `Entity ${entity_name} not found`});
                }
            })
            .catch(err => reject(err))
        ;
    });
};
