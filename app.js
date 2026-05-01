const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const userRoute = require('./routs/user.routs');
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/user', userRoute);

const URL = "mongodb://stevensaeed10_db_user:Stevensaeed1234%23123%26567%26@ac-7k2odkb-shard-00-00.uwsg3rt.mongodb.net:27017,ac-7k2odkb-shard-00-01.uwsg3rt.mongodb.net:27017,ac-7k2odkb-shard-00-02.uwsg3rt.mongodb.net:27017/Task4?ssl=true&replicaSet=atlas-vrlnz8-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(URL)
.then(()=>{
    console.log('mongodb server started');

    app.listen(3000,()=>{
        console.log('the listening server: 3000');
    });
})
.catch(err=>{
    console.log(err);
});

app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});
