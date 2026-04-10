import { Selector } from 'testcafe';
module.exports = {
    pageRequestTimeout: 60000, // Set the timeout to 60 seconds
};

fixture('Fitness Tracker App Test')
    .page('file://home/aarjanp/Desktop/fitness-tracker/frontend/index.html'); // Update the path to your HTML file

// Test Case 1: Check if the login button is working
test('Login Button Test', async t => {
    const emailInput = Selector('#inp-email'); // The email input field
    const passwordInput = Selector('#inp-password'); // The password input field
    const loginButton = Selector('.login-btn'); // The login button

    // Ensure the email input field is visible
    await t.expect(emailInput.visible).ok();

    // Fill in the login form
    await t
        .typeText(emailInput, 'user@example.com') // Enter email
        .typeText(passwordInput, 'password123') // Enter password
        .click(loginButton) // Click the login button
        .expect(Selector('#screen-dashboard').visible).ok(); // Check if dashboard screen is visible
});

// Add other test cases as needed...
