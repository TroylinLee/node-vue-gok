const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: { type: String },
  // parent数据类型一般都是ID类型，这样可以防止重名
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
})

schema.virtual('children', {
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
  ref: 'Category'
})

schema.virtual('newsList', {
  localField: '_id',
  foreignField: 'categories',
  justOne: false,
  ref: 'Article'
})

module.exports = mongoose.model('Category', schema)