import "./styles.css";
import { logic } from "./logic.js"


const dom = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
    },
    cacheDom: function() {
        this.addTaskButton = document.querySelector(".add-todo");
        this.currentProject = document.querySelector(".current-project");
        this.todoContainer = document.querySelector(".todo-container");
        
        // Task Modal
        this.taskModal = document.querySelector(".task-modal");
            this.taskForm = this.taskModal.querySelector(".task-form");
            this.closeTaskModalButton = this.taskModal.querySelector(".close-task-modal");
            this.submitNewTaskButton = this.taskModal.querySelector(".submit-new-task");
            // task form value accessors
            this.taskFormTitle = this.taskModal.querySelector("#form-title");
            this.taskFormDescription = this.taskModal.querySelector("#form-desc");
            this.taskFormDueDate = this.taskModal.querySelector("#form-due-date");
            this.taskFormPriority = this.taskModal.querySelector("#form-priority");

        //Edit Modal
        this.editModal = document.querySelector(".edit-modal");
            this.editForm = this.editModal.querySelector(".edit-form");
            this.closeEditModalButton = this.editModal.querySelector(".close-edit-modal");
            this.submitEditTaskButton = this.editModal.querySelector(".submit-edit-task");
            // edit form value accessors
            this.editFormTitle = this.editModal.querySelector("#edit-title");
            this.editFormDescription = this.editModal.querySelector("#edit-desc");
            this.editFormDueDate = this.editModal.querySelector("#edit-due-date");
            this.editFormPriority = this.editModal.querySelector("#edit-priority");
        
        // Project Modal
        this.projectModal = document.querySelector(".add-project-modal");
            this.projectForm = this.projectModal.querySelector(".add-project-form");
            this.closeProjectModalButton = this.projectModal.querySelector(".close-add-project-modal");
            this.submitAddProjectButton = this.projectModal.querySelector(".submit-add-project");
            // project form value accessor
            this.projectTitle = this.projectModal.querySelector("#project-title");
        
        this.svgUnchecked = `<svg data-value="checkbox" id="icon-unchecked-box" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-blank-outline</title><path data-value="checkbox" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" /></svg>`;
        this.svgChecked = `<svg data-value="checkbox" id="icon-checked-box" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>checkbox-outline</title><path data-value="checkbox" d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,5V19H5V5H19M10,17L6,13L7.41,11.58L10,14.17L16.59,7.58L18,9" /></svg>`;
        this.projectDeleteSvg = `<svg data-value="delete-project" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>`
        
        this.sidebar = document.querySelector(".sidebar");
        this.completed = this.sidebar.querySelector("#completed");
        this.inbox = this.sidebar.querySelector("#default");
        this.addProject = this.sidebar.querySelector("#add-project");
    
    },
    bindEvents: function() {
        this.addTaskButton.addEventListener("click", () => this.taskModal.showModal());
        this.closeTaskModalButton.addEventListener("click", () => this.taskModal.close());
        this.taskForm.addEventListener("submit", (e) => this.handleTaskSubmit(e));
        this.todoContainer.addEventListener("click", (e) => this.handleContainerClick(e));
        this.closeEditModalButton.addEventListener("click", () => this.editModal.close());
        this.editForm.addEventListener("submit", (e) => this.handleEditSubmit(e));
        this.completed.addEventListener("click", () => this.changeProject("completed"));
        this.inbox.addEventListener("click", () => this.changeProject("default"));
        this.addProject.addEventListener("click", () => this.projectModal.showModal());
        this.projectForm.addEventListener("submit", (e) => this.handleProjectSubmit(e));
        this.closeProjectModalButton.addEventListener("click", () => this.projectModal.close());
        this.projectTitle.addEventListener("input", () => this.projectTitle.setCustomValidity(''));
        
    },
    handleProjectSubmit: function(e) {
        e.preventDefault();
        const newProject = this.projectTitle.value;
        const formattedProject = newProject.toLowerCase().split(" ").join("-");
        const reservedNames = ['inbox', 'default', 'completed'];

        // Custom Validity Checks
        this.projectTitle.setCustomValidity('');

        if (!newProject) {
          this.projectTitle.setCustomValidity("Please enter a project name.");
        } else if (logic.projects[newProject]) {
          this.projectTitle.setCustomValidity("Project already exists.");
        } else if (reservedNames.includes(newProject.toLowerCase())) {
          this.projectTitle.setCustomValidity(`"${newProject}" is a reserved name.`);
        }

        if (!this.projectTitle.checkValidity()) {
          this.projectTitle.reportValidity();
          return;
        }

        this.projectTitle.value = "";
        logic.createProject(formattedProject);

        // create project row elements
        const newProjectDiv = document.createElement("div");
        newProjectDiv.classList.add("project-row");
        newProjectDiv.setAttribute("data-project-name", formattedProject);
        newProjectDiv.innerHTML = this.projectDeleteSvg;

        const newProjectButton = document.createElement("li");
        newProjectButton.setAttribute("data-project-name", formattedProject);

        newProjectButton.innerText = newProject;
        newProjectDiv.appendChild(newProjectButton);
        newProjectDiv.addEventListener("click", (e) => this.handleProjectRowClick(e));

        // add to dom
        this.addProject.parentNode.insertBefore(newProjectDiv, this.addProject);
        this.projectModal.close();
    },
    handleProjectRowClick: function(e) {
        let tag = e.target.tagName.toLowerCase();
        console.log(tag); // "svg" or "div" "li"
        if (tag === "svg" || tag === "path") {
            
            const row = e.target.closest("div");
            const name = row.dataset.projectName;

            logic.removeProject(name);
            row.remove();
            this.display(logic.currentProject);
        } else if (tag === "li") {
            this.changeProject(e.target.dataset.projectName);
        }
    },
    changeProject: function(project) {
        logic.currentProject = project;
        this.display(logic.currentProject);
    },
    handleContainerClick: function(e) {
        const targetId = e.target.closest("[data-item-id]")?.dataset.itemId || null;
        if (!targetId) return console.log("no todo item clicked");

        switch(e.target.dataset.value) {
            case "checkbox":
                this.handleCheck(targetId);
                break;
            case "edit":
                this.handleEdit(targetId);
                break;
            case "delete":
                this.handleDeleteTask(targetId);
                break;
            default:
                console.log(`${targetId} clicked`);
        }
    },
    handleDeleteTask: function(itemId) {
        logic.removeItem(itemId);
        this.display(logic.currentProject);
    },
    handleCheck: function(itemId) {
        logic.toggleItem(itemId);
        this.display(logic.currentProject);
    },
    handleEdit: function(itemId) {
        this.editModal.showModal();
        const item = logic.locateItem(itemId).item;

        this.editFormTitle.value = item.title;
        this.editFormDescription.value = item.description;
        this.editFormDueDate.value = item.dueDate;
        this.editFormPriority.value = item.priority;
        this.submitEditTaskButton.setAttribute("data-item-id", itemId);

    },
    handleEditSubmit: function(e) {
        e.preventDefault();
        const itemId = this.submitEditTaskButton.dataset.itemId;
        let title = this.editFormTitle.value;
        let description = this.editFormDescription.value;
        let dueDate = this.editFormDueDate.value;
        let priority = this.editFormPriority.value;

        logic.editItemTitle(itemId, title);
        logic.editItemDescription(itemId, description);
        logic.editItemDueDate(itemId, dueDate);
        logic.editItemPriority(itemId, priority);

        this.display(logic.currentProject);
        this.editModal.close();

    },
    handleTaskSubmit: function(e) {
        e.preventDefault();

        let title = this.taskFormTitle.value;
        let description = this.taskFormDescription.value;
        let dueDate = this.taskFormDueDate.value;
        let priority = this.taskFormPriority.value;

        logic.addItem(title, description, dueDate, priority);
        this.resetTaskModal();
        
        this.display(logic.currentProject);
        this.taskModal.close();
    },
    resetTaskModal: function() {
        this.taskFormTitle.value = "";
        this.taskFormDescription.value = "";
        this.taskFormDueDate.value = "";
        this.taskFormPriority.value = "";
    },
    display: function(project) {
        this.todoContainer.innerHTML = "";
        this.currentProject.innerText = (project === "default") ? "INBOX" : project.toUpperCase().split("-").join(" ");
        let displayProject = logic.projects[project];
        for (let itemId in displayProject) {
            let checked = displayProject[itemId].completed;
            let title = displayProject[itemId].title;
            let description = displayProject[itemId].description;
            let dueDate = displayProject[itemId].dueDate;
            let priority = displayProject[itemId].priority;

            const todoRow = document.createElement("div");
            todoRow.classList.add("todo-row");
            todoRow.setAttribute("data-item-id", itemId);
            
            const todoCheckbox = document.createElement("div");
            todoCheckbox.setAttribute("data-value", "checkbox");
            todoCheckbox.classList.add("todo-checkbox");
            if (checked) {
                todoCheckbox.innerHTML = this.svgChecked;                
            } else {
                todoCheckbox.innerHTML = this.svgUnchecked;
            }

            const todoTitle = document.createElement("div");
            todoTitle.classList.add("todo-title");
            todoTitle.innerText = title;

            const todoDescription = document.createElement("div");
            todoDescription.classList.add("todo-description");
            todoDescription.innerText = description;

            const todoDueDate = document.createElement("div");
            todoDueDate.classList.add("todo-due-date");
            todoDueDate.innerText = dueDate;

            const todoPriority = document.createElement("div");
            todoPriority.classList.add("todo-priority");
            todoPriority.innerText = priority;

            todoRow.appendChild(todoCheckbox);
            todoRow.appendChild(todoTitle);
            todoRow.appendChild(todoDescription);
            todoRow.appendChild(todoDueDate);
            todoRow.appendChild(todoPriority);

            todoRow.innerHTML += `
            <div class="todo-edit" data-value="edit"><svg data-value="edit" id="icon-edit-todo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil-outline</title><path data-value="edit" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" /></svg></div>
            <div class="todo-delete" data-value="delete"><svg data-value="delete" id="icon-delete-todo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path data-value="delete" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg></div>`;

            this.todoContainer.appendChild(todoRow);
        }
    },
    
}

dom.init();


// only for development so I can access stuff through the console
window.logic = logic;
console.table(logic);