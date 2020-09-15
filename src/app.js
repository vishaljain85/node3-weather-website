const path = require('path')
const express = require('express');
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')


const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup Handlebards engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Vishal Jain'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Vishal Jain'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Vishal Jain',
        helpText: 'This is some helpful text'
    })
})


app.get('/weather', (req, res) => {

    const address = req.query.address

    if (!address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(address, (error, { latitude, longitude, location } = {} ) => {
        if (error) {
            return res.send({ error })
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
    
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address
            })

        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })

})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found',
        title: '404',
        name: 'Vishal Jain'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found',
        title: '404',
        name: 'Vishal Jain'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})