import { PriorityQueue } from "./priority_queue.js";

const BoatPosition = {
    LEFT: 'left',
    RIGHT: 'right'
};

class Move {
    static ONE_THIEF = new Move('move 1 thief', { T: 1, R: 0 });
    static ONE_RICH = new Move('move 1 rich person', { T: 0, R: 1 });
    static TWO_THIEVES = new Move('move 2 thieves', { T: 2, R: 0 });
    static TWO_RICH = new Move('move 2 rich persons', { T: 0, R: 2 });
    static ONE_OF_EACH = new Move('move 1 thief and 1 rich person', { T: 1, R: 1 });

    static ALL_MOVES = [
        Move.ONE_THIEF,
        Move.ONE_RICH,
        Move.TWO_THIEVES,
        Move.TWO_RICH,
        Move.ONE_OF_EACH
    ];

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class State {
    static TOTAL = 3;

    constructor(thieves, richPersons, boatPosition, parent = null, move = null) {
        this.thieves = thieves;
        this.richPersons = richPersons;
        this.boatPosition = boatPosition;
        this.parent = parent;
        this.move = move;
    }

    toString() {
        return `${this.thieves},${this.richPersons},${this.boatPosition}`;
    }

    isValidState() {
        return this.#areNumbersValid() && this.#isLeftBankSafe() && this.#isRightBankSafe();
    }

    getNextStates() {
        return Move.ALL_MOVES
            .map(move => this.#createNextState(move))
            .filter(state => state.isValidState());
    }

    printState() {
        console.log(`Move: ${this.move || 'Initial state'}`);
        console.log(`Left Bank: Thieves=${this.thieves}, Rich=${this.richPersons}`);
        console.log(`Right Bank: Thieves=${State.TOTAL - this.thieves}, Rich=${State.TOTAL - this.richPersons}`);
        console.log(`Boat Position: ${this.boatPosition}`);
        console.log('---------------------------------');
    }

    #areNumbersValid() {
        return this.thieves >= 0 && this.richPersons >= 0 &&
               this.thieves <= State.TOTAL && this.richPersons <= State.TOTAL;
    }

    #isLeftBankSafe() {
        return this.richPersons === 0 || this.thieves <= this.richPersons;
    }

    #isRightBankSafe() {
        const rightThieves = State.TOTAL - this.thieves;
        const rightRich = State.TOTAL - this.richPersons;
        return rightRich === 0 || rightThieves <= rightRich;
    }

    #createNextState(move) {
        const direction = this.boatPosition === BoatPosition.LEFT ? 'to right' : 'to left';
        const moveDescription = `${move.name} from ${this.boatPosition} ${direction}`;
        
        const newThieves = this.boatPosition === BoatPosition.LEFT 
            ? this.thieves - move.value.T 
            : this.thieves + move.value.T;
        
        const newRich = this.boatPosition === BoatPosition.LEFT 
            ? this.richPersons - move.value.R 
            : this.richPersons + move.value.R;
        
        const newBoatPosition = this.boatPosition === BoatPosition.LEFT 
            ? BoatPosition.RIGHT 
            : BoatPosition.LEFT;

        return new State(newThieves, newRich, newBoatPosition, this, moveDescription);
    }
}

class RiverCrossingSolver {
    constructor() {
        this.visited = new Set();
        this.queue = new PriorityQueue((a, b) => a.heuristic - b.heuristic);
        this.initialState = new State(3, 3, BoatPosition.LEFT);
        this.targetState = new State(0, 0, BoatPosition.RIGHT);
    }

    solve() {
        this.queue.push({ node: this.initialState, heuristic: this.#objectiveFunction(this.initialState) });
        this.visited.add(this.initialState.toString());

        while (!this.queue.isEmpty()) {
            const current = this.queue.pop().node;

            if (this.#isSolution(current)) {
                return this.#buildSolutionPath(current);
            }

            for (const nextState of current.getNextStates()) {
                const stateKey = nextState.toString();
                if (!this.visited.has(stateKey)) {
                    this.visited.add(stateKey);
                    this.queue.push({ node: nextState, heuristic: this.#objectiveFunction(nextState) } );
                }
            }
        }

        return null;
    }

    #isSolution(state) {
        return state.thieves === this.targetState.thieves &&
               state.richPersons === this.targetState.richPersons &&
               state.boatPosition === this.targetState.boatPosition;
    }

    #buildSolutionPath(endState) {
        const path = [];
        let current = endState;
        while (current) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    }

    #objectiveFunction(state) {
        return state.boatPosition === BoatPosition.LEFT
            ? state.thieves + state.richPersons
            : 6 - state.thieves - state.richPersons;
    }
}

// Execute the solution
const solver = new RiverCrossingSolver();
const solution = solver.solve();

if (solution) {
    solution.forEach(state => state.printState());
} else {
    console.log("No solution found!");
}