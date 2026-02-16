const router = require('express').Router();
const tagsController = require('../../controllers/tags/tags.controllers');

router.get('/', tagsController.list); // ?q=cyb

module.exports = router;