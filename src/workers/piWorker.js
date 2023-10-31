const { parentPort } = require('worker_threads');
const BigNumber = require('bignumber.js');

// Constants used in the Pi calculation formula
const A = new BigNumber('13591409');
const B = new BigNumber('545140134');
const C = new BigNumber('640320');
const D = new BigNumber('426880');
const E = new BigNumber('10005');

// Constant to determine the number of terms needed for a given precision
const DIGITS_PER_TERM = new BigNumber('14.1816474627254776555');

// Precomputed constant to save computation time in the recursive function
const cCubedDividedByTwentyFour = C.multipliedBy(C).multipliedBy(C).dividedToIntegerBy(24);

/**
 * Function to compute the value of Pi to a specified number of digits
 * @param {number} digits - The number of digits of Pi to calculate
 * @returns {string} - The calculated value of Pi as a string
 */
const computePI = (digits) => {
    if (digits < 0) {
        return '0';
    }

    const DIGITS = new BigNumber(digits);
    const N = DIGITS.dividedToIntegerBy(DIGITS_PER_TERM).plus(1);
    const PREC = DIGITS.multipliedBy(Math.log2(10));

    BigNumber.config({
        DECIMAL_PLACES: Math.ceil(PREC.toNumber()),
        POW_PRECISION: Math.ceil(PREC.toNumber())
    });

    const PQT = computePQT(new BigNumber(0), N);

    let PI = D.multipliedBy(E.sqrt()).multipliedBy(PQT.Q);
    PI = PI.dividedBy(A.multipliedBy(PQT.Q).plus(PQT.T));

    return PI.toFixed(digits);
};

/**
 * Recursive function to compute P, Q, T values used in the Pi calculation
 * @param {BigNumber} n1 - The start index for the recursive computation
 * @param {BigNumber} n2 - The end index for the recursive computation
 * @returns {Object} - An object containing BigNumber values for P, Q, and T
 */
const computePQT = (n1, n2) => {
    let m = new BigNumber(0);
    const PQT = {
        P: new BigNumber(0),
        Q: new BigNumber(0),
        T: new BigNumber(0)
    };

    if (n1.plus(1).isEqualTo(n2)) {
        // Base case: compute P, Q, T directly
        PQT.P = n2.multipliedBy(2).minus(1);
        PQT.P = PQT.P.multipliedBy(n2.multipliedBy(6).minus(1));
        PQT.P = PQT.P.multipliedBy(n2.multipliedBy(6).minus(5));
        PQT.Q = cCubedDividedByTwentyFour.multipliedBy(n2).multipliedBy(n2).multipliedBy(n2);
        PQT.T = A.plus(B.multipliedBy(n2)).multipliedBy(PQT.P);
        if (n2.modulo(2).isEqualTo(1)) {
            PQT.T = PQT.T.negated();
        }
    } else {
        // Recursive case: break the problem down into smaller parts
        m = n1.plus(n2).dividedToIntegerBy(2);

        const res1 = computePQT(n1, m);
        const res2 = computePQT(m, n2);

        PQT.P = res1.P.multipliedBy(res2.P);
        PQT.Q = res1.Q.multipliedBy(res2.Q);
        PQT.T = res1.T.multipliedBy(res2.Q).plus(res1.P.multipliedBy(res2.T));
    }

    return PQT;
};

// Setting up an event listener for messages from the main thread
if (parentPort) {
    parentPort.on('message', (message) => {
        if (message.type === 'calculatePi') {
            // When a 'calculatePi' message is received, compute Pi and send the result back
            const result = computePI(message.digits);
            parentPort.postMessage({ type: 'result', result });
        }
    });
}

module.exports = computePI;
