const makeAudioText = (result) => {
    const transcript = result.map(words => words.alternatives[0].join('\n'))
    return transcript
}

module.exports = makeAudioText