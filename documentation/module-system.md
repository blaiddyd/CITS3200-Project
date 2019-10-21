# Module system

## Table of contents

1. [Overview](#overview)
2. [Implementing a new module](#implementing-a-new-module)
3. [Reference](#reference)

---

## Overview

This project is designed to be easily extensible by creating new modules that extend the functionality of the portal. Each module is represented in the UI by a card on the home page.

There are 3 built in modules:

- Ecological Image Classification
- Video Intelligence
- Audio Transcription

---

## Modules

The system works on the premise that users using each module will follow this process:

1. User uploads their Google Cloud Platform API key and other files as input
2. These files gets uploaded and processed
3. The user can see the progress of the task and download the result

The module system take care of generating the user interface and file storage from each module so that new modules can be easily implemented.

#### `Project`

A `Project` contains the links to the files that users have submitted (these are called [`Resource`](#resource)) as well as the API key of the user who uploaded these files. Each `Project` is assigned a unique id that identifies that specific `Project`. You can think of `Project`s as a task that a user has submitted through the portal.

#### `Resource`

A `Resource` is the representation of a file that the user have submitted. It contains information such as the file name and the url of the uploaded file. A `Resource` also holds other information about the file that is specific to the module such as the result (an object containing any key value pairs) and the status of the file (`Pending` or `Parsed`). These information can be freely modified by the module to implement it's processing logic.

For instance, an image that needs to be classified in the Ecological Image Classification module will be assigned the `Pending` status when it is uploaded. Once it is processed, the status is changed to `Parsed` and the result field is populated with the tags that matches with the image. Please refer to [modules/image.js](../modules/image.js) for this implementation.

---

## Implementing a new module

This guide will walk you through how to implement a trivial `Hello World` module that say hello to the user

#### 1. Create a new file under the `modules` directory

Let's call this file `hello.js`

#### 2. Import the necessary files

In `hello.js`, add the following lines

```js
const { Module, ProgressReport } = require('./base')
const Resource = require('mongoose').model('resource')
const path = require('path')
const fs = require('fs')
```

Let's break down these imports

- **Module** and **ProgressReport**: these are the base classes that you need to use to implement the module. Every module can be instantiated with `new Module()` and every progress function needs to return a `ProgressReport`
- **Resource**: this lets you manipulate the `Resource` stored in the database and modify its information.
- **path**: this is a built-in NodeJS library used to manipulate paths. This is necessary for us to implement the download function.
- **fs**: short for "file system", another built-in NodeJS library used to work with the file system. This is also necessary for us to implement the download function.

#### 3. Create a new module with stub functions

Bellow the imports in step 2, let's create a new module with the necessary metadata and 3 functions:

```js
const HelloModule = new Module('Hello World', {
  type: 'Tutorial',
  allowMultiple: false,
  extensions: '.txt',
  downloadTypes: ['Greeting'],
  task,
  progress,
  download
})

async function task(project) {
  // TODO: implement the task function
}

async function progress(project) {
  // TODO: implement the progress function
}

async function download(project, type) {
  // TODO: implement the download function
}

module.exports = VideoModule
```

In the snippet above, we've specified a new module with the name `Hello World` of type `Tutorial` that only allow the user to upload a single file with the extension `.txt` and users can download `Greeting` as the result.

The 3 functions: task, progress and download simply take the project as the input but does nothing.

The last line of the snippet simply export the module so that other files can use it.

#### 4. Add your new module to the list of available modules

Now that we have specified our new `Hello World` module, we need to add it to the list of available modules so that users can see it. To do this, go to [modules/index.js](../modules/index.js) where you will see each of the 3 built in modules being imported and a `modules` variable - which is an array of available modules.

To add our new modules, simply import the file:

```js
const HelloModule = require('./hello')
```

and add our new module to the list of available modules

```js
const modules = [ImageModule, VideoModule, AudioModule, HelloModule]
```

That's it! If you save the file and open the homepage, you will see a new card called "Hello World" with type "Tutorial".

#### 5. Implement task function

Now that we have the UI generated for our module, we can implement the logic of the module. For this, we're simply going to take the name of the file that the user have uploaded (e.g. `document.txt`) and produce a new text file with a greeting (e.g. `greeting.txt` containing `Hello document.txt!`)

First, let's implement the task function - which determines how the files should be processed. In this case, we first need to look at the name of the file, generate a greeting and store this in the result.

```js
async function task(project) {
  // fetch information about the resource with this id
  const id = project.resourceIDs[0]
  const resource = await Resource.findOne({ _id: id })

  // find the name of the file uploaded
  const name = resource.filename

  // generate a greeting
  const greeting = 'Hello ' + name + '!'

  // store this greeting
  resource.result = { greeting }

  // change the status of the resource to Parsed
  resource.status = 'Parsed'

  // save changes made to the resource
  await resource.save()
}
```

Every time a user submit a new task, our task function is going to take the filename, generate a new greeting, store this greeting and change the status of the file to `Parsed`!

**Important note on API keys**

The API key stored on the database under [`Project`](#projectmodel) (`project.apiKey`) is encrypted. In order to use this API key, you must first decrypt it. There's a [decrypt](../helpers/decrypt.js) helper function that will turn this key into a usable API key. Example:

```js
// import the decrypt function
require('../helpers/decrypt')

async function task(project) {
  const { apiKey } = project
  const key = decrypt(apiKey)

  // use key to access Google AI Services
}
```

#### 6. Implement progress function

The progress function specifies whether or not the task has finished as well as optionally more information on the percentage of completion. This information can be viewed by users through the UI.

It is important that the progress function returns a `ProgressReport` object so that a UI can be generated.

In our case, the progress is simply whether or not a greeting has been generated. We can determine this by looking at the status of the resource and seeing whether it is `Pending` or `Parsed`

```js
async function progress(project) {
  // fetch information about the resource
  const id = project.resourceIDs[0]
  const resource = await Resource.findOne({ _id: id })

  // determine the project's completion by looking at the resource's status
  const done = resource.status === 'Parsed'

  // return a ProgressReport object reflecting this
  return new ProgressReport({ done })
}
```

Modules can optionally supply a `data` attribute to `ProgressReport` that is an object with any key value pairs to provide more information. Refer to [modules/image.js](../modules/image.js) for an example of this.

#### 7. Implement download function

The download function supplies the logic of what the user downloads. Recall in step 3, our module specifies 1 download type: `Greeting`. Modules with multiple download types such as the Ecological Image Classification module may have more than 1 type of download ("Animal" and "Blank").

The download function needs to create a file containing the result and return an absolute path to the file to be sent to the user. This file will be deleted after the user has downloaded it. It is very important that an absolute path is returned (as opposed to a relative path) as this is passed throughout the system and thus relative paths may point to different files depending on which file is looking at the path.

```js
// type will always be "Greeting" as we only have 1 download type
async function download(project, type) {
  // fetch information about the resource
  const id = project.resourceIDs[0]
  const resource = await Resource.findOne({ _id: id })

  // specify a new file path
  const filePath = path.resolve(`./temp/${project._id}.txt`)

  // write to this file our greeting
  fs.writeFileSync(filePath, resource.result.greeting)

  // return the file path
  return filePath
}
```

In this case, the function create a new file under the temp folder with the project id as the name and write the greeting into the file. `path.resolve` provided for the `path` library turns a relative path into an absolute path.

#### 8. Rejoice

That's it! With all 3 functions implemented, the Hello World module is now fully functional.

---

## Google AI Services

Each Google API can be accessed as a separate module installed through [NPM (Node Package Manager)](http://npmjs.com). For instance, the Vision API is within the `@google-cloud/vision` package. You can find packages on the NPM registry by searching for "@google-cloud" and install these packages using `npm install PACKAGE_NAME`.

To use the API, you first need an API client. For instance, a vision API client may be initiated as follows:

```js
const client = new vision.ImageAnnotatorClient({ keyFilename })
```

From: [modules/image.js](../modules/image.js)

To initialise a client, you will need to provide an API key (this is stored under [`Project.apiKey`](#projectmodel)). Notice that in the snippet above, the key is provided as a file path - `keyFileName`. Whilst you can provide the [required parameters](https://googleapis.dev/nodejs/vision/latest/v1.ImageAnnotatorClient.html#ImageAnnotatorClient) (credentials, apiEndpoint, email, etc...); it is much easier to write the API key that the user has uploaded into a file and providing that file's path to create the client - this is the strategy used in the built-in modules.

Information on how to use each client library can be found in the official SDK reference.

- [Google Vision Node.js SDK](https://googleapis.dev/nodejs/vision/latest/index.html)
- [Google Video Intelligence Node.js SDK](https://googleapis.dev/nodejs/video/latest/index.html)
- [Google Cloud Speech Node.js SDK](https://googleapis.dev/nodejs/speech/latest/index.html)

---

## Reference

#### Module

##### `constructor(name, options)`

- **name** (_required string_): the module's name
- **options** (_required object_): module's options
  - **type** (_required string_): the module's type for UI purposes
  - **task** (_required [TaskFunction](#TaskFunction)_): processing logic
  - **progress** (_required [ProgressFunction](#ProgressFunction)_): determines the progress of a task
  - **download** (_required [DownloadFunction](#DownloadFunction)_): result downloading logic
  - **allowMultiple** (_optional boolean default `true`_): whether or not users can upload multiple files
  - **extensions** (_required array of string_): file extensions that users can upload
  - **downloadTypes** (_required array of string_): the types of download a user can perform

returns `Module` - a new module instance

##### `validate(name, options)`

Validate the configuration provided when creating a new module

#### TaskFunction(project)

Performs module specific logic on how to process uploaded resources.

- **project** (_required [ProjectModel](#ProjectModel)_): the project to be processed

returns `void`

#### ProgressFunction(project)

Report on the progress of the project.

- **project** (_required [ProjectModel](#ProjectModel)_): the project to report progress on

returns [`ProgressReport`](#ProgressReport) - the project's progress

#### DownloadFunction(project, type)

Specifies the logic of downloading a task's result

- **project** (_required [ProjectModel](#ProjectModel)_): the project
- **type** (_required string_): the type of download

returns `string` - the absolute path to the file to be downloaded

#### ProjectModel

Represents a task submitted by a user

- **resourceIDs** (_array_): the ids of resources associated with this project
- **apiKey** (_object_): the encrypted Google Cloud Platform API key provided by the user

#### ProgressReport

##### `constructor(options)`

- **options** (_required object_): the progress report's data
  - **done** (_required boolean_): whether or not the project is completed
  - **data** (\_optional object mapping string to array of urls): the list of urls to be listed under each category (e.g. keys: animals, blank, pending; values: ["example.com/image1.png"])

#### ResourceModel

Represents a file uploaded by a user

- **title** (_string_): the title of the resource
- **filename** (_string_): the name of the uploaded file
- **url** (_string_): url leading to the file on Google Cloud Storage
- **result** (_object_): the result associated with this resource
- **status** (_string enum_): the status of the resource
  - `Pending`
  - `Parsed`
