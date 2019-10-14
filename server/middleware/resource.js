module.exports = options => {
    return async (req, res, next) => {
        const modelName = require('inflection').classify(req.params.resource) //命名規則 model 訪問用的是小寫複數 model則是大寫單數
        req.Model = require(`../modules/${modelName}`)
        next()
    }
}