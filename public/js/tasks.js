// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000'; 

// 1. AUTHENTICATION CHECK
// Before doing anything, check if the user has a token.
const token = localStorage.getItem('token');

if (!token) {
    // If no token, kick them back to the login page immediately
    window.location.href = 'index.html'; 
}

document.addEventListener('DOMContentLoaded', () => {

    // --- 2. SELECT ELEMENTS ---
    
    // Sections
    const dashboardSection = document.getElementById('dashboard-section');
    const taskInputSection = document.getElementById('task-input-section');
    
    // Dashboard Elements
    const taskList = document.getElementById('task-list');
    const showTaskInputLink = document.getElementById('show-task-input');
    const logoutBtn = document.getElementById('logout-btn');

    // Input Form Elements
    const taskInputForm = document.getElementById('task-input-form');
    const taskInputHeader = document.getElementById('task-input-header');
    
    // Form Inputs
    const inputTitle = document.getElementById('task-title');
    const inputDesc = document.getElementById('task-desc');
    const inputDate = document.getElementById('task-date');
    const inputPriority = document.getElementById('task-priority');

    // STATE VARIABLE
    // We use this to know if we are "Adding" or "Editing"
    let currentEditTaskId = null; 

    // --- 3. HELPER FUNCTIONS (View Switching) ---

    function showDashboard() {
        taskInputSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        fetchTasks(); // Always refresh list when showing dashboard
    }

    function showInputSection(isEditMode = false) {
        dashboardSection.style.display = 'none';
        taskInputSection.style.display = 'block';

        if (isEditMode) {
            taskInputHeader.textContent = "Edit Task";
        } else {
            taskInputHeader.textContent = "New Task";
            taskInputForm.reset(); // Clear form for new entry
            currentEditTaskId = null; // Reset edit ID
        }
    }

    // --- 4. FETCH AND RENDER TASKS ---

    async function fetchTasks() {
        try {
            // We must send the token to the backend to prove who we are
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            const tasks = await response.json();
            
            // Clear current list
            taskList.innerHTML = '';

            if (tasks.length === 0) {
                taskList.innerHTML = '<p>YOU HAVE NO TASKS</p>';
                return;
            }

            // Loop through tasks and create HTML cards
            tasks.forEach(task => {
                const card = document.createElement('div');
                card.id = 'task-card'; // Note: In real apps, prefer classes for multiples
                card.className = 'card-style'; // Add CSS class for styling

                // Format the date to look nice
                const dateObj = new Date(task.dueDate);
                const dateString = dateObj.toLocaleDateString();

                card.innerHTML = `
                    <div class="card-header">
                        <span id="priority-badge" class="badge-${task.priority}">${task.priority}</span>
                        <span id="status-badge" class="${task.status === 'Completed' ? 'status-complete' : ''}">${task.status}</span>
                    </div>
                    
                    <h2 class="task-title" style="text-decoration: ${task.status === 'Completed' ? 'line-through' : 'none'}">${task.title}</h2>
                    <p id="task-description">${task.description}</p>
                    <p id="task-date"><strong>Due:</strong> ${dateString}</p>

                    <div class="card-actions">
                        <button class="edit-btn">Edit</button>
                        <button class="complete-btn">Complete</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;

                // --- ATTACH EVENT LISTENERS TO BUTTONS ---
                
                // DELETE Button
                card.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task._id));

                // COMPLETE Button
                card.querySelector('.complete-btn').addEventListener('click', () => completeTask(task, card));

                // EDIT Button
                card.querySelector('.edit-btn').addEventListener('click', () => {
                    prepareEdit(task);
                });

                taskList.appendChild(card);
            });

        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }

    // --- 5. CORE ACTIONS (Add, Edit, Delete, Complete) ---

    // HANDLE FORM SUBMIT (Create OR Update)
    taskInputForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const taskData = {
            title: inputTitle.value,
            description: inputDesc.value,
            dueDate: inputDate.value,
            priority: inputPriority.value,
            status: 'pending' // Default
        };

        try {
            let url = `${API_URL}/tasks`;
            let method = 'POST';

            // If we are editing, change URL and Method
            if (currentEditTaskId) {
                url = `${API_URL}/tasks/:${currentEditTaskId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                showDashboard(); // Go back to list
            } else {
                alert('Error saving task');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    });

    // DELETE TASK
    async function deleteTask(id) {
        if(!confirm('Are you sure?')) return;

        try {
            await fetch(`${API_URL}/tasks/:${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error('Error deleting:', error);
        }
    }

    // COMPLETE TASK
    async function completeTask(task, cardElement) {
        try {
            const response = await fetch(`${API_URL}/tasks/:${task._id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
               /* body: JSON.stringify({ 
                    status: 'Completed',
                    title: task.title, 
                    description: task.description,
                    priority: task.priority,
                    dueDate: task.dueDate
                })*/
            });

            if(response.ok) {
                // Update UI instantly without reloading
                const statusBadge = cardElement.querySelector('#status-badge');
                const title = cardElement.querySelector('.task-title');
                
                statusBadge.textContent = 'Completed';
                title.style.textDecoration = 'line-through';
            }

        } catch (error) {
            console.error('Error completing task:', error);
        }
    }

    // PREPARE EDIT SCREEN
    function prepareEdit(task) {
        currentEditTaskId = task._id; // Remember which ID we are editing
        
        // Fill the form with existing data
        inputTitle.value = task.title;
        inputDesc.value = task.description;
        inputPriority.value = task.priority;
        
        // Date handling (extract YYYY-MM-DD for input field)
        if(task.dueDate) {
            inputDate.value = new Date(task.dueDate).toISOString().split('T')[0];
        }

        showInputSection(true); // Switch view, passing 'true' for Edit Mode
    }

    // --- 6. NAVIGATION LISTENERS ---

    // Click "Add New Task" link
    showTaskInputLink.addEventListener('click', (e) => {
        e.preventDefault();
        showInputSection(false); // Pass 'false' for New Mode
    });

    // Click Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token'); // Destroy the key
        window.location.href = 'index.html'; // Go home
    });

    // --- INITIAL LOAD ---
    // Start by showing the dashboard
    showDashboard();
});