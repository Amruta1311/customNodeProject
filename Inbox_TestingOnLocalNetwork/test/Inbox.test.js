const assert = require('assert');  //used to make the assertions for the test 
                                    // that some value is equal to the other value

const ganache = require('ganache-cli');  // This is going to be served as the local 
                                            // ethereum test network

const Web3 = require('web3'); // Web3 is uppercase since whenever we use it, 
                              // we are going to require a constructor function, 
                              // so Web3 is a constructor and it will be used to 
                              // create instances of Web3 library

// By convention we assign the instance as lowercase for the constructor Web3

// Web3 is used as an absolute channel for communicating between the javascript 
// and the ethereum network

const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

// The above creates an instance of Web3 and tells that instance to attempt to connect 
// to this local test network that we are hosting on our machine solely for the purpose 
// of running these tests in the future. 

/*                                    //Mocha is a test running framework. We use mocha to test any type of javascript code that we want.
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

*/


// We make access to Web3 and use it retrieve a list of accounts that are automatically 
//created for us using the local ganache network.
// WE CAN ONLY DEPLOY A CONTRACT WHEN WE HAVE ACCESS TO AN ACCOUNT

let accounts;

let inbox;

const INITIAL_STRING = 'Hello!';

beforeEach( async () => {
    // Get a list of all accounts
    //(Every function call tied to web3 is going to return a promise. 
    // There is a better syntax call async which can be used instead to clean up the code.)
            // web3.eth.getAccounts().then(fetchedAccounts => {
            //         console.log(fetchedAccounts);
            //     });

    //Async Wait
    accounts = await web3.eth.getAccounts();  //----(1)

    // Use one of those accounts to deploy the contract
    //To deploy the contract we need access to the contracts bytecode 
    // that has been produced in our computer by compile.js file

    //In the deploy part, whenever we create new instance of the contract, 
    // we have to pass in some initial message to it. 

    // Creating and deploying the contract is an asynchronous operation 
    // and it will take some time to complete. So we add in the await keyword.
    inbox = await new web3.eth.Contract(JSON.parse(interface))  //[Teaches Web3 about what methods an Inbox contract has] Here web3 library accesses the ethereum module and in particular, the contract property. COntract here is a constructor function and it intends to allow us to either interact with existing contracts that exist on the blockchain already or to create and deploy new contracts. The first arguement to the contract constructor is our ABI. The ABI is how we get some intermediation or conversion or interface between the solidity world and the javascript world. We do JSON parsing to get our javascript object. We do this since we want to pass an actual javascript object.
      .deploy({ data: bytecode, arguments: [INITIAL_STRING] })  //[Tells Web3 that we want to deploy a new copy of this contract] we tell web3 that we want to deploy a new contract. This creates a transaction object with the data property( containing the compiled bytecode of the contract ) and the arguements property ( contains the list of arguments to pass into the constructor function of the contract ). Calling deploy doesn't actually deploy anything. It more specifically starts to create an object that can later be deployed into the network. It is the 'send' method that actually triggers the communication from web3 off to the network.
      .send({ from: accounts[0], gas: '1000000' })      //[Instructs Web3 to send out a transaction that creates this contract] The first argument is the person or the account that is being used to create the contract.    
      //'send' specifies the contract that we want to deploy the account from.
      // anytime we want to modify the blockchain, we will have to spend some amount of gas


});

describe('Inbox', () => {
        it('deploys a contract', () => {
            //  console.log(inbox);
            assert.ok(inbox.options.address);  // ok method makes an assertion that whatever we are passing into the function is a value tha exists. It ensures that inbox is successfully deployed by checking if there is an address the object contains on the network.
        });

        it('has a default message', async () => {  //Calling a method is relatiely instantaneous. It is still asynchronous.
           
            const message = await inbox.methods.message().call();  // Inbox is the instance of 
            // the contract we make reference to. Our contract has a property called 'methods' which 
            // is an object containing all of the different public functions (in our case, message() 
            // and setmessage() properties) that exist in our contract. The message() property has 
            //parenthesis so as t pass arguments through them. message property does not require any.
            // If it were setMEssage() then we would definitely have to pass arguments through it.
            // The call() parenthesis are used to customize the transaction that we are attempting 
            // to send out to the network. In our case, we are calling the function so no arguements
            // are needed to pass here(cannot modify the contracts data, can return data, runs instantly 
            // & free to do without costing any money). Had we been sending a transaction to a function, we would 
            // have to pass in an object that specifies exactly who is going to pay for this transaction
            // and how much gas to use (using the .send() instead of .call()). Sending a transaction means modifying a contract's data. 
            // So it takes longer time to execute, returns the transaction hash and costs money!
            

            // When we first initialized our contract, we gave 'Hello!' as the initial message of the 
            // string. So when we access the message using the call function, it should be the same string as initialised.

            assert.equal(message, INITIAL_STRING);

        });


        it('can change the message', async () => {
            await inbox.methods.setMessage('Bye').send({ from: accounts[0] });    
            // The above is from (1), we take the first address out there and have that person pay for sending 
            // this change into the network.
            // Here we do not assign the transaction to a variable since a transaction has is return which 
            // may be seen as a transaction reciept of the process carried out. So we can just assume the transaction took place successfully.
            // If the transaction did not occur successfully, then we are thrown up with an error that causes the entire test to fail.
        
            
            const message = await inbox.methods.message().call();

            assert.equal(message, 'Bye');
             
        });

});
