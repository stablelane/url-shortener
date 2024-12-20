const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortner')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(express.static('public'));


app.get('/', async (req, res) => {    
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls})
})

app.post('/shortUrl', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/increment/:shortUrl', async (req, res) => {
    const Url = await ShortUrl.findOne({ short: req.params.shortUrl })
    res.json(Url)
    console.log(Url,"2")
})
app.get('/:shortUrl', async (req, res) => {
    const Url = await ShortUrl.findOne({ short: req.params.shortUrl })
    console.log(Url, "1", req.params)
    res.redirect(Url.full)
    Url.clicks++
    Url.save()
})

app.listen(process.env.PORT || 5000)