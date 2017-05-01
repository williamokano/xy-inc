import express from 'express';
import {EntityController} from '../controllers/entity.controller';

const router = express.Router();
const entityController = new EntityController();

/**
 * Entities routes
 */
router.get('/entity', (req, res) => entityController.index(req, res));
router.get('/entity/:id', (req, res) => entityController.findById(req, res));
router.post('/entity', (req, res) => entityController.create(req, res));
router.put('/entity/:id', (req, res) => entityController.update(req, res));
router.patch('/entity/:id', (req, res) => entityController.update(req, res));
router.delete('/entity/:id', (req, res) => entityController.destroy(req, res));

/**
 * Resource routes
 */

module.exports = router;
