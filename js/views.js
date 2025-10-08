class TodoView {
  // DOM elements
  _parentEl = document.querySelector(".todo-list");
  _addModalPerentEl = document.querySelector(".modal--add");
  _form = document.querySelector(".modal__body form");
  _AddTaskBtn = document.querySelector(".task-card__add-btn");

  _selectedPriority = "medium";
  render(todos) {
    // this._parentEl.innerHTML = "";
    // todos.forEach((todo) => {
    //   const markup = `
    //     <li class="todo-item ${todo.completed ? "completed" : ""}" data-id="${
    //     todo.id
    //   }">
    //       <div class="checkbox-wrapper">
    //         <div class="checkbox"></div>
    //       </div>
    //       <div class="todo-content">
    //         <div class="todo-text">
    //           Review quarterly business reports and prepare presentation
    //         </div>
    //         <div class="todo-meta">
    //           <span class="priority high">High</span>
    //           <span class="due-date">Due: Today</span>
    //         </div>
    //       </div>
    //       <div class="todo-actions">
    //         <button class="action-btn">Edit</button>
    //         <button class="action-btn delete">Delete</button>
    //       </div>
    //     </li>
    //   `;
    //   this._parentEl.insertAdjacentHTML("beforeend", markup);
    // });
  }

  addHandlerAddTask() {
    this._AddTaskBtn.addEventListener("click", () => {
      this._initPrioritySelector();
      this._addModalPerentEl.style.display = "flex";
    });

    document.body.addEventListener("click", (e) => {
      const isCancel = e.target.matches(".modal__btn--cancel");
      const isClose = e.target.matches(".modal__close-btn");
      const isOverlay = e.target === this._addModalPerentEl;

      if (isCancel || isClose || isOverlay) {
        this._addModalPerentEl.style.display = "none";
      }

      // Save and Close Modal
      if (e.target.matches(".modal__btn--save")) {
        const data = this._getFormData();
        console.log(data);
        this._addModalPerentEl.style.display = "none";
      }
    });
  }

  _initPrioritySelector() {
    const priorityBtn = document.querySelectorAll(".priority-select__btn");

    priorityBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        priorityBtn.forEach((b) =>
          b.classList.remove("priority-select__btn--active")
        );

        btn.classList.add("priority-select__btn--active");

        this._selectedPriority = btn.dataset.priority;
      });
    });
  }

  _getFormData() {
    const taskName = document.querySelector("#addTaskName").value.trim();
    const dueDate = document.querySelector("#addDueDate").value;

    if (!taskName && dueDate) return;

    return {
      taskName,
      dueDate,
      priority: this._selectedPriority,
    };
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
