import express from 'express';
import {EntityController} from '../controllers/entity.controller';
import {GenericEntityController} from '../controllers/generic.entity.controller';

const router                  = express.Router();

/**
 * Entities routes
 */
router.get('/entity', (req, res) => EntityController.index(req, res));
router.get('/entity/:id', (req, res) => EntityController.findById(req, res));
router.post('/entity', (req, res) => EntityController.create(req, res));
router.put('/entity/:id', (req, res) => EntityController.update(req, res));
router.delete('/entity/:id', (req, res) => EntityController.destroy(req, res));

/**
 * Generic resource routes
 */
router.get('/:entity', (req, res) => GenericEntityController.index(req, res));
router.get('/:entity/:id', (req, res) => GenericEntityController.findById(req, res));
router.post('/:entity', (req, res) => GenericEntityController.create(req, res));
router.put('/:entity/:id', (req, res) => GenericEntityController.update(req, res));
router.delete('/:entity/:id', (req, res) => GenericEntityController.destroy(req, res));

module.exports = router;
