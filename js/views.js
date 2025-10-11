import { formatDueDate } from "./helpers.js";

class TodoView {
  // DOM elements
  _taskParentEl = document.querySelector(".task-list");
  _addModalPerentEl = document.querySelector(".modal--add");
  _editModalPerentEl = document.querySelector(".modal--edit");
  _AddTaskBtn = document.querySelector(".task-card__add-btn");
  _navFilter = document.querySelector(".filters");

  // Add modal inputs
  #addTaskNameEl = document.querySelector("#addTaskName");
  #addDueDateEl = document.querySelector("#addDueDate");

  // Edit modal inputs (these exist in DOM)
  #editTaskNameEl = document.querySelector("#editTaskText");
  #editDueDateEl = document.querySelector("#editDueDate");

  // Note: priority buttons inside modals will be handled via delegation
  _footerCount = document.querySelector(".footer__count");

  #selectedPriority = ""; // for Add modal
  #data;

  // Flags to prevent attaching duplicate listeners
  _addModalListenersAttached = false;
  _editModalListenersAttached = false;

  render(data) {
    this.#data = data;
    this.#handlertaskCount();
    const markup = this.taskHandlerMarkup();
    this._taskParentEl.innerHTML = "";
    this._taskParentEl.insertAdjacentHTML("beforeend", markup);
  }

