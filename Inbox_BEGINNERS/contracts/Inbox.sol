pragma solidity ^0.4.17; //This specifies the version of solidity that our code is written with

contract Inbox { // defines a new contract that will have some number of methods and variables
    
    string public message; //Declares all the instances of variables and their types that will exist in this contract
    
                        // When we define a storage variable that is amrked with the public keyword, the contract 
                        
                        //automatically creates a function for you. That function has the exact same name as the variable.
                        
                        // Thus getMessage() is no necessary here as it is a duplicate of an existing inbuilt function .
    
    function Inbox(string initialMessage) public { // Defines different functions that will be members of this contract
        
        message = initialMessage;
        
    }
    
    function setMessage(string newMessage) public { // Defines different functions that will be members of this contract
        
        message = newMessage;
        
    }
    
}
