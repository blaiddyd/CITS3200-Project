const Resource = require('../backend/models/resourceModel')
const config = require('../config')
const path = require('path')
const uuid = require('uuid/v4')
const fs = require('fs')
const ensureDir = require('./ensureDirectory')
const speech = require('@google-cloud/speech')

/**
 * @function analyseAudio
 * @description This function processes audio for translation to text
 * @param {object} apiKey the GCP API key object
 * @param {string} audioID id of the audio on the database
 * @returns
 */
async function analyseAudio(apiKey, audioID) {
	const directory = path.join(__dirname, '/temp/')
	const filename = `${uuid()}.json`
	await ensureDir(directory)
	const keyFilename = path.join(directory, filename)
	fs.writeFileSync(keyFilename, apiKey)
	
	try {
		const client = new speech.SpeechClient({ keyFilename })
		
		const record = await Resource.findOne({ _id: audioID })
		const uri = record.url.replace('https://storage.googleapis.com/', 'gs://')
        
        //get encoding from file extension
        //if file is .flac or .wav, don't need to specify
        //if file is .ogg or .mp3 then need to set encoding

        //if file is .ogg, need to set sample rate as well

		const config = { 
			//encoding: 'LINEAR16',   
    		//sampleRateHertz: 16000, 
			languageCode: 'en-US',  // required 
		}
		
		const request = {
			audio: uri,
			config: config,
		}
		
		// Detects speech in the audio file
		const [response] = await client.recognize(request)
		const transcription = response.results
			.map(result => result.alternatives[0].transcript)
			.join('\n');
		console.log(`Transcription: ${transcription}`)
	
		record.result = transcription
		await record.save()
		
        // is this line needed?
		analyseAudio().catch(console.error)
	}
	catch (e) {
		if (e) throw e
	}
	fs.unlinkSync(keyFilename)
}
module.exports = analyseAudio


