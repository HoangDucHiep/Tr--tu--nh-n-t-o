// Implement a priority queue using a min heap
//     const pq = new PriorityQueue((a, b) => a.cost - b.cost);

export class PriorityQueue {
  constructor(comparator = (a, b) => a - b) {
    this.comparator = comparator;
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    return this.heap[0];
  }

  push(value) {
    this.heap.push(value);
    this.bubbleUp();
  }

  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;

    if (bottom > 0) {
      this.swap(0, bottom);
    }

    this.heap.pop();
    this.trickleDown();
    return poppedValue;
  }

  bubbleUp() {
    let node = this.size() - 1;

    while (node > 0) {
      const parent = Math.floor((node - 1) / 2);

      if (this.comparator(this.heap[node], this.heap[parent]) >= 0) {
        break;
      }

      this.swap(node, parent);
      node = parent;
    }
  }

  trickleDown() {
    let node = 0;

    while (node * 2 + 1 < this.size()) {
      let leftChild = node * 2 + 1;
      let rightChild = node * 2 + 2;
      let minChild = rightChild < this.size() && this.comparator(this.heap[rightChild], this.heap[leftChild]) < 0 ? rightChild : leftChild;

      if (this.comparator(this.heap[minChild], this.heap[node]) >= 0) {
        break;
      }

      this.swap(node, minChild);
      node = minChild;
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

// Usage
/* const pq = new PriorityQueue((a, b) => a - b);
pq.push(10);
pq.push(5);
pq.push(8);
console.log(pq.pop()); // { cost: 5 }
console.log(pq.pop()); // { cost: 8 }
console.log(pq.pop()); // { cost: 10 }
 */