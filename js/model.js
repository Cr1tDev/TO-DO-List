export const state = {
  todos: [],
};

export const loadTodos = function () {
  const stored = JSON.parse(localStorage.getItem("todos"));
  if (stored) state.todos = stored;
};

export const saveTodos = function () {
  localStorage.setItem("todos", JSON.stringify(state.todos));
};

export const addTodo = function (todoData) {
  // generate a random id
  const id =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 9).trim();

  const newTodo = {
    ...todoData,
    id: id,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  state.todos.push(newTodo);
  saveTodos();
};

export const toggleTodo = function (id) {
  const todo = state.todos.find((t) => t.id === id);
  if (todo) todo.completed = !todo.completed;
  saveTodos();
};

export const deleteTodo = function (id) {
  state.todos = state.todos.filter((t) => t.id !== id);
  saveTodos();
};

export const updateTodo = function (id, newData) {
  const todo = state.todos.find((t) => t.id === id);

  const { taskName, dueDate, priority } = newData;

  todo.taskName = taskName;
  todo.dueDate = dueDate;
  todo.priority = priority;

  saveTodos();
};

export const getTodoStats = function () {
  const total = state.tasks.length;
  const completed = state.tasks.filter((t) => t.completed).length;
  return { total, completed };
};
