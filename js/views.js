import { formatDueDate } from "./helpers.js";

class TodoView {
  // DOM elements
  _taskParentEl = document.querySelector(".task-list");
  _addModalPerentEl = document.querySelector(".modal--add");
  _form = document.querySelector(".modal__body form");
  _AddTaskBtn = document.querySelector(".task-card__add-btn");

  #data;

  render(data) {
    this.#data = data;
    const markup = this.taskHandlerMarkup();
    this._taskParentEl.innerHTML = "";
    this._taskParentEl.insertAdjacentHTML("afterbegin", markup);
  }

  taskHandlerMarkup() {
    return this.#data
      .map((task) => {
        return `
        <li class="task-list__item ${
          task.completed ? "task-list__item--completed" : ""
        }" data-id="${task.id}">
          <div
            class="task-item__checkbox"
            role="checkbox"
            aria-checked="false"
            tabindex="0"
          ></div>
          <div class="task-item__content">
            <p class="task-item__text">
              ${task.taskName}
            </p>
            <div class="task-item__meta">
              <span class="task-item__priority task-item__priority--${
                task.priority
              }"
                >${task.priority}</span
              >
              <time class="task-item__due" datetime="2025-10-08"
                >Due: ${formatDueDate(task.dueDate)}</time
              >
            </div>
          </div>
          <div class="task-item__actions">
            <button class="task-item__btn" aria-label="Edit task">
              Edit
            </button>
            <button
              class="task-item__btn task-item__btn--delete"
              aria-label="Delete task"
            >
              Delete
            </button>
          </div>
        </li>
      `;
      })
      .join("");
  }

  addHandlerAddTask(handler) {
    document.body.addEventListener("click", (e) => {
      const isCancel = e.target.matches(".modal__btn--cancel");
      const isClose = e.target.matches(".modal__close-btn");
      const isOverlay = e.target === this._addModalPerentEl;

      if (isCancel || isClose || isOverlay) {
        this._addModalPerentEl.style.display = "none";
      }

      // When Save button is clicked
      if (e.target.matches(".modal__btn--save")) {
        const validData = this._getFormData();
        if (!validData) return;

        handler(validData);
        this._addModalPerentEl.style.display = "none";
        this.handlerFormReset();
      }
    });
  }

  handlerFormReset() {}

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

    if (taskName === "" && dueDate === "") return;

    return {
      taskName,
      dueDate,
      priority: this._selectedPriority || "medium",
    };
  }

  addHandlerToggle(handler) {
    this._taskParentEl.addEventListener("click", (e) => {
      const item = e.target.closest(".task-list__item");
      if (!item) return;

      // Ignore clicks on Edit/Delete buttons
      if (e.target.closest(".task-item__btn")) return;

      const id = item.dataset.id;
      handler(id);
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
