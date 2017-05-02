import EntityModel from '../models/entity.model';
import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Class responsible for controlling the entity entity. LOL.
 */
export class EntityController {
    /**
     * Retrieves all the entities in the collection.
     * @param req
     * @param res
     */
    static index(req, res) {
        EntityModel
            .find(req.query)
            .exec()
            .then(entities => res.json(entities))
            .catch(error => res.status(500).json(error))
        ;
    }

    /**
     * Find the model by the given id.
     * @param req
     * @param res
     */
    static findById(req, res) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            EntityModel.findById(req.params.id)
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
    static create(req, res) {
        const schema = Joi.object().keys({
            entity: Joi.string().min(1).invalid('entity').required(),
            fields: Joi.array().items(
                Joi.object().keys({
                    name: Joi.string().min(1).required(),
                    required: Joi.boolean().required(),
                    type: Joi.any().valid(['int', 'boolean', 'string', 'float', 'date', 'array']).required()
                })
            ).min(1).required()
        });

        Joi.validate(req.body, schema, (err, value) => {
            if (err) {
                res.status(422).json(err.details);
            } else {
                const model = new EntityModel(value);
                model.save()
                    .then(doc => res.status(201).json(doc))
                    .catch(err => res.status(500).json({error: err.code === 11000 ? `Entity ${req.body.entity} already exists` : err.errmsg}))
                ;
            }
        });
    }

    static update(req, res) {
        const requestSchema = Joi.object().keys({
            id: Joi.string().min(1).required()
        });
        const entitySchema = Joi.object().keys({
            entity: Joi.string().min(1).required(),
            fields: Joi.array().items(
                Joi.object().keys({
                    name: Joi.string().min(1).required(),
                    required: Joi.boolean().required(),
                    type: Joi.any().valid(['int', 'boolean', 'string', 'float', 'date']).required()
                })
            ).min(1).required()
        });

        /* Refactor this piece of code to avoid callback hell */
        Joi.validate(req.params, requestSchema, err => {
            if (err) {
                res.status(422).json(err);
            } else {
                Joi.validate(req.body, entitySchema, (err, value) => {
                    if (err) {
                        res.status(422).json(err);
                    } else {
                        EntityModel.findByIdAndUpdate(req.params.id, {$set: value})
                            .then(doc => doc.save())
                            .then(() => res.status(200).json())
                            .catch(err => res.status(500).send({error: err.code === 11000 ? `Entity ${req.body.entity} already exists` : err.errmsg}))
                        ;
                    }
                });
            }
        });
    }

    /**
     * Delete some document with the given id.
     * @param req
     * @param res
     */
    static destroy(req, res) {
        const schema = Joi.object().keys({
            id: Joi.string().min(1).required()
        });

        Joi.validate(req.params, schema, (err, value) => {
            if (err) {
                res.status(422).json(err.details);
            } else {
                EntityModel.findByIdAndRemove(value.id)
                    .then(doc => res.status(204).json())
                    .catch(err => res.status(500).json(err))
                ;
            }
        });
    }
}
