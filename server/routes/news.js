const SelectedUsers = require('../models/SelectedUser');
const PreSurvey = require('../models/PreSurvey');
const User = require('../models/User');
const IDStorage = require('../models/IDStorage');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const PostSurvey = require('../models/PostSurvey'); 
var ObjectId = require('mongodb').ObjectID;
const sanitizeHtml = require('sanitize-html');
const logger = require('../logs/logger');
const path = require('path');

const verifyToken = require('../middleware/verifyToken');

function sanitizeInput(input) {
    return sanitizeHtml(input, {
        allowedTags: [], // No HTML allowed
        allowedAttributes: {} // No attributes allowed
    });
}

// Submit pre survey
router.get('/news_1',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_1.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});
router.get('/news_2',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_2.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_3',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_3.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_4',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_4.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});

router.get('/news_5',  async (req, res) => {
    logger.info('Data received news', { data: req.body });
    try {
        //const uniqId = req.params.uniqId;
        //logger.info(`Serving news page for ID: ${uniqId}`);

        // Send the HTML file located in the 'public' directory
        res.sendFile(path.join(__dirname, '../public/html/news_5.html'));
    } catch (err) {
        logger.error('Error serving news page', { error: err.message });
        res.status(500).send('Error loading the page');
    }
});





    module.exports = router;