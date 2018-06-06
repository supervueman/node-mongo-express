const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const schema = new Schema({
  body: {
    type: String,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: `Post`
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: `User`
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: `Comment`
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: `Comment`
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
},
{
  timestamps: false
});

schema.set(`toJSON`, {
  virtuals: true
});

module.exports = mongoose.model('Comment', schema);
