const { createUser, login, getUserData } = require('../controllers/controller');
const authMiddleware = require('../middlewares/authmiddlewares');
const handleLog = require('../middlewares/handleLog');

const router = require('express').Router();

router.use(handleLog);

router.post('/usuarios', createUser);
router.post('/login', login);

router.get('/usuarios', authMiddleware, getUserData);

module.exports = router;
