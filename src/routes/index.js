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

/**
 * Resource routes
 */

module.exports = router;
