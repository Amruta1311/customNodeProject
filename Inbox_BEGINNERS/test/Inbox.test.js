const assert = require('assert');  //used to make the assertions for the test that some value 
                                   // is equal to the other value

const ganache = require('ganache-cli');  // This is going to be served as the local ethereum test network

const Web3 = require('web3'); // Web3 is uppercase since whenever we use it, 
                              // we are going to require a constructor function, so Web3 is a constructor 
                              // and it will be used to create instances of Web3 library

// By convention we assign the instance as lowercase for the constructor Web3

// Web3 is used as an absolute channel for communicating between the javascript and the ethereum network

const web3 = new Web3(ganache.provider());

// The above creates an instance of Web3 and tells that instance to attempt to connect to this local
// test network that we are hosting on our machine solely for the purpose of running these tests in the future. 

//Mocha is a test running framework. We use mocha to test any type of javascript code that we want.
// A general purpose testing framework that can be used for frontend, backend or ethereum development.


class Car {
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

// beforeEach is used to execute some general code set up that is common to many tests inside of our test file
// Any logic present in beforeEach is executed before each of the it statements below.

let car;

beforeEach(() => {
    // Variable car has scope only within beforeEach and needs access in the it statements
    // const car = new Car();

    // The below is a solution to the above statement
    car = new Car();
});

describe('Car', () => { 
   // This function contains all the IT test staements that we write to do the required testing for the Car class
    it('can park', () => {
        // Here we write our actual test setup and assertion logic

        assert.equal(car.park(), 'stopped'); // check test by running 'npm run test' on terminal

        // If the two values of the above arguement are equal then our test passes and if they are not equal then our test fails.

    });

    it('can drive', () => {

        assert.equal(car.drive(), 'vroom');
    });

});  // Describe is used to group together certain tests that are all testing the same subjecc or the same thing
                  // There is no intrinsic link between Car class and the 'Car' string arguement that we have passed
                