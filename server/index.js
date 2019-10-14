const express = require('express');

const app = express()

app.set('secret', 'fhehwfiuhewu') //這邊的 "fhehwfiuhewu" 不應該寫在這裡

app.use(require('cors')())
app.use(express.json())
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./plugins/db')(app) //讓裡面的東西都可以使用app ex:index.js
require('./routes/admin')(app) //讓裡面的東西都可以使用app ex:index.js
require('./routes/web')(app) //讓裡面的東西都可以使用app ex:index.js

// Handle production
// if(process.env.NODE_ENV === 'production'){//這個東西只是分辨你是上架後的東西嗎 如果是才會跑下面的東西
    // Static folder
    app.use(express.static(__dirname + '/public/'));//指定你的靜態資源在哪
    
    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html') )//指定路由
// }

// How to listen
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));