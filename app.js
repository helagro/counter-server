'use strict'

const express = require('express')
const router = express.Router()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()

const app = express();


// View engine
app.engine(
    '.hbs',
    exphbs({
        defaultLayout: 'main',
        extname: '.hbs'
    })
)
app.set('view engine', '.hbs')

// Parses incoming text data
app.use(bodyParser.urlencoded({
    extended: true
}))

// Directs to the folder 'public' for static resources
app.use(express.static(path.join(__dirname, 'public')))


// ==============================================
//  ROUTES CONFIG
// ==============================================

const allRouteNames = ["./routes/index"]
allRouteNames.forEach(routeName => {
    app.use('/', require(routeName))
});


// Defines route for 404 not found
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
  })


// ==============================================
//  ERROR CONFIG
// ==============================================

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404)
    return res.render('error/404')
  }

  console.log(err)

  // Unhandled errors render 500 error page
  return res.status(500).sendFile(path.join(__dirname, 'views', 'error', '500.html'))
})


// ==============================================
//  START
// ==============================================

const port = 9992

app.listen(port, "0.0.0.0", () => {  //for visble on network
  console.log(`The application is now running on port ${port}`)
})