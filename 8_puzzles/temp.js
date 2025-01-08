
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

let a = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

let b = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

console.log(a.equals(b));

