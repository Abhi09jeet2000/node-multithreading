import express from "express";
import {Worker} from "worker_threads";

const app = express();

const port = 3000;

//Light response 
app.get('/light', (req,res)=>{
 res.status(200).send(
  {
   "name":'Test name'
  }
 )
});

const cpuIntensiveTask = () =>{
 return new Promise((resolve, reject) => {
    let counter = 0;
    for (let i = 0; i < 10_000_000_000; i++) {
      counter++;
    }
    resolve(counter);
  });
}

//heavy blocking response
app.get('/heavy-blocking', async (req, res)=>{
 const value = await cpuIntensiveTask();
 res.status(200).send(`The cpu instensive value is: ${value}`);
})

//heavy non blocking response with worker threads
app.get('/heavy-non-blocking', async (req, res)=>{
  const worker = new Worker('./worker.js');
  worker.on("message", (data)=>{
    res.status(200).send(`Computation value ${data}`);
  });

  worker.on("error", (msg)=>{
    res.status(404).send(`An error occured ${msg}`);
  })
})

app.listen(port,()=>{
 console.log(`App listening on port ${port}`)
})