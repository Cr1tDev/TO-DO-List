class TodoView {
  _parentEl = document.querySelector(".todo-list");

  render(todos) {
    this._parentEl.innerHTML = "";
    todos.forEach((todo) => {
      const markup = `
        <li class="todo-item ${todo.completed ? "completed" : ""}" data-id="${
        todo.id
      }">
          <div class="checkbox-wrapper">
            <div class="checkbox"></div>
          </div>
          <div class="todo-content">
            <div class="todo-text">
              Review quarterly business reports and prepare presentation
            </div>
            <div class="todo-meta">
              <span class="priority high">High</span>
              <span class="due-date">Due: Today</span>
            </div>
          </div>
          <div class="todo-actions">
            <button class="action-btn">Edit</button>
            <button class="action-btn delete">Delete</button>
          </div>
        </li>
      `;

      this._parentEl.insertAdjacentHTML("beforeend", markup);
    });
  }

  addHandlerToggle(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const item = e.target.closest(".todo-item");
      if (!item) return;
      handler(item.dataset.id);
    });
  }

  addHandlerDelete(handler) {
    this._parentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn-delete")) return;
      const id = e.target.closest(".todo-item").dataset.id;
      handler(id);
    });
  }
}

export default new TodoView();
