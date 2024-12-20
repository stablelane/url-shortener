const express = require('express')
const mongoose = require('mongoose')
const app = express()
const shortUrl = require('./models/shortUrl')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
require('dotenv').config()
const cookieParser = require('cookie-parser');
mongoose.connect('mongodb://localhost/urlShortner')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
 
app.get('/', authenticateToken, async (req, res) => {    
    const shortUrls = await shortUrl.find({ userId: req.userId })
    console.log(shortUrls)
    res.render('index', { shortUrls: shortUrls})
})
app.get('/signup', (req,res) => {
    res.render('signup')
})
app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
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
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        if (await bcrypt.compare(req.body.password, user.password)){
            console.log("password is correct")
            const accessToken = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)
            // res.json({ accessToken: accessToken})
            res.cookie('token', accessToken, { httpOnly: true, secure: true,sameSite: 'None', maxAge: 299999.88 }); // secure flag for HTTPS

            return res.json({ message: 'Login successful' });
        } else {
            console.log("password is incorrect")
        }
        
        
    } catch (error) {
        res.status(403).json({ error: error.message})
    }
})
app.post('/shortUrl', authenticateToken, async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl, userId: req.userId })
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

// jwt authentication midddleware
function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (token == null) return res.status(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userid) => {
        if (err) return res.status(403)
        req.userId = userid
        next()
    })

}

app.listen(process.env.PORT || 5000)