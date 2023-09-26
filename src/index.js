const express = require('express')
const axios = require('axios')
const cors = require('cors')
const Redis = require('redis')

const redisClient = Redis.createClient()

const app = express()
app.use(cors())

const PORT = 3000
const DEFAULT_EXPERITION = 3600

app.get("/",(req, res)=>{
    res.send("Welcome from docker")
})

app.get("/photos",async (req, res)=>{
    const albumId = req.query.albumId

    redisClient.get("photos",async (error, photos)=>{
        if(error) console.error(error)
        if(photos){
            res.json(JSON.parse(photos));
        }
        else{
            const {data} = await axios.get("https://jsonplaceholder.typicode.com/photos",{params:{albumId}})
            redisClient.setEx("photos", DEFAULT_EXPERITION, JSON.stringify(data))
            res.json(data)

        }
    })

})
app.get("/photos:id",async (req, res)=>{
    const id = req.params.id
    const {data} = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`)
    res.json(data)
})

app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`)
})