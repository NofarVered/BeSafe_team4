
import express from 'express';
import {loginSuperHero, loginHero, addHero, addSuperHero, deleteHero, deleteSuperHero, getHeroById, getSuperHeroById } from '../controllers/authController.js';

const router = express.Router();


//POST - connect to hero user
router.post('/login/hero', loginHero);


//POST - connect to super user
router.post('/login/super-hero', loginSuperHero);


//GET - get hero user by id
router.get('/hero/:id' , getHeroById);


//GET - get super user by id
router.get('/super-hero/:id', getSuperHeroById);


//POST - add new hero user
router.post('/hero', addHero);


//POST - add new super user
router.post('/super-hero', addSuperHero);


//DELETE - delete hero user by id
router.delete('/hero/:id', deleteHero);


//DELETE - delete super user by id
router.delete('/super-hero/:id', deleteSuperHero);


export default router;