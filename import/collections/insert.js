
// import { MongoCron } from 'mongodb-cron';
import { Mongo } from 'meteor/mongo';
// import { MongoClient } from 'mongodb';
export const user_details = new Mongo.Collection('user_details');                                              
export const task_list = new Mongo.Collection('task_list');
//export const task_assigned = new Mongo.Collection('task_assigned');
export const task_assignment = new Mongo.Collection('task_assignment');
export const notification = new Mongo.Collection('notification');
// export const mongocron  = new Mongo.;
// export const cron_jobs_reminder = new Mongo.Collection('cron_jobs_reminder');
// export const cron_reminder = new Mongo.Collection('jobs');
// const cron = new MongoCron({
//   cron_reminder, // a collection where jobs are stored
//   onDocument: async (doc) => console.log(doc), // triggered on job processing
//   onError: async (err) => console.log(err), // triggered on error
// });
 
// cron.start();
