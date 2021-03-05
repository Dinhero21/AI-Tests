import random
textCount = 1 # How many texts
wordCount = 2**16 # How many words
text = open( 'Input.txt' , 'r' , errors = 'ignore' ).read()
def detectWords( text ) :
    output = []
    memory = ''
    for i in range( len( text ) ) :
        if text[ i ] == ' ' :
            output.append( memory )
            memory = ''
        else :
            memory += text[ i ]
    output.append( memory )
    return output
words = detectWords( text )
def generateText( textCount , wordCount , words ) :
    dictionary = {}
    for i in range( len( words ) - 1 ) :
        if dictionary.get( words[ i ] ) == None :
            dictionary.update( { words[ i ] : [ words[ i + 1 ] ] } )
            pass
        else :
            dictionary[ words[ i ] ].append( words[ i + 1 ] )
            pass
        pass
    starterDictionary = [ str( next( iter( dictionary ) ) ) ]
    for i in range( textCount ) :
        text = ''
        choice = starterDictionary[ random.randrange( 0 , len( starterDictionary ) , 1 ) ]
        text += choice
        for i in range( wordCount - 1 ):
            if dictionary.get( choice ) == None :
                break
            else :
                choice = dictionary[ choice ][ random.randrange( 0 , len( dictionary[ choice ] ) , 1 ) ]
                text += ' '
                text += choice
        return text
open( 'Output.txt' , 'a' ).write( generateText( textCount , wordCount , words ) )