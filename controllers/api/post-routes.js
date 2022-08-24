const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/authguard');


// GET /api/posts
router.get('/', (req, res) => {
    console.log('==========');
    Post.findAll({
        order: [['created_at', 'DESC']],
        // query config
        attributes: ['id', 'post_url', 'title', 'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
        // the join
        include: [
            { model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'createdAt'],
            include: {
                model: User, 
                attributes: ['username']
            }},
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

// GET /api/posts/1
router.get('/:id', (req, res) => {
    Post.findOne({
        attributes: ['id', 'post_url', 'title', 'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'] ],
        where: { id: req.params.id},
        include: [
            { model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'createdAt'],
            include: {
                model: User, 
                attributes: ['username']
            }},
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

//POst /api/posts
router.post('/', withAuth, (req,res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })

    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
    
})
// PUT /api/posts/upvote
router.put('/upvote', withAuth, (req, res) => {
    // make sure the session exists first
    if (req.session){
        //pass session id along with all desctuctured properties on req.body
    // custom static method created in models/Post.js
        Post.upvote({...req.body, user_id: req.session.user_id},{ Vote, Comment, User })
            .then(updatedVoteData => res.json(updatedVoteData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
        }
});

//PUT /api/posts/1
router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title},
        {where: { id: req.params.id}
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id'})
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

//DELETE /api/posts/1
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {id: req.params.id}
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id'})
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;
    