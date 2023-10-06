const express = require('express')
const axios = require('axios')
const cors = require('cors')
const Redis = require('redis')

const redisClient = Redis.createClient()

const app = express()
app.use(cors())

const PORT = 3000
const DEFAULT_EXPERITION = 6379

app.get("/",(req, res)=>{
    res.send("Welcome from docker")
})

app.get("/photos",async (req, res)=>{
    try{
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

    }catch(error){
        res.json(error)
    }

})
app.get("/photos:id",async (req, res)=>{
    try{
        const id = req.params.id
        const {data} = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`)
        res.json(data)
    }
    catch(error){
        res.json(error)
    }
})

app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`)
})