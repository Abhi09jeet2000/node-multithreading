import express from "express";
import {Worker} from "worker_threads";

const app = express();

const port = 3000;

const THREAD_COUNT = 2;

const createWorker = () =>{
 return new Promise((resolve, reject)=>{
  const worker = new Worker("./two-worker.js",{
   workerData:{thread_count: THREAD_COUNT}
  });
  worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (msg) => {
      reject(`An error ocurred: ${msg}`);
    });
 });
}


app.get('/non-blocking-two-workers', async (request, response)=>{
 const workingPromises = [];
 for(let i = 0; i<THREAD_COUNT; i++){
  workingPromises.push(createWorker());
 }
 const thread_results = await Promise.all(workingPromises);

 const total = thread_results[0] +thread_results[1];

 response.status(200).send(`Thread result: ${total}`);
})

app.listen(port,()=>{
 console.log(`App listening on port ${port}`)
})