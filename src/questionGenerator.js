const questions = [
    "What is $$ Spirit Animal?", 
    "what do you think about $$", 
    "who would be the person $$ die for",
    "where do you find $$ in another 10 years", 
    "Who is there in $$ ’s emergency contact", 
    "What is the first thing as a baby $$ had?",
    " What is $$'s guilty pleasure?",
    "Who is the last person that $$ stalked on social media?",
    "Why did $$'s last relationship end?",
    "What habit can’t $$ seem to quit?",
    "What is $$'s secret talent if they have one?",
    "What would $$ do with a million dollars?",
    "What is the most romantic thing that $$ has ever done?",
    "What is $$'s worst childhood memory?"
]

function randomitem(myArray) {
    return myArray[Math.floor(Math.random()*myArray.length)];
}
export const questionGenerator = (names) => {
    const name = randomitem(names);
    const question = randomitem(questions);
    return question.replace('$$',name);
}