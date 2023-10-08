const router = require('express').Router();


const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
    deleteAll,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought).delete(deleteAll);

router.route('/:thoughtId')
.get(getSingleThought)
.put(updateThought)
.delete(deleteThought);

router.route('/:thoughtId/reactions')
.post(addReaction);

router.route('/:thoughtId/reactions/:reactionsId')
.delete(deleteReaction);

module.exports = router;