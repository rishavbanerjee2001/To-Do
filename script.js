// script.js

// Utility function to generate unique IDs (UUID v4)
function generateUUID() {
  // Simplified UUID generator
  return 'xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// DOM Elements
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
const addButton = document.getElementById("push");

// Initialize tasks array
let tasks = [];

// Function to load tasks from localStorage
function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = storedTasks ? storedTasks : [];
}

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to render tasks to the DOM
function renderTasks() {
  // Show or hide tasks container
  tasksDiv.style.display = tasks.length > 0 ? "block" : "none";

  // Clear current tasks
  tasksDiv.innerHTML = "";

  // Iterate through tasks and create task elements
  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    if (task.completed) {
      taskDiv.classList.add("completed");
    }
    taskDiv.setAttribute("data-id", task.id);

    // Task Name
    const taskNameSpan = document.createElement("span");
    taskNameSpan.classList.add("taskname");
    taskNameSpan.textContent = task.text;
    taskDiv.appendChild(taskNameSpan);

    // Edit Button
    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.title = "Edit Task";
    taskDiv.appendChild(editButton);

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteButton.title = "Delete Task";
    taskDiv.appendChild(deleteButton);

    tasksDiv.appendChild(taskDiv);
  });
}

// Function to add a new task
function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    id: generateUUID(),
    text: taskText,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  newTaskInput.value = "";
}

// Function to delete a task
function deleteTask(id) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

// Function to toggle task completion
function toggleTaskCompletion(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Function to edit a task
function editTask(id) {
  const taskToEdit = tasks.find((task) => task.id === id);
  if (!taskToEdit) return;

  const newText = prompt("Edit your task:", taskToEdit.text);
  if (newText === null) return; // User cancelled the prompt

  const trimmedText = newText.trim();
  if (trimmedText === "") {
    alert("Task cannot be empty.");
    return;
  }

  taskToEdit.text = trimmedText;
  saveTasks();
  renderTasks();
}

// Event Listener for Add Button
addButton.addEventListener("click", addTask);

// Event Listener for Enter Key in Input
newTaskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Event Delegation for Edit and Delete Buttons and Task Completion
tasksDiv.addEventListener("click", (e) => {
  const taskDiv = e.target.closest(".task");
  if (!taskDiv) return; // Clicked outside a task

  const taskId = taskDiv.getAttribute("data-id");

  if (e.target.closest(".edit")) {
    // Edit Task
    editTask(taskId);
  } else if (e.target.closest(".delete")) {
    // Delete Task
    deleteTask(taskId);
  } else {
    // Toggle Completion
    toggleTaskCompletion(taskId);
  }
});

// Initial Load
window.onload = () => {
  loadTasks();
  renderTasks();
};
