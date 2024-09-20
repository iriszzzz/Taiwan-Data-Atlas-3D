import dataController from '../controller/Data.js';
import express from 'express';

export default app => {

  const router = express.Router();
  // Create a new Tutorial
  // router.post("/", dataController.getDataCsv1());


  // Retrieve all published Tutorials
  router.post('/Data1', dataController.findAllData1);
  router.get("/Data2", dataController.findAllData2);

  // // Update a Tutorial with id
  // router.put("/:id", tutorials.update);

  // // Create a new Tutorial
  // router.delete("/", tutorials.deleteAll);
};

