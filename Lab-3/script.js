// Select DOM elements
const billTotalInput = document.getElementById("billTotal");
const tipSlider = document.getElementById("tipSlider");
const tipPercentageDisplay = document.getElementById("tipPercentageDisplay");
const currencySelect = document.getElementById("currency");
const tipAmountOutput = document.getElementById("tipAmount");
const totalWithTipOutput = document.getElementById("totalWithTip");
const errorMsg = document.getElementById("errorMsg");

// Conversion rates for different currencies
const conversionRates = {
  USD: 1,
  INR: 84.07,
  JPY: 149.34,
};

// Initialize settings on load
tipSlider.value = 15; // Set default tip percentage to 15%
errorMsg.textContent = ""; // Hide error message initially
updateTipPercentage(); // Display default tip percentage

let billInputTouched = false; // Track if the input has been touched

// Event listeners for input changes
billTotalInput.addEventListener("focus", () => {
  billInputTouched = true; // Mark input as touched on focus
});

billTotalInput.addEventListener("input", () => {
  validateBillInput(); // Validate input on change
  calculateTip(); // Calculate tip on valid input
});

tipSlider.addEventListener("input", () => {
  updateTipPercentage(); // Update displayed tip percentage
  // Only calculate the tip if the bill has been touched
  if (billInputTouched) {
    calculateTip(); // Recalculate tip when slider changes
  } else {
    // Clear output fields if the bill input has not been touched
    tipAmountOutput.value = "";
    totalWithTipOutput.value = "";
  }
});

currencySelect.addEventListener("change", calculateTip); // Recalculate tip when currency changes

// Validate bill total input with regex
function validateBillInput() {
  const validInput = /^[0-9]*\.?[0-9]*$/; // Regex for numbers and a single decimal point
  if (!validInput.test(billTotalInput.value)) {
    billTotalInput.value = billTotalInput.value.slice(0, -1); // Remove last character if invalid
  }

  // If input is empty, reset outputs
  if (billTotalInput.value === "") {
    tipAmountOutput.value = "";
    totalWithTipOutput.value = "";
    errorMsg.textContent = "";
  }
}

// Updates displayed tip percentage
function updateTipPercentage() {
  tipPercentageDisplay.value = `${tipSlider.value}%`;
}

// Validates input and calculates tip amount and total
function calculateTip() {
  const billTotal = parseFloat(billTotalInput.value);
  const tipPercentage = parseFloat(tipSlider.value);
  const currency = currencySelect.value;
  const rate = conversionRates[currency];

  // Validate bill total input only if the input has been touched
  if (billInputTouched && (isNaN(billTotal) || billTotal <= 0)) {
    errorMsg.textContent =
      "Please enter a valid positive number for the bill total.";
    tipAmountOutput.value = "";
    totalWithTipOutput.value = "";
    return;
  } else {
    errorMsg.textContent = ""; // Clear any error messages
  }

  // If bill total is not a valid number, clear outputs
  if (isNaN(billTotal) || billTotal <= 0) {
    tipAmountOutput.value = ""; // Clear tip amount output
    totalWithTipOutput.value = ""; // Clear total amount output
    return; // Exit the function
  }

  // Calculate tip and total with tip
  const tipAmount = (billTotal * tipPercentage) / 100;
  const totalWithTip = billTotal + tipAmount;

  // Convert to selected currency
  const convertedTip = tipAmount * rate;
  const convertedTotal = totalWithTip * rate;

  // Display calculated values with 2 decimal places
  tipAmountOutput.value = `${currencySymbol(currency)}${convertedTip.toFixed(
    2
  )}`;
  totalWithTipOutput.value = `${currencySymbol(
    currency
  )}${convertedTotal.toFixed(2)}`;
}

// Helper function for currency symbols
function currencySymbol(currency) {
  switch (currency) {
    case "USD":
      return "$";
    case "INR":
      return "₹";
    case "JPY":
      return "¥";
    default:
      return "";
  }
}
