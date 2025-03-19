import "./styles.css";

const appLogic = {
    projects: {
        default: {"1": {"a": "a"},},
    },

    addItem: function(title, description, dueDate, priority) {
        const itemId = crypto.randomUUID();
        if(!this.projects.default) this.projects.default = {};
        this.projects.default[itemId] = new this.TodoItem(title, description, dueDate, priority);
    },
    TodoItem: function(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    },
    removeItem: function(itemId) {
        let located = this.locateItem(itemId);
        if (located) {
            delete this.projects[located.project][itemId];
        } else {
            console.log("Item not found");
        }
    },
    removeProject: function(project) {
        if (this.projects[project]) delete this.projects[project];
    },
    createProject: function(newProject) {
        this.projects[newProject] = {};
    },
    moveItem(itemId, destination) {
        let located = this.locateItem(itemId);
        if (located) {
            if (!this.projects[destination]) this.createProject(destination);
            this.projects[destination][itemId] = located[itemId];
            delete this.projects[located.project][itemId];
        }
    },
    editItemTitle: function(itemId, newTitle) {
        this.locateItem(itemId).title = newTitle;
    },
    editItemDescription: function(itemId, newDescription) {
        this.locateItem(itemId).description = newDescription;
    },
    editItemDueDate: function(itemId, newDate) {
        this.locateItem(itemId).dueDate = newDate;
    },
    editItemPriority: function(itemId, newPriority) {
        this.locateItem(itemId).priority = newPriority;
    },
    locateItem: function(itemId) {
        for (let project in this.projects) {
            if (this.projects[project][itemId]) {
                return {project, item: this.projects[project][itemId]};
            } else {
                console.log("Item not found");
            }
        }

    }
    
};





// only for development so I can access stuff through the console
window.appLogic = appLogic;
console.table(appLogic);