# dfa.js

This is a JavaScript library for building DFAs, NFAs, and epsilon-NFAs.

## Usage

The finite automata is initialized by passing the following object with the following 
properties in the constructor:

```
Example:

{
    alphabet: ['a', 'b', 'c'],
    states: ['s1', 's2', 's3'],
    initialState: 's1',
    finalStates: ['s3'],
    transitions: [
        ['s1', 's2', 'a']
    ]
}
```

### Properties

- `alphabet`
    - All unique strings, cannot be just whitespace, for epsilon-NFAs cannot include 
    the special string `<EPSILON>`.
- `states`
    - All unique strings, cannot be just whitespace, for epsilon-NFAs cannot include 
    the special string `<EPSILON>`.
- `initialState`
    - Must be included in the set of all states above.
- `finalStates`
    - Must all be included in the set of all states above.
- `transitions`
    - Elements are 3-tuples where the first element is the `from` state, the second 
    element is the `to` state, and the third element is the input symbol, which must be 
    included in the alphabet.

### Functions

- `getCurrentState`
    - For the `DFA` class, this returns a string with your current state, or an 
    `ErrorState` object if it is currently in an error state.
- `getCurrentStates`
    - For the `NFA` and `EpsilonNFA` classes, this returns an array of strings of the 
    current states, and is empty to signal an implicit error state.
- `isAcceptingState`
    - Returns true if the current state(s) are a final state, false otherwise.
- `isErrorState`
    - Returns true if the current state(s) are an error state, false, otherwise.
- `transition`
    - Takes in an input symbol, and transitions the current state(s) using that input.

## Example

Suppose the corresponding DFA, NFA, and epsilon-NFA files are in the following files:

```
const dfaFile = require('/path/to/dfa-file.json');
const nfaFile = require('/path/to/nfa-file.json');
const enfaFile = require('/path/to/e-nfa-file.json');
```

Initialize as following:

```
const { DFA, NFA, EpsilonNFA } = require('dfa-js');

const dfa = new DFA(dfaFile);
const nfa = new DFA(nfaFile);
const enfa = new DFA(enfaFile);
```
