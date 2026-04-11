// In-memory workout data (replaces broken API fetch calls)
let workouts = [
  { id: 1, type: 'Running',  duration: 30, calories: 200 },
  { id: 2, type: 'GYM',      duration: 45, calories: 350 },
  { id: 3, type: 'Yoga',     duration: 60, calories: 150 },
  { id: 4, type: 'Cycling',  duration: 40, calories: 220 },
  { id: 5, type: 'HIIT',     duration: 20, calories: 230 },
];
let nextId = 6;
let editingId = null;

// Switch between screens
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
  if (screenId === 'screen-dashboard') updateDashboard();
  if (screenId === 'screen-history')   renderHistory();
}

// Login - basic validation only (no real backend needed)
function doLogin() {
  var email    = document.getElementById('inp-email').value.trim();
  var password = document.getElementById('inp-password').value.trim();
  var errEl    = document.getElementById('login-error');

  if (!email || !password) {
    errEl.textContent = 'Please enter email and password.';
    return;
  }
  errEl.textContent = '';
  goTo('screen-dashboard');
}

// Update dashboard stats from in-memory array
function updateDashboard() {
  document.getElementById('total-workouts').textContent = workouts.length;
  var totalCal = workouts.reduce(function(sum, w) { return sum + w.calories; }, 0);
  document.getElementById('total-calories').textContent = totalCal + ' cal';
}

// Open the Add Workout form (blank)
function openAddWorkout() {
  editingId = null;
  document.getElementById('add-screen-title').textContent = 'Add Workout';
  document.getElementById('inp-type').value     = '';
  document.getElementById('inp-duration').value = '';
  document.getElementById('inp-calories').value = '';
  document.getElementById('form-error').textContent = '';
  goTo('screen-add');
}

// Open the Edit Workout form (pre-filled)
function editWorkout(id) {
  var workout = workouts.find(function(w) { return w.id === id; });
  if (!workout) return;

  editingId = id;
  document.getElementById('add-screen-title').textContent = 'Edit Workout';
  document.getElementById('inp-type').value     = workout.type;
  document.getElementById('inp-duration').value = workout.duration;
  document.getElementById('inp-calories').value = workout.calories;
  document.getElementById('form-error').textContent = '';
  goTo('screen-add');
}

// Delete a workout by id
function deleteWorkout(id) {
  workouts = workouts.filter(function(w) { return w.id !== id; });
  renderHistory();
  showToast('Workout deleted!');
}

// Save new or edited workout to in-memory array
function saveWorkout() {
  var type     = document.getElementById('inp-type').value.trim();
  var duration = parseInt(document.getElementById('inp-duration').value, 10);
  var calories = parseInt(document.getElementById('inp-calories').value, 10);
  var errEl    = document.getElementById('form-error');

  if (!type || isNaN(duration) || isNaN(calories) || duration <= 0 || calories <= 0) {
    errEl.textContent = 'Please fill in all fields correctly.';
    return;
  }
  errEl.textContent = '';

  if (editingId !== null) {
    // Update existing workout
    var workout = workouts.find(function(w) { return w.id === editingId; });
    if (workout) {
      workout.type     = type;
      workout.duration = duration;
      workout.calories = calories;
    }
    editingId = null;
    showToast('Workout updated!');
  } else {
    // Add new workout
    workouts.push({ id: nextId++, type: type, duration: duration, calories: calories });
    showToast('Workout saved!');
  }

  goTo('screen-history');
}

// Render workout history list from in-memory array
function renderHistory() {
  var list = document.getElementById('history-list');

  if (workouts.length === 0) {
    list.innerHTML = '<div class="empty-msg">No workouts yet. Add one!</div>';
    return;
  }

  list.innerHTML = workouts.map(function(w) {
    return (
      '<div class="workout-item">' +
        '<div class="workout-info">' +
          '<strong>' + w.type + '</strong><br/>' +
          w.duration + ' min / ' + w.calories + ' cal' +
        '</div>' +
        '<div class="btn-group">' +
          '<button class="btn-edit"   onclick="editWorkout('   + w.id + ')">Edit</button>' +
          '<button class="btn-delete" onclick="deleteWorkout(' + w.id + ')">Delete</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// Show a brief toast notification
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2000);
}

// Initialise dashboard on load
updateDashboard();