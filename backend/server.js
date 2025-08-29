const app=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const { ExpressionType } = require('@aws-sdk/client-s3')


app.use(cors())


app.get('/',(req,res)=>{
    return "Hello this server is runnning"
})