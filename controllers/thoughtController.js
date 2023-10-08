const { User, Thought } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();

      const thoughtObj = {
        thoughts,
        thoughtCount: await thoughtCount(),
      };

      res.json(thoughtObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      res.json({
        thought,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },


  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought deleted, but no users found',
        });
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async deleteAll(req, res) {
    try {
        const dbthought = await Thought.deleteMany(
            { username: req.body.username }
        );
        if (!dbthought) {
            return res.status(404).json({ message: 'No Thought with this Id' });
        }
    }catch (err) {
        res.status(500).json(err);
    }
},

  async addReaction({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No Thought found with this Id" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteReaction({ params }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No Thought found with this Is" });
      }
      res.json({ message: "Reaction deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
