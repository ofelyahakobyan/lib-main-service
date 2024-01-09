import path from 'path';
import morgan from 'morgan';
import express from 'express';
import http from 'http';
import errorHandler from './middlewares/errorHandler';
import cors from './middlewares/cors';
import router from './routes';

// import { Queue, Worker } from 'bullmq';
// import { Emitter } from "@socket.io/redis-emitter";
// import {createAdapter} from '@socket.io/redis-adapter';
// import {createClient} from 'redis';
// import IORedis from 'ioredis';

// import {Server} from 'socket.io';

// const connection = new IORedis('redis://redis_db:6379', {maxRetriesPerRequest: 0});
//
// const myQueue = new Queue('recipes', {connection});

// async function addJobs() {
//   await myQueue.add('pizza', { cheese: 'chedder', vegies: 'pepper' }, { removeOnComplete: true, removeOnFail: true },);
//   await myQueue.add('soup', { meat: 'beaf' });
// }

// await addJobs();

const app = express();
const server = http.createServer(app);
// const io = new Server(
//   server,
//   {
//     cors: {
//       origin: '*',
//       methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
//       allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'origin', 'content-type', 'accept', 'authorization'],
//       credentials: true,
//     },
//   });
// const pubClient =  createClient({ url: 'redis://redis_db:6379' });
// const subClient = pubClient.duplicate();

// io.adapter(createAdapter(pubClient, subClient));
//
// const emitter = new Emitter(pubClient);
// Redis client for handling events
// await pubClient.connect();
// const emitter = new Emitter(pubClient);
//  await pubClient.connect();
// io.on('connect', async (client) => {
//    client.emit('greeting', { message: 'TEST MESSAGE' });
//   setTimeout( () => {
//     emitter.emit('ev', 'EMITTER');
// }, 10000);
// });

// const clients = io.sockets;
// console.log("==========================");
// console.log(clients);
// console.log("==========================");

// setTimeout( () => {
//   emitter.emit('ev', 'EMITTER');
// }, 15000);
// Handle messages received on the 'news' channel

// await pubClient.publish('news', (m) => {
//   console.log("m");
// });
// await subClient.connect();
// await subClient.on('news', (m) => {
//   console.log("m");
// });

// await io.on('news', (m)=>{
//   console.log("m")
// })

// pubClient.subscribe('news');
//
// // Handle messages received on the 'news' channel
// pubClient.on('message', (channel, message, payload1, payload2, payload3) => {
//   if (channel === 'news') {
//     console.log('Received news:', message);
//     console.log('Payload values:', payload1, payload2, payload3);
//     // Handle the news event and its payload here
//   }
// });

// await pubClient.connect();
// setTimeout( () => {
//   pubClient.publish('pub', 'PUBLISHED');
// }, 10000);

const { BASE_URL } = process.env;
console.log(BASE_URL);

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.resolve('src/public')));

app.use(BASE_URL, router);

app.use(errorHandler.notFound);
app.use(errorHandler);

const port = +process.env.MAIN_PORT || 4000;

server.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));

// let worker ;

// if(connection) {
//    worker = new Worker('recipes', async job => {
//       console.log(job.data);
//     },
//      { connection }
//   );
// }
//
// worker.on('completed', job => {
//   console.log(`${job.id} has completed!`);
// });
