/**
 * Provides classes for DFA, NFA, and epsilon-NFA.
 * 
 * Author: Eric Liu (https://ericliu.ca)
 */

const dfaFile = require('./dfa.json');
const nfaFile = require('./nfa.json');


/**
 * Validates the initial dfa object to assure that it has the following properties defined:
 * alphabet, states, initialState, finalStates, transitions.
 * 
 * @param {object} dfa 
 */
const validateDFAProperties = (dfa) => {
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
};


/**
 * Validates the alphabet so that all symbols are strings, there are no duplicates, and that
 * no symbol is just pure whitespace.
 * 
 * @param {object} dfa 
 */
const validateAlphabet = (dfa) => {
    const result = new Set();

    dfa.alphabet.forEach(x => {
        if (typeof x !== 'string') {
            throw new Error(`symbol in alphabet must be a string, but got ` + 
                `${x} of type ${typeof x}.`);
        } else if (result.has(x)) {
            throw new Error(`duplicate symbol in alphabet ${x}.`);
        } else if (x.trim().length === 0) {
            throw new Error(`symbol in alphabet must not be solely whitespace.`);
        }

        result.add(x);
    });

    return result;
};


/**
 * Validates the states so that all symbols are strings, there are no duplicates, and that
 * no symbol is just pure whitespace.
 * 
 * @param {object} dfa 
 */
const validateStates = (dfa) => {
    const result = new Set();

    dfa.states.forEach(x => {
        if (typeof x !== 'string') {
            throw new Error(`symbol in states must be a string, but got ` + 
                `${x} of type ${typeof x}.`);
        } else if (result.has(x)) {
            throw new Error(`duplicate symbol in states ${x}.`);
        } else if (x.trim().length === 0) {
            throw new Error(`symbol in states must not be solely whitespace.`);
        }

        result.add(x);
    });

    return result;
};


/**
 * Validates the initialState so that it is a string, and is included in the set of 
 * all states.
 * 
 * @param {object} dfa
 * @param {Set} states 
 */
const validateInitialState = (dfa, states) => {
    if (typeof dfa.initialState !== 'string') {
        throw new Error(`initialState must be a string, but got ` + 
            `${dfa.initialState} of type ${typeof dfa.initialState}.`);
    } else if (!states.has(dfa.initialState)) {
        throw new Error(`initialState is not a valid state.`);
    } else if (dfa.initialState.trim().length === 0) {
        throw new Error(`initialState must not be solely whitespace.`);
    }
};


/**
 * Validates the finalStates so that all symbols are strings, and all are included in the 
 * set of all states.
 * 
 * @param {object} dfa 
 * @param {Set} states 
 */
const validateFinalStates = (dfa, states) => {
    const result = new Set();

    dfa.finalStates.forEach(x => {
        if (typeof x !== 'string') {
            throw new Error(`symbol in finalStates must be a string, but got ` + 
                `${x} of type ${typeof x}.`);
        } else if (result.has(x)) {
            throw new Error(`duplicate symbol in finalStates ${x}.`);
        } else if (!states.has(x)) {
            throw new Error(`symbol ${x} for finalStates is not a defined state.`);
        }

        result.add(x);
    });

    return result;
};


/**
 * Validates the transition function/mapping for a DFA such that:
 * - all transitions are defined as 3-tuples of strings
 * - the first element of the 3-tuple is the 'from' state
 * - the second element of the 3-tuple is the 'to' state
 * - the third element of the 3-tuple is the input symbol
 * - both the 'from' and 'to' states are included in the set of all states
 * - the input symbol is included in the set of all alphabet symbols
 * - a particular state can only transiton to at most one state on an input symbol
 * 
 * @param {object} dfa 
 * @param {Set} states 
 * @param {Set} alphabet 
 */
const validateTransitionsDFA = (dfa, states, alphabet) => {
    const result = {};

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
        if (!states.has(x[0])) {
            throw new Error(`first symbol of transition must be a valid state, ` + 
                `but got ${x[0]}.`);
        } else if (!states.has(x[1])) {
            throw new Error(`second symbol of transition must be a valid state, ` + 
                `but got ${x[1]}.`);
        }
        // Element 2 must be a valid symbol in the alphabet:
        else if (!alphabet.has(x[2])) {
            throw new Error(`third symbol of transition must be a valid symbol in the ` + 
                `alphabet, but got ${x[2]}.`);
        }

        if (result[x[0]] !== undefined && 
            result[x[0]][x[2]] !== undefined) {
            throw new Error(`this transition results in non-deterministic behavior ` + 
                `${x[0]} ${x[1]} ${x[2]}`);
        }

        if (result[x[0]] === undefined) {
            result[x[0]] = {};
        }

        result[x[0]][x[2]] = x[1];
    });

    return result;
};


