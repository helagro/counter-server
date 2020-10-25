'use strict'
const router = require('express').Router()
const fs = require('fs');
const path = require("path")

var iHistory = []
var lastDayEnd = -1
var i = 0

function addIEvent(delta){
    i += delta
    iHistory.push(new IEvent(+ new Date(), delta))
    console.log(iHistory)
}

fs.readFile("storage.txt", "utf8", (err, data) => {
    addIEvent(parseInt(data))
})

function handleReq(reqBody){
    if (lastDayEnd < reqBody.last_dayEnd){
        console.log("New DayEnd!")
        lastDayEnd = reqBody.last_dayEnd
        
        iHistory = iHistory.filter(iEvent => {
            if(iEvent.time > lastDayEnd){
                return true
            }
            i -= iEvent.delta //getting removed
            return false
        })
    }

    const uploadedIHistory = JSON.parse(reqBody.iHistory)
    uploadedIHistory.forEach(iEvent => {
        if(iEvent.time > lastDayEnd && iEvent.delta != 0){
            i += iEvent.delta
            iHistory.push(iEvent)
        }
    });
    console.log(iHistory)

    fs.writeFile("storage.txt", i, err => {})
}


router.route('/')
.post(async function (req, res) {
    console.log("Req: ", req.body)
    handleReq(req.body)
    
    const  resObj = new Object()
    resObj.i = i

    res.writeHead(200, {'content-type':'text/html'});
    res.write(JSON.stringify(resObj))
    res.end()
    console.log("Res: ", resObj, "\n")
})

router.route('/').get(async (req, res) => {
    const argI = parseInt(req.query.i)
    if(argI != null && !isNaN(argI)){
        addIEvent(argI)
        fs.writeFile("storage.txt", i, err => {})
    }

    res.render('index', {i: i})
    console.log(`i:${i}\n`)
  })



class IEvent{
    constructor(time, delta){
        this.time = time
        this.delta = delta
    }
}

module.exports = router