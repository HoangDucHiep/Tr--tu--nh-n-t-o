class State {
    static MOVE_1_THIEF = { name: "move 1 thief", value: { T: 1, R: 0 } };
    static MOVE_1_RICH = { name: "move 1 rich person", value: { T: 0, R: 1 } };
    static MOVE_2_THIEVES = { name: "move 2 thieves", value: { T: 2, R: 0 } };
    static MOVE_2_RICHS = { name: "move 2 rich persons", value: { T: 0, R: 2 } };
    static MOVE_1_THIEF_1_RICH = { name: "move 1 thief and 1 rich person", value: { T: 1, R: 1 } };

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
        if ((this.richPersons > 0 && this.thieves > this.richPersons) || 
            (3 - this.richPersons > 0 && (3 - this.thieves) > (3 - this.richPersons))) {
            return false;
        }
        if (this.richPersons < 0 || this.thieves < 0 || this.richPersons > 3 || this.thieves > 3) {
            return false;
        }
        return true;
    }

    getNextValidStates() {
        const moves = [
            State.MOVE_1_RICH,
            State.MOVE_1_THIEF,
            State.MOVE_1_THIEF_1_RICH,
            State.MOVE_2_RICHS,
            State.MOVE_2_THIEVES,
        ];
        const nextStates = [];

        for (let move of moves) {
            let nextState = this.#getNextState(move);
            if (nextState.isValidState()) {
                nextStates.push(nextState);
            }
        }

        return nextStates;
    }

    #getNextState(move) {
        if (this.boatPosition === 0) {
            return new State(this.thieves - move.value.T, this.richPersons - move.value.R, 1, this, `${move.name} from left to right`);
        } else {
            return new State(this.thieves + move.value.T, this.richPersons + move.value.R, 0, this, `${move.name} from right to left`);
        }
    }
}

class Solver {
    constructor() {
        this.visitedStates = new Set();
        this.queue = [];
        this.initState = new State(3, 3, 0);
        this.finalState = new State(0, 0, 1);
    }

    solve() {
        this.queue.push(this.initState);
        this.visitedStates.add(this.initState.toString());

        while (this.queue.length > 0) {
            let currentState = this.queue.shift();

            if (this.#isFinished(currentState)) {
                return this.#getSolution(currentState);
            }

            let nextValidStates = currentState.getNextValidStates();
            for (let nextState of nextValidStates) {
                if (!this.visitedStates.has(nextState.toString())) {
                    this.queue.push(nextState);
                    this.visitedStates.add(nextState.toString());
                }
            }
        }
    }

    #getSolution(currentState) {
        let solution = [];
        while (currentState.parent !== null) {
            solution.push(currentState.move);
            currentState = currentState.parent;
        }
        return solution.reverse();
    }

    #isFinished(currentState) {
        return currentState.richPersons === this.finalState.richPersons && currentState.thieves === this.finalState.thieves && currentState.boatPosition === this.finalState.boatPosition;
    }
}

let sv = new Solver();
let solution = sv.solve();
console.log(solution);
