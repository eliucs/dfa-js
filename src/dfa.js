const dfaFile = require('./dfa.json');

class ErrorState {};

class DFA {

    /**
     * Creates a new DFA object.
     * 
     * @param {object} dfa 
     */
    constructor(dfa) {

        // Assure that all necessary properties are defined:
        if (!dfa) {
            throw new Error('dfa object not defined in constructor.');
        } else if (!dfa.alphabet) {
            throw new Error('dfa alphabet property not defined.');
        } else if (!dfa.states) {
            throw new Error('dfa states property not defined.');
        } else if (!dfa.initialState) {
            throw new Error('dfa initialState property not defined.');
        } else if (!dfa.finalStates) {
            throw new Error('dfa finalStates property not defined.');
        } else if (!dfa.transitions) {
            throw new Error('dfa transitions property not defined');
        }

        // Validate alphabet:
        this.alphabet = new Set();
        dfa.alphabet.forEach(x => {
            if (typeof x !== 'string') {
                throw new Error(`symbol in alphabet must be a string, but got ` + 
                    `${x} of type ${typeof x}.`);
            } else if (this.alphabet.has(x)) {
                throw new Error(`duplicate symbol in alphabet ${x}.`);
            } else if (x.trim().length === 0) {
                throw new Error(`symbol in alphabet must not be solely whitespace.`);
            }

            this.alphabet.add(x);
        });

        // Validate states:
        this.states = new Set();
        dfa.states.forEach(x => {
            if (typeof x !== 'string') {
                throw new Error(`symbol in states must be a string, but got ` + 
                    `${x} of type ${typeof x}.`);
            } else if (this.states.has(x)) {
                throw new Error(`duplicate symbol in states ${x}.`);
            } else if (x.trim().length === 0) {
                throw new Error(`symbol in states must not be solely whitespace.`);
            }

            this.states.add(x);
        });

        // Validate initialState:
        if (typeof dfa.initialState !== 'string') {
            throw new Error(`initialState must be a string, but got ` + 
                `${dfa.initialState} of type ${typeof dfa.initialState}.`);
        } else if (!this.states.has(dfa.initialState)) {
            throw new Error(`initialState is not a valid state.`);
        } else if (dfa.initialState.trim().length === 0) {
            throw new Error(`initialState must not be solely whitespace.`);
        }
        this.initialState = dfa.initialState;

        // Validate finalStates:
        this.finalStates = new Set();
        dfa.finalStates.forEach(x => {
            if (typeof x !== 'string') {
                throw new Error(`symbol in finalStates must be a string, but got ` + 
                    `${x} of type ${typeof x}.`);
            } else if (this.finalStates.has(x)) {
                throw new Error(`duplicate symbol in finalStates ${x}.`);
            } else if (!this.states.has(x)) {
                throw new Error(`symbol ${x} for finalStates is not a defined state.`);
            }

            this.finalStates.add(x);
        });

        // Validate transitions:
        this.transitions = {};
        dfa.transitions.forEach(x => {
            if (x.length !== 3) {
                throw new Error(`transition must be a 3-tuple of strings, but got ${x}.`);
            }

            x.forEach((y, i) => {
                if (typeof y !== 'string') {
                    throw new Error(`transition must be a 3-tuple of strings, ` + 
                        `element ${i} is ${y} of type ${typeof y}.`);
                }
            });

            // Element 0, 1 must be a valid state:
            if (!this.states.has(x[0])) {
                throw new Error(`first symbol of transition must be a valid state, ` + 
                    `but got ${x[0]}.`);
            } else if (!this.states.has(x[1])) {
                throw new Error(`second symbol of transition must be a valid state, ` + 
                    `but got ${x[1]}.`);
            }
            // Element 2 must be a valid symbol in the alphabet:
            else if (!this.alphabet.has(x[2])) {
                throw new Error(`third symbol of transition must be a valid symbol in the ` + 
                    `alphabet, but got ${x[2]}.`);
            }

            if (typeof this.transitions[x[0]] !== 'undefined' && 
                typeof this.transitions[x[0]][x[2]] !== 'undefined') {
                throw new Error(`this transition results in non-deterministic behavior ` + 
                    `${x[0]} ${x[1]} ${x[2]}`);
            }

            if (typeof this.transitions[x[0]] === 'undefined') {
                this.transitions[x[0]] = {};
            }
            this.transitions[x[0]][x[2]] = x[1];
        });

        this.currentState = this.initialState;
        this.isInErrorState = false;
    }

    /**
     * Returns the current state of the DFA.
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * Returns whether the current state is an accepting state, i.e. if it is
     * a final state.
     */
    isAcceptingState() {
        return this.finalStates.has(this.currentState);
    }

    /**
     * Returns whether the current DFA is in an error state.
     */
    isError() {
        return this.isInErrorState;
    }

    /**
     * Transitions the current state of the DFA given the input symbol.
     * 
     * @param {string} input 
     */
    transition(input) {
        if (!this.alphabet.has(input)) {
            throw new Error(`symbol ${input} is not a valid part of the alphabet`);
        }

        if (this.isError()) {
            return;
        }

        if (typeof this.transitions[this.currentState] === 'undefined' ||
            typeof this.transitions[this.currentState][input] === 'undefined') {
            this.currentState = new ErrorState();
            this.isInErrorState = true;
        } else {
            this.currentState = this.transitions[this.currentState][input];
        }
    }
};

const dfa = new DFA(dfaFile);
