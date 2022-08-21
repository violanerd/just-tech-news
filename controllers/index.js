const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
router.use('/api', apiRoutes);
router.use('/', homeRoutes);

// if make a request to an endpoint that doesn't exist, will get the 404;
router.use((req,res) => {
    res.status(404).end()
});
module.exports = router;