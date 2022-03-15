const {
  AuthenticationError
} = require('apollo-server-express');
// import user model
const {
  User, ToDo
} = require('../models');
// import sign token function from auth
const {
  signToken
} = require('../utils/auth');

const resolvers = {

  // get a single user by either their id or their username
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id
        })
          .select('-__v -password')
          .populate('toDo');

        return userData
      }
      throw new AuthenticationError('Not logged in');
    }
  },

  Mutation: {

    // Create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return {
        token,
        user
      };
    },

    // Login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    login: async (parent, {
      email,
      password
    }) => {
      const user = await User.findOne({
        email
      });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return {
        token,
        user
      };
    },

    // Add a new todo
    addToDo: async (parent, args, context) => {
      if (context.user) {
        const toDo = await ToDo.create(args);
        const updateToDo = await User.findOneAndUpdate({
          _id: context.user._id
        }, 
        {
          $push: {
            toDo: toDo._id
          }
        }, 
        {
          new: true,
          runValidators: true
        })
          .select('-__v -password')
          .populate('toDo');

        return updateToDo;
      }

      throw new AuthenticationError('You need to be logged in');
    },

    // Remove a todo by _id
    removeToDo: async (parent, { _id }, context) => {
      if (context.user) {

        const updateToDo = await User.findOneAndUpdate(
          { _id: context.user._id },
            { $pull: { toDo: _id }},
          { new: true }
        )
          .select('-__v -password')
          .populate('toDo');
        return updateToDo;
      }

      throw new AuthenticationError('You need to be logged in');
    },

<<<<<<< HEAD
    // Update a todo by _if
    updateToDo: async (parent, { _id, text, done }, context) => {
=======
    updateToDo: async (parent, { _id, text }, context) => {
>>>>>>> a925efdccb64e83443e02596b533573568858643
      if (context.user) {
        const updateToDo = await ToDo.findOneAndUpdate(
          { _id },
          { text },
          { new: true }
        )
        .select('-__v -password')
        .populate('toDo')

        return updateToDo;
      }

      throw new AuthenticationError('You need to be logged in');
    },

    updateDone: async (parent, { _id, done }, context) => {
      if (context.user) {
        const updateUser = await ToDo.findOneAndUpdate(
          { _id },
          { done },
          { new: true }
        ).populate('toDo');

        return updateUser;
      }

      throw new AuthenticationError('You need to be logged in');
    }
  }
};

module.exports = resolvers