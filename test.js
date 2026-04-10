import { Selector } from 'testcafe';

fixture('Fitness Tracker App Test')
    .page('http://localhost:3000'); // If you're running a local server
    
// Test Case 1: Check if the login button is working
test('Login Button Test', async t => {
    const emailInput = Selector('#inp-email'); // The email input field
    const passwordInput = Selector('#inp-password'); // The password input field
    const loginButton = Selector('.login-btn'); // The login button

    // Fill in the login form
    await t
        .typeText(emailInput, 'test@example.com') // Enter email
        .typeText(passwordInput, 'password123') // Enter password
        .click(loginButton) // Click the login button
        .expect(Selector('#screen-dashboard').visible).ok();  // Check if the dashboard screen is visible
});

// Test Case 2: Check if the Add Workout button works
test('Add Workout Button Test', async t => {
    const addWorkoutButton = Selector('.dash-btn-primary');  // The button to add a workout
    
    // Click the Add Workout button
    await t
        .click(addWorkoutButton)  // Click the Add Workout button
        .expect(Selector('#screen-add').visible).ok();  // Check if Add Workout screen is visible
});

// Test Case 3: Check if the "View Workouts" button works
test('View Workouts Button Test', async t => {
    const viewWorkoutsButton = Selector('.dash-btn-outline');  // The button to view workouts
    
    // Click the View Workouts button
    await t
        .click(viewWorkoutsButton)  // Click the View Workouts button
        .expect(Selector('#screen-history').visible).ok();  // Check if Workout History screen is visible
});

// Test Case 4: Check if a workout can be added successfully
test('Add Workout Functionality Test', async t => {
    const addWorkoutButton = Selector('.dash-btn-primary');
    const typeInput = Selector('#inp-type');  // Input for workout type
    const durationInput = Selector('#inp-duration');  // Input for duration
    const caloriesInput = Selector('#inp-calories');  // Input for calories
    const saveButton = Selector('.save-btn');  // Save button for the workout

    // Click to open Add Workout screen
    await t
        .click(addWorkoutButton)
        .typeText(typeInput, 'Running') // Type workout type
        .typeText(durationInput, '30') // Type duration
        .typeText(caloriesInput, '200') // Type calories
        .click(saveButton) // Click the Save button
        .expect(Selector('#screen-history').visible).ok();  // After saving, expect to be taken back to the workout history screen
});

// Test Case 5: Check if the workout history is displaying workouts correctly
test('Workout History Display Test', async t => {
    const historyList = Selector('#history-list'); // The list where workouts are displayed
    
    // Wait for the workout list to be visible
    await t
        .expect(historyList.childElementCount).gt(0)  // Ensure that at least one workout is displayed
        .expect(historyList.innerText).contains('Running');  // Check if the added workout (Running) is displayed
});