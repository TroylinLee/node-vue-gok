const express = require('express')

const app = express()

app.set('secret', 'iasdinmqkmnllhhuu221jbnj')

// 允许跨域
app.use(require('cors')())
// 要创建post方法，需要把请求的对象解析为服务端接收的json格式
app.use(express.json())
// 上传
app.use('/uploads', express.static('./uploads'))
// 后台静态文件
app.use('/admin', express.static('./admin'))
// 网页
app.use('/', express.static('./web'))

// 引入数据库
require('./plugins/db')(app)
require('./routes/admin')(app)
require('./routes/web')(app)

app.listen(3000, () => {
  console.log('http://localhost:3000')
})