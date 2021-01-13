module.exports = app => {
  // 引入mongoose
  const mongoose = require('mongoose')
  mongoose.connect('mongodb://127.0.0.1:27017/node-vue-wzry', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  require('require-all')(__dirname + '/../models')
}