const dfaFile = require('./dfa.json');
const { DFA } = require('./dfa');

const dfa = new DFA(dfaFile);
console.log(dfa.getCurrentState());
dfa.transition('0');
console.log(dfa.getCurrentState());
dfa.transition('0');
console.log(dfa.getCurrentState());