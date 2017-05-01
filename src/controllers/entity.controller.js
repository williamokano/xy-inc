import {EntityModel} from '../models/entity.model';
const entityModel = new EntityModel('entity');

/**
 * Class responsible for controlling the
 */
export class EntityController {
    /**
     * Retrieves all the entities in the collection
     * @param req
     * @param res
     */
    index(req, res) {
        entityModel.all(req.query)
            .then(entities => res.json(entities))
            .catch(error => res.json(error))
        ;
    }

    findById(req, res) {
        entityModel.findById(req.params.id)
            .then(entity => {
                if (entity === null) {
                    res.statusCode = 404;
                }
                res.json(entity);
            })
            .catch(error => res.json(error))
        ;
    }

    create(data) {

    }

    update(id, data) {

    }

    remove(id) {

    }
}
