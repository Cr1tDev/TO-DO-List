import { formatDueDate } from "./helpers.js";

class TodoView {
  // DOM elements
  _taskParentEl = document.querySelector(".task-list");
  _addModalPerentEl = document.querySelector(".modal--add");
  _editModalPerentEl = document.querySelector(".modal--edit");
  _form = document.querySelector(".modal__body form");
  _AddTaskBtn = document.querySelector(".task-card__add-btn");

  #addTaskNameEl = document.querySelector("#addTaskName");
  #addDueDateEl = document.querySelector("#addDueDate");
  #editTaskNameEl = document.querySelector("#editTaskText");
  #editDueDateEl = document.querySelector("#editDueDate");
  #priorityBtn = document.querySelectorAll(".priority-select__btn");

  _footerCount = document.querySelector(".footer__count");

  #selectedPriority = "";
  #data;

  render(data) {
    this.#data = data;
    this.#handlertaskCount();
    const markup = this.taskHandlerMarkup();
    this._taskParentEl.innerHTML = "";
    this._taskParentEl.insertAdjacentHTML("beforeend", markup);
  }

  #handlertaskCount() {
    this._footerCount.textContent = `${this.#data.length} task remaining`;
  }

  taskHandlerMarkup() {
    return this.#data
      .map((task) => {
        return `
        <li class="task-list__item task-list__item--${
          task.completed ? "completed" : ""
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
            <button class="task-item__btn task-item__btn--edit">
              Edit
            </button>
            <button
              class="task-item__btn task-item__btn--delete"
            >
              Delete
            </button>
          </div>
        </li>
      `;
      })
      .reverse()
      .join("");
  }

  addHandlerAddTask(handler) {
    document.body.addEventListener("click", (e) => {
      const isCancel = e.target.matches(".modal__btn--cancel");
      const isClose = e.target.matches(".modal__close-btn");

      if (isCancel || isClose) {
        this._addModalPerentEl.style.display = "none";
      }

      // When Save button is clicked
      if (e.target.matches(".modal__btn--save")) {
        const validData = this._getFormData();
        if (!validData) return;

        handler(validData);
        this._addModalPerentEl.style.display = "none";
        this.#addTaskNameEl.value = this.#addDueDateEl.value = "";
      }
    });
  }

  _initPrioritySelector() {
    this.#priorityBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.#priorityBtn.forEach((b) =>
          b.classList.remove("priority-select__btn--active")
        );

        btn.classList.add("priority-select__btn--active");

        this.#selectedPriority = btn.dataset.priority;
      });
    });
  }

  _getFormData() {
    const inputTaskName = this.#addTaskNameEl.value.trim();
    const inputDueDate = this.#addDueDateEl.value;

    if (inputTaskName === "") return;

    return {
      taskName: inputTaskName,
      dueDate: inputDueDate,
      priority: this.#selectedPriority || "medium",
    };
  }

  addHandlerToggle(handler) {
    this._taskParentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("task-item__checkbox")) return;
      const item = e.target.closest(".task-list__item");
      if (!item) return;

      const id = item.dataset.id;
      handler(id);
    });
  }

  addHandlerEdit(handler) {
    this._taskParentEl.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".task-item__btn--edit");
      if (!editBtn) return;

      // Get ID of the task being edited
      const taskItem = editBtn.closest(".task-list__item");
      const id = taskItem.dataset.id;

      if (taskItem.classList.contains("task-list__item--completed")) return;

      // Open edit modal
      const editModal = document.querySelector(".modal--edit");
      editModal.style.display = "flex";

      // Pre-fill form values if needed later
      this._fillEditForm(id);

      editModal.onclick = (event) => {
        if (
          event.target.matches(".modal__btn--cancel") ||
          event.target.matches(".modal__close-btn")
        ) {
          editModal.style.display = "none";
        }

        // Save changes
        if (event.target.matches(".modal__btn--save")) {
          const updatedData = this._getEditFormData();
          if (this.#validityCheck(updatedData, id)) return;
          handler(id, updatedData);
          editModal.style.display = "none";
        }
      };
    });
  }

  #validityCheck(updatedData, id) {
    const curData = this.#data.find((t) => t.id === id);
    if (!curData) return false;

    const { taskName, dueDate, priority } = curData;
    return (
      updatedData.taskName === taskName &&
      updatedData.dueDate === dueDate &&
      updatedData.priority === priority
    );
  }

  _fillEditForm(id) {
    const task = this.#data.find((t) => t.id === id);

    const ACTIVE_CLASS = "priority-select__btn--active";

    this.#editTaskNameEl.value = task.taskName;
    this.#editDueDateEl.value = task.dueDate;

    this.#priorityBtn.forEach((btn) => {
      btn.classList.remove(ACTIVE_CLASS);
    });

    this.#priorityBtn.forEach((btn) => {
      if (btn.dataset.priority === task.priority) {
        btn.classList.add(ACTIVE_CLASS);
      }
    });

    this.#priorityBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.#priorityBtn.forEach((b) => b.classList.remove(ACTIVE_CLASS));

        btn.classList.add(ACTIVE_CLASS);
      });
    });
  }

  _getEditFormData() {
    return {
      taskName: this.#editTaskNameEl.value.trim(),
      dueDate: this.#editDueDateEl.value,
      priority: document.querySelector(".priority-select__btn--active").dataset
        .priority,
    };
  }

  addHandlerDelete(handler) {
    this._taskParentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("task-item__btn--delete")) return;
      const item = e.target.closest(".task-list__item");
      if (!item) return;

      const id = item.dataset.id;
      handler(id);
    });
  }
}

export default new TodoView();
