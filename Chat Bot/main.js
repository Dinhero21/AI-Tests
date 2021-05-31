// Imports
const fs = require( 'fs' )
const readline = require( 'readline' )
const stringSimilarity = require( 'string-similarity' )

// Variables
var lastRequest = 'Hi'


// Functions
function indexOf( object, item ) { // Get the index of an object
  const keys = Object.keys( object ) // Transform object to array
  return keys.indexOf( item ) // Get array index
}
function question( question ) { // Create a input interface
  return new Promise( ( resolve, reject ) => { // Create a promise for async
    const userInput = readline.createInterface({ // Create a user input
      'input': process.stdin, // Delcare input
      'output': process.stdout // Delcare output
    })
    userInput.question( question, ( input ) => { // Create a question for user input
      resolve( input ) // When the question ends resolve the promise
      userInput.close() // Close the question
    })
  })
}
async function init() { // Init function
	var aiConfidenceThreshold = .25 // How much the ai need to be confident to make a decision
	var grammarCorrectionThreshold = .5 // How much error does your text need to be re-corrected
	while( true ) { // Infinite loop
		console.log( `[AI] ${lastRequest}` ) // Say [AI] [AI TEXT]
	  var userInput = checkAndCorrectGrammar( grammarCorrectionThreshold, await question( '[YOU] ' ) ) // Get the user input
		var trainingData = JSON.parse( fs.readFileSync( 'trainingData.json', 'utf-8' ) ) // Get the training data
		var aiResponse = generateAiResponse( aiConfidenceThreshold, trainingData, userInput ) // Generate a response
	}
}
function generateAiResponse( confidenceThreshold, trainingData, request ) { // Generate the ai response
	const bestMatch = stringSimilarity.findBestMatch( request, Object.keys( trainingData ) ).bestMatch // Find the best match for the request
	if( bestMatch.rating >= confidenceThreshold ) { // If you are confident enouth that is correct
		aiResponse = trainingData[ bestMatch.target ] // Make the response the best match
	}
	else { // If you are not confident enouth that is correct
		aiResponse = request // Make the response the request
	}
	if( lastRequest ) { // If the last request is not undefined
		trainingData[ lastRequest ] = request // Update traning data
	}
	lastRequest = aiResponse // Update last reques // t
	fs.writeFileSync( 'trainingData.json', JSON.stringify( trainingData ), 'utf-8' ) // Update training data
	return aiResponse // Return response
}
function checkAndCorrectGrammar( confidenceThreshold, request ) { // Check and correct your grammar
	const words = JSON.parse( fs.readFileSync( 'words.json', 'utf-8' ) ) // Get all the words
	const splitRequest = request.split( ' ' ) // Split the request
	var processedRequest = [] // Create a variable for the processed splited request
	var output = [] // Create a variable for the output
	splitRequest.forEach( ( element ) => { // For each splited request value
		processedRequest.push( stringSimilarity.findBestMatch( element, words ).bestMatch ) // Find the best word that matches with it
	})
	processedRequest.forEach( ( element, index ) => { // For evry "correct" word
		if( element.rating >= confidenceThreshold ) { // Check similarity btween "incorrect" and "correct", if is smaller than change limit
			output.push( element.target ) // Add to output the "correct"
		}
		else { // If not
			output.push( splitRequest.index ) // Add to the output the "incorrect"
		}
	})
	return output.join( ' ' ) // Return the output
}

// Init
init()
