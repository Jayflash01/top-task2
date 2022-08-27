const express = require('express')
const morgan = require('morgan')
const PORT = 5100
const app = express()
const {data} = require('./data')
const fs = require("fs")
app.use(morgan("dev")) // log the request for debugging
app.use(express.json()) // parse json bodies
app.use(express.urlencoded({extended:true}))


// Routes
// get all data
app.get('/data' , (req, res) =>{
    console.log("getting all data");
    // get all data from database
    res.json(data)
})
// single data
app.get('/data/:id' , (req, res) =>{
    // get the id from parameter
    const did = req.params.id
    // get the data that belong to the id
    const singleData = data.find(({id}) => id == did)
    // check if data exist and rerurn data
    if(!singleData){
        console.log("Data not found")
        res.send("Data does not exist")
    } else{
        // console.log(singleData);
        res.json(singleData)
    }
})

// create new data (post)
app.post('/data', (req, res) => {
    // get the request body
    const body = req.body
    // add body to database
    data.push(body)
    console.log(data)
    // send the all data to user
    res.json(data)

})

// edit data (put)
app.put('/data/:id', (req, res) => {
    // get request body from request
    const body = req.body
    // get the data id from params
    const did = req.params.id
    // get data from database and check if it exist
    const editData = data.find(({id}) => id == did)
    if(!editData){
        console.log("Data not found")
        res.send("Data does not exist")
    } else{
        // perform put operation
        const dataCopy = [...data]
        // find index of item to be deleted
        const targetData = data.findIndex(d => d.id == did)
        console.log(targetData)
        // replace the array with request body
        data[targetData] = body
        // return data to user
        res.json(data[targetData])
    }

})

// Delete data (delete request)
app.delete('/data/:id', (req, res) => {
    // get data id from request parameter
    const did = req.params.id
    // get and check if data exist in database
    const deleteData = data.find(({id}) => id == did)
    if(!deleteData){
        console.log("Data not found")
        res.send("Data does not exist")
        return
    }
    // const dataDelete = [...data]
    // const dataDelete = data.splice(targetData,1)
    // remove data from database
    const dataDelete = data.filter(content => content.id != did)
    //return data to user
    res.json(dataDelete)
})
// 404 error
app.use((req, res) => 
    // console.log("Error 404"),
    res.status(404).send('404 Error Page')
)
app.listen(PORT,() => console.log(`server running on port : ${PORT}`))