import { describe, test } from 'node:test'
import assert from 'node:assert'

import { aiMatrixGenerator, personEvalMatrix } from "../src/core/AIMinimaxSolver.js";


describe('AI Eval matrix', () => { 

  test('should give a rigth AI matrix for 3x3', () => {
    const matrix = aiMatrixGenerator(3);

    const expect = [
      [10, 25, 40],
      [5, 20, 35],
      [0, 15, 30]
    ]

    assert.deepStrictEqual(matrix, expect);
  });

  test('should give a right AI matrix for 4x4', () => {
    const matrix = aiMatrixGenerator(4);

    const expect = [
      [15, 35, 55, 75],
      [10, 30, 50, 70],
      [5, 25, 45, 65],
      [0, 20, 40, 60]
    ]

    assert.deepStrictEqual(matrix, expect);
  });

  test('should give a right AI matrix for 5x5', () => {
    const matrix = aiMatrixGenerator(5);

    const expect = [
      [20, 45, 70, 95, 120],
      [15, 40, 65, 90, 115],
      [10, 35, 60, 85, 110],
      [5, 30, 55, 80, 105],
      [0, 25, 50, 75, 100]
    ]

    assert.deepStrictEqual(matrix, expect);
  });

  test('should give a right AI matrix for 6x6', () => {
    const matrix = aiMatrixGenerator(6);

    const expect = [
      [25, 55, 85, 115, 145, 175],
      [20, 50, 80, 110, 140, 170],
      [15, 45, 75, 105, 135, 165],
      [10, 40, 70, 100, 130, 160],
      [5, 35, 65, 95, 125, 155],
      [0, 30, 60, 90, 120, 150]
    ]

    assert.deepStrictEqual(matrix, expect);
  });
});


describe('Person eval matrix', () => {

  test('should give a right person matrix for 3x3', () => {
    const matrix = personEvalMatrix(3);

    const expect = [
      [-30, -35, -40],
      [-15, -20, -25],
      [0, -5, -10]
    ]

    assert.deepStrictEqual(matrix, expect);
  });

  test('should give a right person matrix for 4x4', () => {
    const matrix = personEvalMatrix(4);

    const expect = [
      [-60, -65, -70, -75],
      [-40, -45, -50, -55],
      [-20, -25, -30, -35],
      [0, -5, -10, -15],
    ]

    assert.deepStrictEqual(matrix, expect);
  });

  test('should give a right person matrix for 5x5', () => {
    const matrix = personEvalMatrix(5);

    const expect = [
      [-100, -105, -110, -115, -120],
      [-75, -80, -85, -90, -95],
      [-50, -55, -60, -65, -70],
      [-25, -30, -35, -40, -45],
      [0, -5, -10, -15, -20],
    ]

    assert.deepStrictEqual(matrix, expect);
  });

  test('should give a right person matrix for 6x6', () => {
    const matrix = personEvalMatrix(6);

    const expect = [
      [-150, -155, -160, -165, -170, -175],
      [-120, -125, -130, -135, -140, -145],
      [-90, -95, -100, -105, -110, -115],
      [-60, -65, -70, -75, -80, -85],
      [-30, -35, -40, -45, -50, -55],
      [0, -5, -10, -15, -20, -25]
    ]

    assert.deepStrictEqual(matrix, expect);
  });

});