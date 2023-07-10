## Voting application

This is a software that allows user to make votings in small groups. 

Built on Next.js, Typescript, Tailwind, MongoDB + Mongoose, Redux, Jest.

It utilizes algebraic algorithm to find the best solution that is mathematically justified.

## Features

1. User authentification
2. creating votins, adding objects, adding experts to the voting
3. Ability for the experts to vote for the object in the voting
4. Chart to visualize in real time current expert assessments
5. ability to choose different criterias for the result


## Algebraic algorithm

1. Applying heuristics to reduce amount of the possible winners
2. Create a range n! of possible winners set
3. create a matrix of experts' assessments
4. Apply Cook's distance algorithm to the matrix of assesments and winners

## Classes

OOP principle was used. 3 Main classes to represent Voting, Object and Experts
Voting is the main class where we store objects of the voting, as well as experts.

It has main method vote, where we calculate the result ranging

## Database

Was used NoSQL database MongoDB along with Mongoose ORM.

## Testing

Were written tests in jest for the voting classes and method and for the reducers