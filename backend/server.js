import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/issue';


const app=express();
const router = express.Router();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));



  //connecting to database
mongoose.connect('mongodb://localhost:27017');

const connection = mongoose.connection;

connection.once('open',()=>
{
    console.log('mongoDB connected');
})



//creating end points:
router.route('/issue').get((req,res)=>{
    Issue.find((err,issues)=>
    {
        if(err){
            console.log(err);
        }
        else{res.json(issues);}
        
    });
});


router.route('/issue/:id').get((req,res)=>
{
    Issue.findById(req.params.id, (err,issue)=>{
        if(err){
            console.log(err);
        }
        else{res.json(issue);}
    });
})


router.route('/issue/add').post((req,res)=>{
    let issue= new Issue(req.body);
    issue.save().then((issue)=>
    {
        res.status(200).json({'issue':'added succesfully'});
    }).catch(err=>{
        res.status(400).send('Failed to create new record');
    });
});


router.route('/issue/update/:id').post((req,res)=>
{
    Issue.findById(req.params.id, (err,issue)=>{
        if(!issue){
            return next(new Error('could not load document'));
        }
        else{
            issue.title=req.body.title;
            issue.responsible=req.body.responsible;
            issue.description=req.body.description;
            issue.severity=req.body.severity;
            issue.status=req.body.status;
            
            issue.save().then((issue)=>
            {
                res.json('Updated!');
            }).catch(err=>{
                res.status(400).send('Update Failed');
            });
        }
    });
});

router.route('/issue/delete/:id').delete((req,res)=>{
    Issue.findByIdAndRemove(req.params.id, (err,issue)=>{
        if(err){
            res.json(err);
        }
        else{
            res.json('Deleted successfully!');
        }
    })
})
//connecting the routes to home page..in router we will create the end points
app.use('/', router);



app.listen(4000, ()=>{
console.log('server running on port 4000');
});