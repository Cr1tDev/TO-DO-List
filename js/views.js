class TodoView {
  // DOM elements
  _parentEl = document.querySelector(".todo-list");
  _addModalPerentEl = document.querySelector(".modal--add");

  // Buttons
  _AddTaskBtn = document.querySelector(".task-card__add-btn");

  /**
   * Render the todo list items in the DOM
   * @param {Array} todos - List of todo objects
   */
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

  /**
   * Handle Add Task button and modal open/close behavior
   */
  addHandlerAddTask() {
    // 🟢 Open modal when Add Task button is clicked
    this._AddTaskBtn.addEventListener("click", () => {
      this.addHandlerGetTask();
      this._addModalPerentEl.style.display = "flex";
    });

    // 🔵 Close modal when user clicks cancel, close, or outside modal
    document.body.addEventListener("click", (e) => {
      const isCancel = e.target.matches(".modal__btn--cancel");
      const isClose = e.target.matches(".modal__close-btn");
      const isOverlay = e.target === this._addModalPerentEl;

      if (isCancel || isClose || isOverlay) {
        this._addModalPerentEl.style.display = "none";
      }

      // 🟣 Save task and close modal
      if (e.target.matches(".modal__btn--save")) {
        this.addHandlerGetTask();
        this._addModalPerentEl.style.display = "none";
      }
    });
  }

  /**
   * Collects task input data: name, date, and priority
   */
  addHandlerGetTask() {
    const taskName = document.querySelector(".form__input--name");
    const taskDate = document.querySelector(".form__input--date");
    const taskPriority = document.querySelectorAll(".priority--edit");

    let selectedPriority = null;

    // 🟩 Handle selecting a priority
    taskPriority.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();

        // Clear all active priorities
        taskPriority.forEach((b) => b.classList.remove("active"));

        // Set the clicked one as active
        btn.classList.add("active");

        // Save the selected priority
        selectedPriority = e.target.dataset.priority;
        console.log("Selected priority:", selectedPriority);
      });
    });

    // 🟦 Handle save logic
    const saveBtn = document.querySelector(".modal__btn--save");
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const taskData = {
        name: taskName.value.trim(),
        date: taskDate.value,
        priority: selectedPriority,
      };

      console.log("Task Data:", taskData);

      // 🧹 Reset form fields
      taskName.value = "";
      taskDate.value = "";
      taskPriority.forEach((b) => b.classList.remove("active"));
      selectedPriority = null;
    });
  }

  /**
   * Handle toggling completed state
   * @param {Function} handler - callback with todo ID
   */
  addHandlerToggle(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const item = e.target.closest(".todo-item");
      if (!item) return;
      handler(item.dataset.id);
    });
  }

  /**
   * Handle deleting a task
   * @param {Function} handler - callback with todo ID
   */
  addHandlerDelete(handler) {
    this._parentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn-delete")) return;
      const id = e.target.closest(".todo-item").dataset.id;
      handler(id);
    });
  }
}

export default new TodoView();
