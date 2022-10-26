//PAQUETES NECESARIOS

const express = require("express")
const fetch = require("node-fetch")
require("dotenv").config()

//Crear el server de express

const app = express()

//servidor puerto

const PORT = process.env.PORT || 3000

//set template engine
app.set("view engine", "ejs")
app.use(express.static("public"))


// Necesita parsear la info del HTML despues del solicitar POST
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get("/", (req, res)=>{
    res.render('index')
})

app.post("/convert-mp3",async (req, res)=>{
    const videoId = req.body.videoID;
    if(videoId === undefined || videoId === "" || videoId === null){
        return res.render("index",{success : false, message : "Please enter the video ID"})
        }else{
            const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,{
                "method": "get",
                "headers" : {
                    "x-rapidapi-key" : process.env.API_KEY,
                    "x-rapidapi-host" : process.env.API_HOST
                }
            })
            const fetchResponse = await fetchAPI.json()

            if(fetchResponse.status === "ok")
            return res.render("index", {success : true, song_title: fetchResponse.title, song_link : fetchResponse.link})
            else
            return res.render("index", {success : false, message : fetchResponse.msg})
        }
   
})
//Iniciar servidor

app.listen(PORT, ()=> {
    console.log(`arranco ${PORT}`)
})