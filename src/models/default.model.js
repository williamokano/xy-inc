import mongoose from 'mongoose';

export class DefaultModel {
    constructor(entityName) {
        this.entityName = entityName;
    }

    all() {
        return this
            .getResource()
            .find()
            .exec();
    }

    findById(id) {
        return this
            .getResource()
            .findById(id)
            .exec()
        ;
    }

    getResource() {
        const modelSchema = new mongoose.Schema(
            Object.assign(
                {},
                this.getSchema(),
                {
                    _id: {type: String}
                }
            ),
            {timestamps: true}
        );

        if (this.model === undefined) {
            this.model = mongoose.model(this.entityName, modelSchema, 'resource');
        }

        return this.model;
    }

    getSchema() {
        return {};
    }
}
