import express from "express";
import mongoose from "mongoose";
import dataController from "./controller/Data.js";
import { db } from "./controller/Data.js";
import cors from 'cors'
import router from "./routes/route.js";

mongoose.set('strictQuery', false);

const app = express();

db.mongoose.connect("mongodb://127.0.0.1:27017/test", { useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {

		app.listen(8000, () => {
			console.log("Server has started!")
		})

    console.log('connected to mongoDB!!');
	}
)

app.use(express.json());
app.use(cors());
app.get('/', async(req, res) => {
	res.json({message: 'Hello World!'});
});
app.get('/Data1', async(req, res) => {
		var condition = {};

		db.datas.find(condition)
		  .then(data => {
			res.json(data);
		  })
		  .catch(err => {
			res.status(500).send({
			  message:
				err.message || "Some error occurred while retrieving datas."
			});
		});
});

app.get('/Data2', async(req, res) => {
	var condition = {};

	db.datas2.find(condition)
	  .then(data => {
		res.json(data);
	  })
	  .catch(err => {
		res.status(500).send({
		  message:
			err.message || "Some error occurred while retrieving datas2."
		});
	});
});

app.get('/Data3', async(req, res) => {
	var condition = {};

	db.datas3.find(condition)
	  .then(data => {
		res.json(data);
	  })
	  .catch(err => {
		res.status(500).send({
		  message:
			err.message || "Some error occurred while retrieving datas3."
		});
	});
});
app.post('/updateData1', async function(req, res){
	//console.log(path2 + ' ' + data2path);
	
	dataController.getDataCsv1(req, res);
	await sleep(1000);
	res.send('sucess');
  });
app.post('/updateData2', async function(req, res){
	dataController.getDataCsv2(req, res);
	await sleep(1000);
	res.send('sucess');
  });

  app.post('/updateData3', async function(req, res){
	dataController.getDataCsv3(req, res);
	await sleep(1000);
	res.send('sucess');
  });


  app.delete('/deleteData', async function(req, res){
	clearCollections();
	res.send('Delete data in DB');
  });



  async function clearCollections() {
	const collections = mongoose.connection.collections;
  
	await Promise.all(Object.values(collections).map(async (collection) => {
		await collection.deleteMany({}); // an empty mongodb selector object ({}) must be passed as the filter argument
	}));
  }

  async function sleep(ms) {
	return new Promise(resolve => {
	  setTimeout(resolve, ms);
	});
  }
  
