const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const error = document.getElementById('error');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

let tasks = [];

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    error.textContent = 'Task cannot be empty!';
    return;
  }
  error.textContent = '';

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(task);
  taskInput.value = '';
  renderTasks();
  updateProgress();
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.contentEditable = true;
    span.addEventListener('blur', () => {
      task.text = span.textContent.trim();
    });

    const buttons = document.createElement('div');

    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.completed ? 'Undo' : 'Done';
    doneBtn.onclick = () => {
      task.completed = !task.completed;
      renderTasks();
      updateProgress();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      renderTasks();
      updateProgress();
    };

    buttons.appendChild(doneBtn);
    buttons.appendChild(delBtn);

    li.appendChild(span);
    li.appendChild(buttons);

    taskList.appendChild(li);
  });
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  progressText.textContent = `${completed} of ${total} tasks completed`;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  progressFill.style.width = percent + '%';

  if (total > 0 && completed === total) {
    fireConfetti();
  }
}

function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 }
  });
}
