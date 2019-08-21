//the start of a pre-processing function
function isNight() {
	var maker_note_exif_tag = 37500;
    var infrared_status_byte = 80;
	//true if infared is on
	return true;
}

/*	
	Processes one image at a time
	Input: link to image and a full path to a .json key
	Output: true if image contains an animal object. False otherwise.
*/
async function objectDetection(link, keyFileName) {
	// Imports the Google Cloud client library
	const vision = require('@google-cloud/vision').v1;
	const fs = require('fs');
	
	// Creates a client
	const client = new vision.ImageAnnotatorClient(keyFileName);

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
	var animal;
	if(animalFound && (score*100 >= 60.0)) {
		animal = true;
	}
	else {
		animal = false;
	}
	return r;
}

/* 
	Perform async batch image annotation 
	output gets written to a JSON file in the specified location.
*/
async function multipleImageObjectDetection(inputImageUri, outputUri) {
	// Imports the Google Cloud client library
	const vision = require('@google-cloud/vision').v1;
	const client = new vision.ImageAnnotatorClient();
	
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
	const batchSize = 50;
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
}

