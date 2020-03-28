const questions = [
    "What is $$ Spirit Animal?", 
    "what do you think about $$", 
    "who would be the person $$ die for",
    "where do you find $$ in another 10 years", 
    "Who is there in $$ ’s emergency contact", 
    "What is the first thing as a baby $$ had?",
]

function randomitem(myArray) {
    return myArray[Math.floor(Math.random()*myArray.length)];
}
export const questionGenerator = (names) => {
    const name = randomitem(names);
    const question = randomitem(questions);
    return question.replace('$$',name);
}