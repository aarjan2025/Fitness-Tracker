const { Selector, ClientFunction } = require('testcafe');

// Point to your actual index.html path on your Lubuntu machine
// Update the username below if it is different from aarjanp
fixture('Fitness Tracker App Tests')
  .page('file:///home/aarjanp/Desktop/fitness-tracker/Frontend/index.html');

// ─── Test 1: Login screen is visible on load ───────────────────────────────
test('Login screen is displayed on page load', async t => {
  const loginScreen = Selector('#screen-login');
  await t.expect(loginScreen.visible).ok('Login screen should be visible on load');
});

// ─── Test 2: Login with valid credentials navigates to dashboard ───────────
test('Login with valid credentials shows dashboard', async t => {
  const emailInput    = Selector('#inp-email');
  const passwordInput = Selector('#inp-password');
  const loginButton   = Selector('.login-btn');
  const dashboard     = Selector('#screen-dashboard');

  await t
    .typeText(emailInput,    'user@example.com')
    .typeText(passwordInput, 'password123')
    .click(loginButton)
    .expect(dashboard.visible).ok('Dashboard should be visible after login');
});

// ─── Test 3: Login without credentials shows an error message ─────────────
test('Login without credentials shows error message', async t => {
  const loginButton = Selector('.login-btn');
  const errorMsg    = Selector('#login-error');

  await t
    .click(loginButton)
    .expect(errorMsg.innerText).contains('Please enter email and password');
});

// ─── Test 4: Dashboard stat cards are visible ─────────────────────────────
test('Dashboard displays workout and calorie stats', async t => {
  await t
    .typeText(Selector('#inp-email'),    'user@example.com')
    .typeText(Selector('#inp-password'), 'password123')
    .click(Selector('.login-btn'));

  await t
    .expect(Selector('#total-workouts').visible).ok()
    .expect(Selector('#total-calories').visible).ok();
});

// ─── Test 5: Add Workout button opens the add workout screen ──────────────
test('Add Workout button opens the add workout form', async t => {
  await t
    .typeText(Selector('#inp-email'),    'user@example.com')
    .typeText(Selector('#inp-password'), 'password123')
    .click(Selector('.login-btn'))
    .click(Selector('.dash-btn-primary'))
    .expect(Selector('#screen-add').visible).ok('Add workout screen should be visible');
});

// ─── Test 6: Saving a workout with missing fields shows an error ───────────
test('Saving an incomplete workout shows a form error', async t => {
  await t
    .typeText(Selector('#inp-email'),    'user@example.com')
    .typeText(Selector('#inp-password'), 'password123')
    .click(Selector('.login-btn'))
    .click(Selector('.dash-btn-primary'))
    .click(Selector('.save-btn'))
    .expect(Selector('#form-error').innerText).contains('Please fill in all fields correctly');
});

// ─── Test 7: Saving a complete workout navigates to history ────────────────
test('Saving a valid workout navigates to workout history', async t => {
  await t
    .typeText(Selector('#inp-email'),    'user@example.com')
    .typeText(Selector('#inp-password'), 'password123')
    .click(Selector('.login-btn'))
    .click(Selector('.dash-btn-primary'))
    .typeText(Selector('#inp-type'),     'Swimming')
    .typeText(Selector('#inp-duration'), '45')
    .typeText(Selector('#inp-calories'), '400')
    .click(Selector('.save-btn'))
    .expect(Selector('#screen-history').visible).ok('History screen should show after saving');
});

// ─── Test 8: View Workouts button opens workout history ───────────────────
test('View Workouts button opens workout history screen', async t => {
  await t
    .typeText(Selector('#inp-email'),    'user@example.com')
    .typeText(Selector('#inp-password'), 'password123')
    .click(Selector('.login-btn'))
    .click(Selector('.dash-btn-outline'))
    .expect(Selector('#screen-history').visible).ok('History screen should be visible');
});