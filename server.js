const express = require('express')
const mongoose = require('mongoose')
const app = express()
const shortUrl = require('./models/shortUrl')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

mongoose.connect('mongodb://localhost/urlShortner')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(express.static('public'));


app.get('/', async (req, res) => {    
    const shortUrls = await shortUrl.find()
    res.render('index', { shortUrls: shortUrls})
})
app.get('/signup', (req,res) => {
    res.render('signup')
})
app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        const newUser = new User ({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        
        })
        await newUser.save()
        res.redirect('/login')
        
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "username already exists"})
        } else {

            res.status(500).json({ error: "Server error. Couldn't create user." });
        }
    }

})
app.get('/login', (req,res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username})
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)){
                console.log("password is correct")
            } else {
                console.log("password is incorrect")
            }
        }
        
    } catch (error) {
        res.status(403).json({ error: error.message})
    }
})
app.post('/shortUrl', async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/increment/:shortUrl', async (req, res) => {
    const Url = await shortUrl.findOne({ short: req.params.shortUrl })
    res.json(Url)
})
app.get('/:shortUrl', async (req, res) => {
    const Url = await shortUrl.findOne({ short: req.params.shortUrl })
    res.redirect(Url.full)
    Url.clicks++
    Url.save()
})

app.listen(process.env.PORT || 5000)