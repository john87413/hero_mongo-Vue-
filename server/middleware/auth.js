module.exports = options => {
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../modules/AdminUser')
    const assert = require('http-assert')

    return async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '請先登錄') //用包
        const { id } = jwt.verify(token, req.app.get('secret'))
        assert(id, 401, '請先登錄') //用包
        req.user = await AdminUser.findById(id) //req 掛載上去後可以讓next後面的方法都可以獲取的到
        assert(req.user, 401, '請先登錄') //用包
        await next()
    }
}