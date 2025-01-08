const SIZE = 3;
//2 dimensions array comparison
Array.prototype.equals = function (multiArray) {
    if (!multiArray) {
        return false;
    }

    if (multiArray === this) {
        return true;
    }

    if (this.length !== multiArray.length) {
        return false;
    }

    for (let i = 0; i < this.length; i++) {
        if (this[i].length !== multiArray[i].length) {
            return false;
        }

        for (let j = 0; j < this[i].length; j++) {
            if (this[i][j] !== multiArray[i][j]) {
                return false;
            }
        }
    }

    return true;
}

class Node {
    static UP = "UP";
    static DOWN = "DOWN";
    static LEFT = "LEFT";
    static RIGHT = "RIGHT";

    constructor(matrix, emptyX, emptyY, parent, move) { 
        this.matrix = matrix;
        this.emptyX = emptyX;
        this.emptyY = emptyY;
        this.parent = parent;
        this.move = move;
    }

    doMove(move) { 
        let newMatrix = this.matrix.map(row => row.slice()); //get shallow copy of matrix
        let newEmptyX, newEmptyY;

        switch (move) {
            case Node.UP:
                newEmptyX = this.emptyX + 1;
                newEmptyY = this.emptyY;
                break;
            case Node.DOWN:
                newEmptyX = this.emptyX - 1;
                newEmptyY = this.emptyY;
                break;
            case Node.LEFT:
                newEmptyX = this.emptyX;
                newEmptyY = this.emptyY + 1;
                break;
            case Node.RIGHT:
                newEmptyX = this.emptyX;
                newEmptyY = this.emptyY - 1;
                break;
        }

        if (!this.#isSafe(newEmptyX, newEmptyY)) { 
            return null;
        }

        newMatrix[this.emptyX][this.emptyY] = newMatrix[newEmptyX][newEmptyY];
        newMatrix[newEmptyX][newEmptyY] = 0;

        return new Node(newMatrix, newEmptyX, newEmptyY, this, move);
    }


    #isSafe(x, y) {
        return x >= 0 && x < this.matrix.length && y >= 0 && y < this.matrix.length;
    }

    toString() { 
        return this.matrix.map(row => row.join(" ")).join("\n");
    }
}


function solvePuzzle(startMatrix, emptyX, emptyY, finalMatrix) {

    if (!isSolvable(startMatrix, finalMatrix)) {
        console.log("Unsolvable puzzle");
        return null;
    }

    const qp = []; //queue for dfs
    const visited = new Set(); //visited nodes

    const start = new Node(startMatrix, emptyX, emptyY, null, null);

    qp.push(start);
    
    while (qp.length > 0) {
        const cur = qp.shift();

        if (cur.matrix.equals(finalMatrix)) {
            return cur;
        }

        visited.add(cur.matrix);

        const up = cur.doMove(Node.UP);
        const down = cur.doMove(Node.DOWN);
        const left = cur.doMove(Node.LEFT);
        const right = cur.doMove(Node.RIGHT);

        if (up && !visited.has(up.matrix)) {
            qp.push(up);
        }

        if (down && !visited.has(down.matrix)) {
            qp.push(down);
        }

        if (left && !visited.has(left.matrix)) {
            qp.push(left);
        }

        if (right && !visited.has(right.matrix)) {
            qp.push(right);
        }
    }
}

function isSolvable(start, final) {
    let invCountStart = getInvCount(start);
    let invCountFinal = getInvCount(final);

    return invCountStart % 2 === invCountFinal % 2;
}

function getInvCount(matrix) {
    let arr = matrix.flat();
    let invCount = 0;

    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] && arr[j] && arr[i] > arr[j]) {
                invCount++;
            }
        }
    }

    return invCount;
}


let matrix = [
    [1, 2, 3],
    [5, 6, 0],
    [7, 8, 4]
];

let finalState = [
    [1, 2, 3],
    [0, 8, 6],
    [5, 7, 4]
];

let result = solvePuzzle(matrix, 1, 2, finalState);

let moves = [];

while (result) {
    moves.push(result.toString() + "\n");
    result = result.parent;
}

console.log(moves.reverse().join(" "));