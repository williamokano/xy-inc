import {DefaultModel} from './default.model';

export class EntityModel extends DefaultModel {
    getSchema() {
        return {
            _id: {
                type: String
            },
            entity: {
                type: String,
                index: {
                    unique: true
                }
            },
            fields: Array
        }
    }
}
