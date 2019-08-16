function isNight() {
	var maker_note_exif_tag = 37500;
    var infrared_status_byte = 80;
	//true if infared is on
	return true;
}

//processes one image at a time
async function objectDetection(link) {
	// Imports the Google Cloud client library
	const vision = require('@google-cloud/vision').v1;
	const fs = require('fs');
	
	// Creates a client
	const client = new vision.ImageAnnotatorClient();

	const gcsUri = link;

	const [result] = await client.objectLocalization(gcsUri);
	const objects = result.localizedObjectAnnotations;
	var animalFound = 0;
	var score;
	objects.forEach(object => {
		if(object.name == "Animal") {
			animalFound = 1;
			score = object.score;
		}
		console.log(`Name: ${object.name}`);
		console.log(`Confidence: ${object.score}`);
	});
	var r;
	if(animalFound && (score*100 >= 60.0)) {
		console.log("found an animal");
		r = true;
	}
	else {
		console.log("did not find an animal");
		r = false;
	}
	return r;
}

/** Perform async batch image annotation */
async function sampleAsyncBatchAnnotateImages(inputImageUri, outputUri) {
	// Imports the Google Cloud client library
	const vision = require('@google-cloud/vision').v1;
	
	const client = new vision.ImageAnnotatorClient();
	// const inputImageUri = 'gs://cloud-samples-data/vision/label/wakeupcat.jpg';
	// const outputUri = 'gs://your-bucket/prefix/';
	
	const source = {
		imageUri: inputImageUri,
	};
	const image = {
		source: source,
	};
	const type = 'OBJECT_LOCALIZATION';
	const featuresElement = {
		type: type,
	};
	
	const features = [featuresElement];
	const requestsElement = {
		image: image,
		features: features,
	};
	const requests = [requestsElement];
	const gcsDestination = {
		uri: outputUri,
	};

	// The max number of responses to output in each JSON file
	const batchSize = 2;
	const outputConfig = {
		gcsDestination: gcsDestination,
		batchSize: batchSize,
	};
	const request = {
		requests: requests,
		outputConfig: outputConfig,
	};

	// Create a job whose results you can either wait for now, or get later
	const [operation] = await client.asyncBatchAnnotateImages(request);

	// Get a Promise representation of the final result of the job
	const [response] = await operation.promise();

	// The output is written to GCS with the provided output_uri as prefix
	const gcsOutputUri = response.outputConfig.gcsDestination.uri;
	console.log(`Output written to GCS with prefix: ${gcsOutputUri}`);
	
	//output has been written to a JSON file in the specified location, now need to read that
}

function analyseImage(link) { //for preprocessing
	//not sure how this is going to work with processing multiple images at once
	
	//if(isNight()){ mark image as blank }
	//any images not eliminated in preprocessing get sent to vision
	
	if( objectDetection(link) ) {
		//mark image as 'Animal
	}
	else {
		//mark image as 'Blank'
	}
}


var imageLink = 'https://cloud.google.com/vision/docs/images/bicycle_example.png';
analyseImage(imageLink);

