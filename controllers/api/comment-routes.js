const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll();
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post('/', (req,res) => {
    if (req.session){
        Comment.create({
            comment_text: req.body.comment_text, 
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
        });
    }
})
router.delete('/:id', async (req, res) => {
    try { const commentData = await Comment.destroy({
            where: {id: req.params.id}
        })
        if (!commentData) {
            res.status(400).json({message: 'No comment found'})
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;