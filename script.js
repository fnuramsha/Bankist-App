"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  // movements: [1, 2, 3, 4],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUSD = 1.1;

/////////////////////////////////////////////////
let sorted = false;
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${mov}</div>
</div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
//displayMovements(account1.movements);

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  if (sorted === false) {
    displayMovements(currentAccount.movements, true);
    sorted = true;
  } else {
    displayMovements(currentAccount.movements, false);
    sorted = false;
  }
});

// Calculate and display deposit
const displaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  console.log(`deposit: ${income}`);
  labelSumIn.textContent = `${income}`;
  // Calculate and display withdrawal
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}`;
  // Calculate and display interest
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter(function (dep) {
      return dep > 1;
    })
    .reduce(function (acc, dep) {
      return acc + dep;
    }, 0);
  labelSumInterest.textContent = `${interest}`;
};

//  User computing task

const computingUser = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((newName) => newName[0])
      .join("");
  });
};
computingUser(accounts);
console.log(accounts);

// Calculate balance

const calBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${account.balance} EUR`;
};

const updateUI = function (acc) {
  // Display balance
  calBalance(acc);
  // Display movements
  displayMovements(acc.movements);
  // Display Summary
  displaySummary(acc);
};

// convert euro to USD
const displayEuroToUSD = movements
  .filter((mov) => mov > 0)
  .map(function (mov) {
    return mov * euroToUSD;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(movements);
console.log(displayEuroToUSD);

let currentAccount;

//Implementing login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

// Transfer money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  console.log(amount, reciever);
  inputTransferTo.value = inputTransferAmount.value = "";
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    reciever?.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    console.log(currentAccount.balance);
    currentAccount.movements.push(-amount);
    reciever.movements.push(amount);
    updateUI(currentAccount);
  }
});

// Close the account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log("perfect");
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

// Request loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * amount)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

// flat and flatMap
const overalBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance);

const overalBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);

// sorting
const ascending = movements.sort((a, b) => a - b);
console.log(ascending);

const descending = movements.sort((a, b) => b - a);
console.log(descending);

// mini coding challenges

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => parseInt(el.textContent)
  );
  // console.log(movementsUI.map((el) => Number(el.textContent)));
  console.log(movementsUI);
});

// --------Filter method

// const filteredArray = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(filteredArray);

// ----------Reduce method
// const balance = movements.reduce(function (acc, mov, i, movements) {
//   return acc + mov;
// }, 0);
// console.log(balance);
// ----------- Reduce method using arrow function
// const balance2 = movements.reduce((acc, mov, i, movements) => acc + mov, 0);
// console.log(balance2);

//----------------- Reduce method using for of loop

// let sum = 0;
// for (const mov of movements) sum += mov;
// console.log(sum);

//-------------Reduce method to find out max value
// const max = movements.reduce(function (acc, mov) {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, 200);
// console.log(max);

//---------find method
// const test = accounts.find((account1) => account1.owner === "Jessica");
// console.log(test);
// --------find method using for of loop
// const newFunc = function (accounts) {
//   for (const acc of accounts) {
//     if (acc.owner === "Jessica Davis") {
//       return acc;
//     }
//   }
// };
// const result = newFunc(accounts);
// console.log(result);

// Array methods

const depositSum = accounts
  .flatMap((acc) => acc.movements)

  .filter((mov) => mov > 0)
  .reduce((acc, dep) => acc + dep, 0);

console.log(depositSum);

//I want to count how many deposits in the bank with atleast 1000 euros.
let i = 0;
const numDeposit = accounts
  .flatMap((acc) => acc.movements)
  .forEach((mov) => {
    if (mov >= 1000) {
      i++;
    }
  });
console.log(i);

//  create new object which contains sums of the deposits and of the withdrawals, we need to calculate these sums all
// in the same time, all in one go using reduce

const newObject = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (acc, mov) => {
      mov > 0 ? (acc.deposits = acc.deposits + mov) : (acc.withdrawal += mov);
      return acc;
    },
    { deposits: 0, withdrawal: 0 }
  );
console.log(newObject);

// create new array
const newArray = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (acc, mov) => {
      mov > 0
        ? (acc.arrayDeposits = acc.arrayDeposits + mov)
        : (acc.arrayWithdrawal += mov);
      return acc;
    },
    [arrayDeposits == 0, arrayWithdrawal == 0]
  );
console.log(newArray);

// create a function that converts the string to title case
const convertString = function (string) {
  const exceptions = ["a", "an", "in", "or", "at", "the", "are"];
  const words = string
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");

  return words;
};

console.log(convertString("this is a nice work"));
console.log(convertString("you Are my FRIEND"));