  #handlertaskCount() {
    // show count of currently rendered items (filtered view)
    this._footerCount.textContent = `${this.#data.length} task${
      this.#data.length === 1 ? "" : "s"
    } remaining`;
  }

  // -------------------------
  // Filters (delegation)
  addHandlerFilter(handler) {
    this._navFilter.addEventListener("click", (e) => {
      const btn = e.target.closest(".filters__btn");
      if (!btn) return;

      document
        .querySelectorAll(".filters__btn")
        .forEach((b) => b.classList.remove("filters__btn--active"));
      btn.classList.add("filters__btn--active");

      const filterType = btn.dataset.filter;
      handler(filterType);
    });
  }

  // -------------------------
  // Task markup
  taskHandlerMarkup() {
    return this.#data
      .map((task) => {
        return `
        <li class="task-list__item ${
          task.completed ? "task-list__item--completed" : ""
        }" data-id="${task.id}">
          <div class="task-item__checkbox" role="checkbox" aria-checked="${
            task.completed ? "true" : "false"
          }" tabindex="0"></div>
          <div class="task-item__content">
            <p class="task-item__text">${task.taskName}</p>
            <div class="task-item__meta">
              <span class="task-item__priority task-item__priority--${
                task.priority
              }">${task.priority}</span>
              <time class="task-item__due" datetime="${
                task.dueDate || ""
              }">Due: ${formatDueDate(task.dueDate)}</time>
            </div>
          </div>
          <div class="task-item__actions">
            <button class="task-item__btn task-item__btn--edit">Edit</button>
            <button class="task-item__btn task-item__btn--delete">Delete</button>
          </div>
        </li>
      `;
      })
      .reverse()
      .join("");
  }

  // -------------------------
  // ADD modal: attach single click handler for save/cancel and priority delegation
  addHandlerAddTask(handler) {
    if (this._addModalListenersAttached) return; // attach only once
    this._addModalListenersAttached = true;

    const addModal = this._addModalPerentEl;

    // Priority delegation inside Add modal
    addModal.addEventListener("click", (e) => {
      const priorityBtn = e.target.closest(".priority-select__btn");
      if (!priorityBtn) return;
      // Only affect buttons inside add modal
      const btns = addModal.querySelectorAll(".priority-select__btn");
      btns.forEach((b) => b.classList.remove("priority-select__btn--active"));
      priorityBtn.classList.add("priority-select__btn--active");
      this.#selectedPriority = priorityBtn.dataset.priority;
    });

    // Handle Cancel / Close and Save in add modal
    addModal.addEventListener("click", (e) => {
      if (
        e.target.matches(".modal__btn--cancel") ||
        e.target.matches(".modal__close-btn") ||
        e.target === addModal
      ) {
        addModal.style.display = "none";
        this._resetAddForm();
      }

      if (e.target.matches(".modal__btn--save")) {
        const validData = this._getFormData();
        if (!validData) return;
        handler(validData);
        addModal.style.display = "none";
        this._resetAddForm();
      }
    });
  }

  _resetAddForm() {
    this.#addTaskNameEl.value = "";
    this.#addDueDateEl.value = "";
    this.#selectedPriority = "";
    const btns = this._addModalPerentEl.querySelectorAll(
      ".priority-select__btn"
    );
    btns.forEach((b) => b.classList.remove("priority-select__btn--active"));
  }

  _initPrioritySelector() {
    // kept for backward compatibility — still idempotent
    // No-op here because addHandlerAddTask attaches delegation on modal
    return;
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

  // -------------------------
  // Toggle (checkbox) - delegation on task list
  addHandlerToggle(handler) {
    this._taskParentEl.addEventListener("click", (e) => {
      if (!e.target.classList.contains("task-item__checkbox")) return;
      const item = e.target.closest(".task-list__item");
      if (!item) return;
      const id = item.dataset.id;
      handler(id);
    });
  }

  // -------------------------
  // Edit: accepts a handler and a fullDataGetter function so view can find any task
  addHandlerEdit(handler, fullDataGetter = null) {
    if (this._editModalListenersAttached) {
      // Attach only the task-list click handler once (but still safe to reattach since we guard below)
      // We still need to attach the click handler for edit buttons; do here (idempotent)
    }

    this._taskParentEl.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".task-item__btn--edit");
      if (!editBtn) return;

      const taskItem = editBtn.closest(".task-list__item");
      const id = taskItem.dataset.id;

      if (taskItem.classList.contains("task-list__item--completed")) return;

      const editModal = this._editModalPerentEl;
      editModal.style.display = "flex";

      // Get the task from full data if provided, otherwise the current rendered data
      const fullData =
        typeof fullDataGetter === "function" ? fullDataGetter() : this.#data;
      const task = fullData.find((t) => t.id === id);
      if (!task) {
        // Safety: close modal if task not found
        editModal.style.display = "none";
        return;
      }

      // Fill form with the task object
      this._fillEditForm(task);

      // Attach modal-level listeners once (save/cancel + priority delegation)
      if (!this._editModalListenersAttached) {
        this._attachEditModalListeners(handler);
        this._editModalListenersAttached = true;
      }

      // store the current editing id on modal for save reference
      editModal.dataset.editingId = id;
    });
  }

  _attachEditModalListeners(handler) {
    const editModal = this._editModalPerentEl;

    // Priority selector (delegation inside edit modal)
    editModal.addEventListener("click", (e) => {
      const priorityBtn = e.target.closest(".priority-edit__btn");
      if (!priorityBtn) return;
      const btns = editModal.querySelectorAll(".priority-edit__btn");
      btns.forEach((b) => b.classList.remove("priority-select__btn--active"));
      priorityBtn.classList.add("priority-select__btn--active");
    });

    // Cancel / Close / Save actions
    editModal.addEventListener("click", (e) => {
      if (
        e.target.matches(".modal__btn--cancel") ||
        e.target.matches(".modal__close-btn") ||
        e.target === editModal
      ) {
        editModal.style.display = "none";
        // cleanup dataset
        delete editModal.dataset.editingId;
      }

      if (e.target.matches(".modal__btn--save")) {
        const id = editModal.dataset.editingId;
        if (!id) {
          editModal.style.display = "none";
          return;
        }
        const updatedData = this._getEditFormData();
        handler(id, updatedData);
        editModal.style.display = "none";
        delete editModal.dataset.editingId;
      }
    });
  }

  // _fillEditForm now receives a task object
  _fillEditForm(task) {
    const ACTIVE_CLASS = "priority-select__btn--active";

    this.#editTaskNameEl.value = task.taskName || "";
    this.#editDueDateEl.value = task.dueDate || "";

    // find edit-priority buttons inside edit modal
    const editBtns = this._editModalPerentEl.querySelectorAll(
      ".priority-edit__btn"
    );

    editBtns.forEach((btn) => btn.classList.remove(ACTIVE_CLASS));

    const match = Array.from(editBtns).find(
      (btn) => btn.dataset.priority === task.priority
    );
    if (match) match.classList.add(ACTIVE_CLASS);
  }

  _getEditFormData() {
    const editModal = this._editModalPerentEl;
    const taskName = this.#editTaskNameEl.value.trim();
    const dueDate = this.#editDueDateEl.value;
    const priorityBtn = editModal.querySelector(
      ".priority-select__btn--active"
    );
    const priority = priorityBtn ? priorityBtn.dataset.priority : "medium";
    return { taskName, dueDate, priority };
  }

  // -------------------------
  // Delete handler
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
