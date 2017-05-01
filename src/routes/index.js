import express from 'express';
import {EntityController} from '../controllers/entity.controller';

const router = express.Router();
const entityController = new EntityController();

/* GET home page. */
router.get('/entity', (req, res) => entityController.index(req, res));
router.get('/entity/:id', (req, res) => entityController.findById(req, res));

module.exports = router;
