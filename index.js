var express = require('express')
var bodyParser = require('body-parser')
var Hashids = require('hashids')
var hashids = new Hashids('i am salty', 5)

var app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}))

app.use(require('morgan')('dev'))

// app.get('/', function(req, res) {
//   res.send('Hello Backend!')
// })

var server = app.listen(process.env.PORT || 3000)
server.timeout = 1000

module.exports = server

var db = require('./models')

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/new', function (req, res) {
  console.log(req.body.originalUrl)
  db.link.findOrCreate({
    where: {originalUrl: req.body.originalUrl}
  // to encode URL
  }).spread(function (link, created) {
    console.log('created:', created)
    if (created) {
      var hash = hashids.encode(link.id)
      console.log('hash:', hash)
      db.link.update({
        encodedtext: hash
      }, {
        where: {
          originalUrl: req.body.originalUrl
        }
      }).then(function (newlink) {
        db.link.find({
          where: {originalUrl: req.body.originalUrl}
        }).then(function (link) {
          console.log('link', link)
          console.log('new encodedtext', link.encodedtext)
          res.json(link.encodedtext)
        })
      })
    } else {
      res.json(link.encodedtext)
    }
  })
})

app.get('/:encoded', function (req, res) {
  var decodedId = hashids.decode(req.params.encoded)
  console.log('decoded id:', decodedId)
  // to decode text first
  db.link.find({
    where: {id: decodedId}
  }).then(function (link) {
    res.redirect(link.originalUrl)
  })
})
