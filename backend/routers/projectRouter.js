"use strict";

const router = require("express").Router();

const projectModel = require("../models/projectModel");
const Project = require("mongoose").model(projectModel.modelName);

router.use(require("express").json());

/* 
    This route gets all projects from MongoDB
    inp => A GET request to the route
    out => All saved projects on MongoDB
*/
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error });
  }
});

/* 
    This route adds a single project to MongoDB
    inp => A POST request with req.body.title
    out => The saved Project on MongoDB
*/
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) return res.status(400).json({ msg: "Missing project title." });
    const project = await new Project({ title }).save();

    console.log(`Project ${project._id} created.`);
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

/* 
    This route gets a single project from MongoDB
    inp => A GET request, with the id as parameter
    out => The saved project on MongoDB with the id
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id });
    res.status(200).json({ project });
  } catch (error) {
    res.status(400).json({ error });
  }
});

/* 
    This route updates an image model on MongoDB
    inp => A request, with body {title, ImageIDs} and parameters { id }
    out => The saved Image model on MongoDB
*/
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageIDs } = req.body;

    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res
        .status(400)
        .json({ msg: "No project exists with the given id." });
    }

    if (title) project.title = title;
    if (imageIDs) project.imageIDs = imageIDs;

    const newProject = project.save();
    console.log(`Project ${id} updated.`);
    res.status(200).json(newProject);
  } catch (error) {
    res.status(400).json({ error });
  }
});

/* 
    This route deletes a project from MongoDB
    inp => A DELETE request to this route with id as param
    out => A success or error message
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = Project.findOne({ _id: id });
    if (!project) {
      return res
        .status(400)
        .json({ msg: "No project exists with the given id." });
    }
    await project.remove();
    console.log(`Project ${id} deleted.`);
    res.status(200).json({ mgs: `Project ${id} deleted.` });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
