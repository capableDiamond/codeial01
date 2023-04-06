const queue = require('../config/kue');

//the function to be delayed being imported
const commentsMailer = require('../mailers/comments_mailer');

/*
'the first parameter to the process fucntion is the name of the queue i.e emails over here
the callback fucntion takes an argument 'job' --> job is basically what it needs to do
there are two things
1. the function that needs to be executed inside of this which is the mailer that is going to be called
2.data the context for comment with which i will fll up the email
*/ 

//this is a worker
//this worker is going to send emails for us rather than us sending it via a controller
queue.process('emails',function(job,done){
    // console.log('emails worker is processing a job');
    commentsMailer.newComment(job.data);
    done();
});