/**
 * Validates the transition function/mapping for a NFA such that:
 * - all transitions are defined as 3-tuples of strings
 * - the first element of the 3-tuple is the 'from' state
 * - the second element of the 3-tuple is the 'to' state
 * - the third element of the 3-tuple is the input symbol
 * - both the 'from' and 'to' states are included in the set of all states
 * - the input symbol is included in the set of all alphabet symbols
 * - a particular state can transition to multiple states on an input symbol
 * 
 * @param {object} dfa 
 * @param {Set} states 
 * @param {Set} alphabet 
 */
const validateTransitionsNFA = (dfa, states, alphabet) => {
    const result = {};

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
        if (!states.has(x[0])) {
            throw new Error(`first symbol of transition must be a valid state, ` + 
                `but got ${x[0]}.`);
        } else if (!states.has(x[1])) {
            throw new Error(`second symbol of transition must be a valid state, ` + 
                `but got ${x[1]}.`);
        }
        // Element 2 must be a valid symbol in the alphabet:
        else if (!alphabet.has(x[2])) {
            throw new Error(`third symbol of transition must be a valid symbol in the ` + 
                `alphabet, but got ${x[2]}.`);
        }

        if (result[x[0]] === undefined) {
            result[x[0]] = {};
        }

        if (result[x[0]][x[2]] === undefined) {
            result[x[0]][x[2]] = [];
        }

        result[x[0]][x[2]].push(x[1]);
    });

    return result;
};


/**
 * ErrorState class is for the implicit error state.
 */
class ErrorState {};


/**
 * DFA class.
 */
class DFA {

    /**
     * Creates a new DFA object.
     * 
     * @param {object} dfa 
     */
    constructor(dfa) {
        validateDFAProperties(dfa);
        this.alphabet = validateAlphabet(dfa);
        this.states = validateStates(dfa);
        validateInitialState(dfa, this.states);
        this.initialState = dfa.initialState;
        this.finalStates = validateFinalStates(dfa, this.states);
        this.transitions = validateTransitionsDFA(dfa, this.states, this.alphabet);
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
    isErrorState() {
        return this.isInErrorState;
    }

    /**
     * Transitions the current state of the DFA given the input symbol.
     * 
     * @param {string} input 
     */
    transition(input) {
        if (!this.alphabet.has(input)) {
            throw new Error(`symbol ${input} is not a valid symbol of the alphabet`);
        }

        if (this.isErrorState()) {
            return;
        }

        if (this.transitions[this.currentState] === undefined ||
            this.transitions[this.currentState][input] === undefined) {
            this.currentState = new ErrorState();
            this.isInErrorState = true;
        } else {
            this.currentState = this.transitions[this.currentState][input];
        }
    }
};


/**
 * NFA class.
 */
class NFA {

    /**
     * Creates a new NFA object.
     * 
     * @param {object} nfa 
     */
    constructor(nfa) {
        validateDFAProperties(nfa);
        this.alphabet = validateAlphabet(nfa);
        this.states = validateStates(nfa);
        validateInitialState(nfa, this.states);
        this.initialState = nfa.initialState;
        this.finalStates = validateFinalStates(nfa, this.states);
        this.transitions = validateTransitionsNFA(nfa, this.states, this.alphabet);
        this.currentStates = [this.initialState];
    }

    /**
     * Returns the current states of the NFA.
     */
    getCurrentStates() {
        return this.currentStates;
    }

    /**
     * Returns whether any one of the current states is an accepting state, i.e. if
     * it is a final state.
     */
    isAcceptingState() {
        return this.currentStates.reduce((prev, curr) => {
            return prev && this.finalStates.has(curr);
        }, true);
    }

    /**
     * Returns whether the current NFA is in an error state.
     */
    isErrorState() {
        return this.currentStates.length === 0;
    }

    /**
     * Transitions the current states of the NFA given the input symbol.
     * 
     * @param {string} input 
     */
    transition(input) {
        if (!this.alphabet.has(input)) {
            throw new Error(`symbol ${input} is not a valid symbol of the alphabet`);
        }

        if (this.isErrorState()) {
            return;
        }

        const result = [];
        this.currentStates.forEach(x => {
            if (this.transitions[x] === undefined ||
                this.transitions[x][input] === undefined) {
                return result.push(new ErrorState());
            } 

            this.transitions[x][input].forEach(y => {
                result.push(y);
            });
        });

        this.currentStates = result.filter(x => {
            return !(x instanceof ErrorState);
        });
    }
};


const log = console.log;

const dfa = new DFA(dfaFile);
const nfa = new NFA(nfaFile);

module.exports = {
    DFA,
    NFA
};
