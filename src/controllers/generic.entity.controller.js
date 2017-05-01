import EntityModel from '../models/entity.model';
import GenericEntityModel from '../models/generic.entity.model';
import mongoose from 'mongoose';
import Joi from 'joi';

/**
 * Class responsible for controlling the entity entity. LOL.
 */
export class GenericEntityController {
    /**
     * Retrieves all the entities in the collection.
     * @param req
     * @param res
     */
    index(req, res) {
        GenericEntityModel(req.params.entity)
            .then(model => model.find(req.query).exec())
            .then(entities => res.json(entities))
            .catch(error => res.status(500).json(error))
        ;
    }

    /**
     * Find the model by the given id.
     * @param req
     * @param res
     */
    findById(req, res) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            GenericEntityModel(req.params.entity)
                .then(model => model.findById(req.params.id))
                .then(entity => res.status(entity !== null ? 200 : 404).json(entity))
                .catch(error => res.status(500).json(error))
            ;
        } else {
            res.status(404).json({erro: `Could not find object ${req.params.entity} with id ${req.params.id}`});
        }
    }

    /**
     * Create a new model and return it.
     * @param req
     * @param res
     */
    create(req, res) {
        this.validate(req.params.entity, req.body)
            .then(body => new Promise((resolve, reject) => {
                GenericEntityModel(req.params.entity)
                    .then(model => model.create(body, (err, doc) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(doc);
                        }
                    }))
                    .then(doc => res.status(201).json(doc))
                    .catch(err => res.status(500).json({error: err.code === 11000 ? `Entity ${req.body.entity} already exists` : err.errmsg}))
                ;
            }))
            .catch(err => res.status(500).json({error: err}))
        ;
    }

    /**
     * Update the service dynamically.
     * @param req
     * @param res
     */
    update(req, res) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            this.validate(req.params.entity, req.body)
                .then(body => {
                    GenericEntityModel(req.params.entity)
                        .then(model => model.findByIdAndUpdate(req.params.id, {$set: body}))
                            .then(doc => doc.save())
                            .then(() => res.status(200).json())
                            .catch(err => res.status(500).send({error: err.code === 11000 ? `Entity ${req.body.entity} already exists` : err.errmsg}))
                    ;
                })
                .catch(err => res.status(500).json(err));
        } else {
            res.status(404).json({erro: `Could not find object ${req.params.entity} with id ${req.params.id}`});
        }
    }

    /**
     * Delete some document with the given id.
     * @param req
     * @param res
     */
    destroy(req, res) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            GenericEntityModel(req.params.entity)
                .then(model => model.findByIdAndRemove(req.params.id))
                .then(doc => res.status(204).json())
                .catch(err => res.status(500).json(err))
            ;
        } else {
            res.status(404).json({erro: `Could not find object ${req.params.entity} with id ${req.params.id}`});
        }
    }

    /**
     * Dynamically validate the schema against the database using Joi validator.
     * @param entity
     * @param body
     * @returns {Promise}
     */
    validate(entity, body) {
        return new Promise((resolve, reject) => {
            EntityModel.findOne({entity})
                .then(doc => GenericEntityController.createJoiSchema(doc))
                .then(joiSchema => Joi.validate(body, joiSchema, (err, value) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(value);
                    }
                }))
                .catch(err => reject(err))
            ;
        });
    }

    /**
     * Helper method to create a Joi validator schema and return it inside a promise.
     * @param data
     * @returns {Promise.<*>}
     */
    static createJoiSchema(data) {
        let joiSchema = {};
        for (const field of data.fields) {
            joiSchema[field.name] = GenericEntityController.validateRequired(
                GenericEntityController.validateType(field.type),
                field.required
            );
        }

        return Promise.resolve(Joi.object().keys(joiSchema));
    }

    /**
     * Set if the field is required or not.
     * @param joiValidation
     * @param isRequired
     * @returns {*}
     */
    static validateRequired(joiValidation, isRequired) {
        if (isRequired) {
            return joiValidation.required();
        }

        return joiValidation;
    }

    /**
     * Create dinamycally the type of Joi validator. @WIP: need improvement.
     * @param type
     * @returns {*}
     */
    static validateType(type) {
        switch (type) {
            case 'int':
                return Joi.number().integer().default(null);
            case 'boolean':
                return Joi.boolean().default(null);
            case 'date':
                return Joi.date().default(null);
            case 'float':
                return Joi.number().default(null);
            case 'array':
                return Joi.array().default(null);
            case 'string':
            default:
                return Joi.string().allow('');
        }
    }
}
