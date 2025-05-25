import { redisConnection } from './redis.js';
import { Queue } from 'bullmq';

export const emailQueue = new Queue('emailQueue', {
  connection: redisConnection
});

console.log('Email queue created successfully');
