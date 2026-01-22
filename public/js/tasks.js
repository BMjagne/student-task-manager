// API configuration - switches between local and production
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api/tasks' 
    : 'https://student-task-manager-ejnp.onrender.com/api/tasks'; 

// Check if user is logged in, redirect if not
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'index.html'; 
}

document.addEventListener('DOMContentLoaded', () => {

    // Get all the DOM elements we need
    const dashboardSection = document.getElementById('dashboard-section');
    const taskInputSection = document.getElementById('task-input-section');
    
    const taskList = document.getElementById('task-list');
    const showTaskInputLink = document.getElementById('show-task-input');
    const logoutBtn = document.getElementById('logout-btn');

    const taskInputForm = document.getElementById('task-input-form');
    const taskInputHeader = document.getElementById('task-input-header');
    
    const inputTitle = document.getElementById('task-title');
    const inputDesc = document.getElementById('task-desc');
    const inputDate = document.getElementById('task-date');
    const inputPriority = document.getElementById('task-priority');

    // Track which task we're editing (null means we're adding a new one)
    let currentEditTaskId = null; 

    // Switch to dashboard view
    function showDashboard() {
        taskInputSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        fetchTasks();
    }

    // Switch to add/edit form
    function showInputSection(isEditMode = false) {
        dashboardSection.style.display = 'none';
        taskInputSection.style.display = 'block';

        if (isEditMode) {
            taskInputHeader.textContent = "Edit Task";
        } else {
            taskInputHeader.textContent = "New Task";
            taskInputForm.reset();
            currentEditTaskId = null;
        }
    }

    // Get all tasks from the server and display them
    async function fetchTasks() {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            const tasks = await response.json();
            
            taskList.innerHTML = '';

            if (tasks.length === 0) {
                taskList.innerHTML = '<p style="margin-top: 100px; margin-bottom: 100px; font-size: 2rem; text-align: center;">YOU HAVE NO TASKS</p>';
                return;
            }

            // Create a card for each task
            tasks.forEach(task => {
                const card = document.createElement('div');
                card.id = 'task-card';
                card.className = 'card-style';

                const dateObj = new Date(task.dueDate);
                const dateString = dateObj.toLocaleDateString();

                card.innerHTML = `
                    <div class="card-header">
                        <span id="priority-badge" class="badge-${task.priority}">${task.priority}</span>
                        <span id="status-badge" class="${task.status === 'completed' ? 'status-complete' : ''}">${task.status}</span>
                    </div>
                    
                    <h2 class="task-title" style="text-decoration: ${task.status === 'completed' ? 'line-through' : 'none'}">${task.title}</h2>
                    <p id="task-description">${task.description}</p>
                    <p id="task-date"><strong>Due:</strong> ${dateString}</p>

                    <div class="card-actions">
                        <button class="edit-btn">Edit</button>
                        <button class="complete-btn">Complete</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;

                // Wire up the buttons
                card.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task._id));
                card.querySelector('.complete-btn').addEventListener('click', () => completeTask(task, card));
                card.querySelector('.edit-btn').addEventListener('click', () => {
                    prepareEdit(task);
                });

                taskList.appendChild(card);
            });

        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }

    // Handle form submission (works for both adding and editing)
    taskInputForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const taskData = {
            title: inputTitle.value.trim(),
            description: inputDesc.value.trim(),
            dueDate: inputDate.value,
            priority: inputPriority.value, // convert to lowercase to match schema
            status: 'pending'
        };

        try {
            let url = `${API_URL}`;
            let method = 'POST';

            // If editing, use PUT instead of POST
            if (currentEditTaskId) {
                url = `${API_URL}/${currentEditTaskId}`;
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
                showDashboard();
            } else {
                const error = await response.json();
                console.error('Server error:', error);
                alert('Error saving task: ' + (error.message || 'Unknown error'));
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save task. Check console for details.');
        }
    });

    // Delete a task
    async function deleteTask(id) {
        if(!confirm('Are you sure?')) return;

        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    }

    // Mark task as completed
    async function completeTask(task, cardElement) {
        try {
            const response = await fetch(`${API_URL}/${task._id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if(response.ok) {
                // Update the UI without refreshing
                const statusBadge = cardElement.querySelector('#status-badge');
                const title = cardElement.querySelector('.task-title');
                
                statusBadge.textContent = 'Completed';
                statusBadge.className = 'status-complete';
                title.style.textDecoration = 'line-through';
            }

        } catch (error) {
            console.error('Error completing task:', error);
        }
    }

    // Load task data into the form for editing
    function prepareEdit(task) {
        currentEditTaskId = task._id;
        
        inputTitle.value = task.title;
        inputDesc.value = task.description;
        inputPriority.value = task.priority;
        
        // Format date for the input field
        if(task.dueDate) {
            inputDate.value = new Date(task.dueDate).toISOString().split('T')[0];
        }

        showInputSection(true);
    }

    // Navigation handlers
    showTaskInputLink.addEventListener('click', (e) => {
        e.preventDefault();
        showInputSection(false);
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    // Start by showing the dashboard
    showDashboard();
});