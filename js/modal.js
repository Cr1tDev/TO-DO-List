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

export const addTodo = function (text) {
  const newTodo = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
    taskName: text,
    completed: false,
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
