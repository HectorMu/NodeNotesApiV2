const express = require('express')
const router = express.Router()

const controller = require('../controllers/indexController');

router.get('/api/test', controller.test)
router.get('/api/listall',controller.ListAll)
router.get('/api/listone/:idnote', controller.ListOne)
router.post('/api/save',controller.Save);
router.delete('/api/delete/:idnote',controller.Delete)
router.put('/api/update/:idnote',controller.Update);
// router.get('/api/save',)


module.exports = router