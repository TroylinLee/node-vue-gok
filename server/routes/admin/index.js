module.exports = app => {
  // 引入express框架，新建路由对象，挂载到app上
  const express = require('express')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const AdminUser = require('../../models/AdminUser')
  const router = express.Router({
    mergeParams: true
  })
  
  // 增 添加方法：增加商品、分类等
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 改 修改数据
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  // 删 删除数据
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  })
  // 查 查询方法
  router.get(
    '/',
    async (req, res, next)=> {
      // 校验用户是否登录
      const token = String(req.headers.authorization || '').split(' ').pop()
      assert(token, 401, '请先登录。')
      const { id } = jwt.verify(token, app.get('secret'))
      assert(id, 401, '无效的jwt token')
      req.user = await AdminUser.findById(id)
      assert(req.user, 401, '请先登录。')
      await next()
    },
    async (req, res) => {
      // 不是每个接口都需要子级，需要判断才执行
      const queryOptions = {}
      if (req.Model.modelName === 'Category') {
        queryOptions.populate = 'parent'
      }
      // populate('parent')：创建子级
      const items = await req.Model.find().setOptions(queryOptions).limit(100)
      res.send(items)
    }
  )
  // 根据id获取数据
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })
  app.use(
    '/admin/api/rest/:resource', 
    async (req, res, next) => {
      // inflection可以把大小开头的单数单词转换成小写复数
      const modelName = require('inflection').classify(req.params.resource)
      req.Model = require(`../../models/${modelName}`)
      next()
    }, router
  )

  // 图片上传
  const multer = require('multer')
  const MAO = require('multer-aliyun-oss');
  const upload = multer({dest: __dirname + '/../../uploads'})
  // const upload = multer({
  //   storage: MAO({
  //     config: {
  //         region: '<region>',
  //         accessKeyId: '<accessKeyId>',
  //         accessKeySecret: '<accessKeySecret>',
  //         bucket: '<bucket>'
  //     }
  //   })
  // })
  
  app.use(
    '/admin/api/upload',
    upload.single('file'),
    async (req, res) => {
      const file = req.file
      file.url = `http://www.forres-link.com/uploads/${file.filename}`
      res.send(file)
    }
  )

  // 登录
  app.post('/admin/api/login', async(req, res) => {
    const { username, password } = req.body
    // 1. 根据用户名查找
    // select：-前缀被排除的，+前缀强制取出
    const user = await AdminUser.findOne({username}).select('+password')
    assert(user, 422, '用户不存在！')
    
    // 2. 校验密码
    // compareSync 比较明文和密文是否匹配
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '账号或密码错误！')

    // 3. 返回token
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    res.send({token})
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}