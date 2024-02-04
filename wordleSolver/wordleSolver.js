import { updateWordleWords } from "../script.js";


export function getWords(green, yellow, not){
    fetch("/wordleSolver/words.txt")
    .then((res) => res.text())
    .then(text => {
        var words = text.split('\n');

        //filter words that include unsued letters
        not.forEach(c => {
            words = words.filter(a => !a.includes(c));
        });


        let yellowFlat = yellow.join('').split('');
        //filter words that include used letters
        yellowFlat.forEach(c => {
            words = words.filter(a => a.includes(c));
        });

        //filter words with yellow letters at the wrong spot
        for (let index = 0; index < yellow.length; index++) {
            const element = yellow[index];
            words = words.filter(c => !element.includes(c.charAt(index)));
        }


        //filter words that don't have the right letter at the right spot
        for (let index = 0; index < green.length; index++) {
            if(green[index] != ""){
                words = words.filter(a => a.charAt(index) == green[index]);
            } 
        }
        
        var scores = countLettersInWords(words, yellow);

        let bestLetter = '';
        let maxCount = 0;

        // Iterate through the letter counts array
        for (let i = 0; i < scores.length; i++) {
            let currentLetter = String.fromCharCode('a'.charCodeAt(0) + i);


            if (!yellow.includes(currentLetter.toUpperCase()) && scores[i] > maxCount) {
                maxCount = scores[i];
                // Convert the index to the corresponding letter
                bestLetter = String.fromCharCode('a'.charCodeAt(0) + i);
            }
            
        }

        let top5Letters = topLettersByIndex(scores);
        console.log(top5Letters);

        let wordWithTopLetters = findWordWithTopLetters(words, top5Letters);
        
        var possibleWords = words;

        updateWordleWords(wordWithTopLetters, words)
    });
}


function countLettersInWords(wordList, excluded) {
    // Create an array to store letter counts (initially filled with zeros)
    let letterCounts = Array(26).fill(0);

    // Iterate through each word in the list
    wordList.forEach(word => {
        // Iterate through each letter in the word
        for (let i = 0; i < word.length; i++) {
            let letter = word[i].toLowerCase();
            if(!excluded.includes(letter.toUpperCase())){
                if (/[a-z]/.test(letter)) {
                    letterCounts[letter.charCodeAt(0) - 'a'.charCodeAt(0)]++;
                }
            } 
        }
    });

    return letterCounts;
}

function topLettersByIndex(letterCounts) {
    // Create an array of objects where each object contains the letter and its count
    let lettersWithCounts = letterCounts.map((count, index) => ({ letter: String.fromCharCode('a'.charCodeAt(0) + index).toUpperCase(), count }));

    // Sort the array in descending order based on the count
    lettersWithCounts.sort((a, b) => b.count - a.count);

    // Take the top 5 letters
    let top5Letters = lettersWithCounts.slice(0, 5);

    return top5Letters;
}

function findWordWithTopLetters(wordList, topLetters) {
    let mostLettersCount = 0;
    let wordWithMostLetters = '';
    let usedLetters = [''];

    // Iterate through each word in the list
    wordList.forEach(word => {
        let wordLetterCount = 0;

        // Iterate through each letter in the word
        for (let i = 0; i < word.length; i++) {
            let letter = word[i]; // Convert to lowercase for case-insensitive counting

            // Check if the letter is one of the top letters
            if (topLetters.some(topLetter => topLetter.letter === letter) && !usedLetters.includes(letter)) {
                wordLetterCount++;
                usedLetters.push(letter);
            }
        }
        usedLetters = [''];

        // Update the word with the most letters if applicable
        if (wordLetterCount > mostLettersCount) {
            mostLettersCount = wordLetterCount;
            wordWithMostLetters = word;
            console.log(wordLetterCount)
            console.log(word);
        }
    });

    return wordWithMostLetters;
}
