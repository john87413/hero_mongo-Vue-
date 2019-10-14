module.exports = app => {

    // 上傳圖片用
    const mongoose = require("mongoose")
    const multer = require('multer')
    const Grid = require('gridfs-stream')
    const crypto = require('crypto')
    const path = require('path');
    const GridFsStorage = require('multer-gridfs-storage')

    const express = require('express')
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../../modules/AdminUser')
    const assert = require('http-assert')
    const router = express.Router({
        mergeParams: true //加這個才可以訪問到url的參數 resource 用作通用接口的東西
    })

    // 新增分類
    router.post('/', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    // 刪除分類
    router.delete('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    // 編輯分類
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    //  拿到全部分類(限制10個)
    router.get('/', async (req, res) => {
        const queryOptions = {}
        if (req.Model.modelName === 'Category') { //這邊的.modelName 單純指的是在modules裡面那些東西的名稱
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(100) //populate 的意思是關聯性 可以用_id 去找
        res.send(items)
    })

    //  以ID 找尋分類 給編輯的時候用 會在 req.ModelEdit 裡使用
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 登錄校驗中間件
    const authMiddleware = require('../../middleware/auth')
    // 取得所需模型中間件
    const resourceMiddleware = require('../../middleware/resource')

    //  使用以上創建的 這邊是一個通用的 增刪改查接口 所以需要在這邊判斷modelName
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

    // -------------------------圖片上傳接口------------------------------------
    const conn = mongoose.createConnection(
        'mongodb+srv://vue123:vue123456@weball-snswc.mongodb.net/test?retryWrites=true&w=majority',
        { useNewUrlParser: true, useFindAndModify: false }
    )
    let gfs;
    conn.once('open', () => {
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads')
    })
    // const upload = multer({ dest: __dirname + '/../../uploads' })  //原本的 這個只能用在有server的情況
    const storage = new GridFsStorage({
        url: 'mongodb+srv://vue123:vue123456@weball-snswc.mongodb.net/test?retryWrites=true&w=majority',
        options: { useNewUrlParser: true }, //這是什麼??
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads'
                    };
                    resolve(fileInfo);
                });
            });
        }
    });
    const upload = multer({ storage });

    // 上傳圖片
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
        const file = req.file
        file.url = `admin/api/image/${file.filename}`
        res.send(file)
    })

    // 顯示全部圖片json
    app.get('/admin/api/files', authMiddleware(), async (req, res) => {
        gfs.files.find().toArray((err, files) => {
            // 是否有files
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: 'No files exist'
                });
            }
            // 有files
            return res.json(files)
        })
    })

    // 顯示單張圖片json
    app.get('/admin/api/files/:filename', authMiddleware(), async (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // 是否有files
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exist'
                });
            }
            // 有files
            return res.json(file)
        })
    })

    // 展示單張圖片
    app.get('/admin/api/image/:filename', async (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // 是否有files
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exist'
                });
            }
            // check if image
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                // Read output
                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
            } else {
                res.status(404).json({
                    err: 'No an image'
                })
            }
        })
    })
    // -------------------------圖片上傳接口------------------------------------

    // 登錄接口
    app.post('/admin/api/login', async (req, res) => {
        const { username, password } = req.body
        // 1.根據用戶名找用戶
        const user = await AdminUser.findOne({ username: username }).select('+password')
        assert(user, 422, '用戶不存在') //用包
        // if(!user){
        //     return res.status(422).send({
        //         message: '用戶不存在'
        //     })
        // }

        // 2.校對密碼
        const isValid = require('bcryptjs').compareSync(password, user.password)
        assert(isValid, 422, '密碼錯誤') //用包
        // if(!isValid){
        //     return res.status(422).send({
        //         message: '密碼錯誤'
        //     })
        // }

        // 3.返回token
        const token = jwt.sign({ id: user._id }, app.get('secret')) //這邊的secret 應該是要全局的 所以得去index.js找 
        res.send({ token })
    })

    // 錯誤處理函數 給assert用的
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}