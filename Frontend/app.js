let workouts = [
    { id: 1, type: 'Running',  duration: 30, calories: 200 },
    { id: 2, type: 'GYM',      duration: 45, calories: 350 },
    { id: 3, type: 'Yoga',     duration: 60, calories: 150 },
    { id: 4, type: 'Cycling',  duration: 40, calories: 220 },
    { id: 5, type: 'HIIT',     duration: 20, calories: 230 },
  ];
  let nextId = 6; // Keep for local purposes (if required)
let editingId = null;

// Function to switch between screens
function goTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if (screenId === 'screen-dashboard') updateDashboard();
    if (screenId === 'screen-history') renderHistory();
}

// Login function (simulating login)
function doLogin() {
    const email = document.getElementById('inp-email').value.trim();
    const password = document.getElementById('inp-password').value.trim();
    const errEl = document.getElementById('login-error');
    if (!email || !password) {
        errEl.textContent = 'Please enter email and password.';
        return;
    }
    errEl.textContent = '';
    goTo('screen-dashboard');
}

// Fetch workout data from API and update the dashboard
function updateDashboard() {
    fetch('http://localhost:3000/workouts')
        .then(res => res.json())
        .then(data => {
            document.getElementById('total-workouts').textContent = data.length;
            const totalCal = data.reduce((s, w) => s + w.calories, 0);
            document.getElementById('total-calories').textContent = totalCal + ' cal';
        })
        .catch(err => console.error('Error fetching workouts:', err));
}

// Open the Add Workout screen
function openAddWorkout() {
    editingId = null;
    document.getElementById('add-screen-title').textContent = 'Add Workout';
    document.getElementById('inp-type').value = '';
    document.getElementById('inp-duration').value = '';
    document.getElementById('inp-calories').value = '';
    document.getElementById('form-error').textContent = '';
    goTo('screen-add');
}

// Edit a workout by its ID
function editWorkout(id) {
    fetch(`http://localhost:3000/workouts/${id}`)
        .then(res => res.json())
        .then(data => {
            editingId = id;
            document.getElementById('add-screen-title').textContent = 'Edit Workout';
            document.getElementById('inp-type').value = data.type;
            document.getElementById('inp-duration').value = data.duration;
            document.getElementById('inp-calories').value = data.calories;
            document.getElementById('form-error').textContent = '';
            goTo('screen-add');
        })
        .catch(err => console.error('Error fetching workout:', err));
}

// Save a new or edited workout
function saveWorkout() {
    const type = document.getElementById('inp-type').value.trim();
    const duration = parseInt(document.getElementById('inp-duration').value);
    const calories = parseInt(document.getElementById('inp-calories').value);
    const errEl = document.getElementById('form-error');

    if (!type || isNaN(duration) || isNaN(calories) || duration <= 0 || calories <= 0) {
        errEl.textContent = 'Please fill in all fields correctly.';
        return;
    }
    errEl.textContent = '';

    // If editing, update the workout via PUT API
    if (editingId !== null) {
        fetch(`http://localhost:3000/workouts/${editingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, duration, calories })
        })
            .then(() => {
                showToast('Workout updated!');
                goTo('screen-history');
            })
            .catch(err => console.error('Error updating workout:', err));
    } else {
        // If adding, create a new workout via POST API
        fetch('http://localhost:3000/workouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, duration, calories })
        })
            .then(() => {
                showToast('Workout saved!');
                goTo('screen-history');
            })
            .catch(err => console.error('Error adding workout:', err));
    }
}

// Delete a workout by its ID
function deleteWorkout(id) {
    fetch(`http://localhost:3000/workouts/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            showToast('Workout deleted!');
            renderHistory();
            updateDashboard();
        })
        .catch(err => console.error('Error deleting workout:', err));
}

// Render workout history from API
function renderHistory() {
    const list = document.getElementById('history-list');
    fetch('http://localhost:3000/workouts')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                list.innerHTML = '<div class="empty-msg">No workouts yet. Add one!</div>';
                return;
            }
            list.innerHTML = data.map(w => `
                <div class="workout-item">
                    <div class="workout-info">
                        <strong>${w.type}:</strong><br/>
                        ${w.duration} min / ${w.calories} cal
                    </div>
                    <div class="btn-group">
                        <button class="btn-edit" onclick="editWorkout(${w.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteWorkout(${w.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        })
        .catch(err => console.error('Error fetching workouts history:', err));
}

// Show toast notifications
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

// Initialize the dashboard
updateDashboard();