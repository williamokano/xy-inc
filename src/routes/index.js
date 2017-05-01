import express from 'express';
import {EntityController} from '../controllers/entity.controller';
import {GenericEntityController} from '../controllers/generic.entity.controller';

const router                  = express.Router();
const entityController        = new EntityController();
const genericEntityController = new GenericEntityController();

/**
 * Entities routes
 */
router.get('/entity', (req, res) => entityController.index(req, res));
router.get('/entity/:id', (req, res) => entityController.findById(req, res));
router.post('/entity', (req, res) => entityController.create(req, res));
router.put('/entity/:id', (req, res) => entityController.update(req, res));
router.delete('/entity/:id', (req, res) => entityController.destroy(req, res));

/**
 * Generic resource routes
 */
router.get('/:entity', (req, res) => genericEntityController.index(req, res));
router.get('/:entity/:id', (req, res) => genericEntityController.findById(req, res));
router.post('/:entity', (req, res) => genericEntityController.create(req, res));
router.put('/:entity/:id', (req, res) => genericEntityController.update(req, res));
router.delete('/:entity/:id', (req, res) => genericEntityController.destroy(req, res));

module.exports = router;
