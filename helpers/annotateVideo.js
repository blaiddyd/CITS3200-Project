const video = require('@google-cloud/video-intelligence').v1p2beta1;

/**
 * @function annotateVideo
 * @description This function annotates a video
 * @param {string} uri This is a URI string linking to the image to be parsed
 * @returns 
 */
async function annotateVideo(gcsUri){	 
    try {
        // Creates a client
        const client = new video.VideoIntelligenceServiceClient(
            //optional authentication parameters
        );

        const request = {
            inputUri: gcsUri,
            features: ['LABEL_DETECTION'],
            //can also specify outputUri here. result will be stored as a .json
        };

        // Detects labels in a video
        const [operation] = await client.annotateVideo(request);
        console.log('Waiting for operation to complete...');
        const [operationResult] = await operation.promise();

        // Gets annotations for video
        const annotations = operationResult.annotationResults[0];

        const labels = annotations.segmentLabelAnnotations;
        labels.forEach(label => {
            console.log(`Label ${label.entity.description} occurs at:`);
            label.segments.forEach(segment => {
                const time = segment.segment;
                if (time.startTimeOffset.seconds === undefined) {
                time.startTimeOffset.seconds = 0;
                }
                if (time.startTimeOffset.nanos === undefined) {
                time.startTimeOffset.nanos = 0;
                }
                if (time.endTimeOffset.seconds === undefined) {
                time.endTimeOffset.seconds = 0;
                }
                if (time.endTimeOffset.nanos === undefined) {
                time.endTimeOffset.nanos = 0;
                }
                console.log(
                `\tStart: ${time.startTimeOffset.seconds}` +
                    `.${(time.startTimeOffset.nanos / 1e6).toFixed(0)}s`
                );
                console.log(
                `\tEnd: ${time.endTimeOffset.seconds}.` +
                    `${(time.endTimeOffset.nanos / 1e6).toFixed(0)}s`
                );
                console.log(`\tConfidence: ${segment.confidence}`);

            //want to write the label and its associated info to a json file??
            //need to store the info back into the project, 
            //but it is currently only set up for images
            });
        });
    } catch (e) {
        if (e) throw e
      }
}
module.exports = annotateVideo;