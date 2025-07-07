import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';

// Basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero is not allowed");
    }
    return a / b;
}

const rl = createInterface({
    input: stdin,
    output: stdout
});

console.log("Welcome to Basic Calculator\n");

// State tracking
let state = 'MENU';
let operation = null;
let exitRequested = false;

function showMenu() {
    console.log("\n1. Add");
    console.log("2. Subtract");
    console.log("3. Multiply");
    console.log("4. Divide");
    console.log("5. Exit");
    console.log("Enter choice (1-5):");
}

function handleExit() {
    console.log("\nThank you for using Basic Calculator. Goodbye!");
    rl.close();
    process.exit(0);
}

function handleMenu(choice) {
    try {
        switch (choice) {
            case '1':
                operation = add;
                console.log("\nAddition selected");
                break;
            case '2':
                operation = subtract;
                console.log("\nSubtraction selected");
                break;
            case '3':
                operation = multiply;
                console.log("\nMultiplication selected");
                break;
            case '4':
                operation = divide;
                console.log("\nDivision selected");
                break;
            case '5':
                handleExit();
                return;
            default:
                throw new Error("Invalid choice! Please enter 1-5");
        }
        
        state = 'NUMBERS';
        console.log("Enter two numbers separated by comma (e.g., '5,3'):");
    } catch (error) {
        console.error(`\nError: ${error.message}`);
        showMenu();
    }
}

function handleNumbers(input) {
    try {
        const parts = input.split(',');
        
        if (parts.length !== 2) {
            throw new Error("Please enter exactly two numbers separated by comma");
        }
        
        const a = parseFloat(parts[0]);
        const b = parseFloat(parts[1]);
        
        if (isNaN(a) || isNaN(b)) {
            throw new Error("Both values must be valid numbers");
        }
        
        const result = operation(a, b);
        console.log(`\nResult: ${result}`);
        
    } catch (error) {
        console.error(`\nCalculation Error: ${error.message}`);
    } finally {
        // Reset for next operation
        state = 'MENU';
        operation = null;
        showMenu();
    }
}


rl.on('line', (input) => {
    if (exitRequested) return;
    
    try {
        const trimmedInput = input.trim();
        
        switch (state) {
            case 'MENU':
                handleMenu(trimmedInput);
                break;
            case 'NUMBERS':
                handleNumbers(trimmedInput);
                break;
        }
    } catch (error) {
        console.error(`\nUnexpected Error: ${error.message}`);
        console.log("Restarting calculator...");
        state = 'MENU';
        operation = null;
        showMenu();
    }
});

// Handle graceful shutdown
rl.on('close', () => {
    if (!exitRequested) {
        console.log("\nCalculator session ended unexpectedly");
        process.exit(1);
    }
});

process.on('SIGINT', () => {
    exitRequested = true;
    handleExit();
});

// Start the calculator
showMenu();