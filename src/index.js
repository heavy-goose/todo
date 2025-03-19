import "./styles.css";

const appLogic = {
    projects: {
        default: {},
        completed: {},
    },
    addItem: function(title, description, dueDate, priority) {
        const itemId = crypto.randomUUID();
        if(!this.projects.default) this.projects.default = {};
        this.projects.default[itemId] = new this.TodoItem(title, description, dueDate, priority);
        return itemId;
    },
    restore: function() {
        let toRestore = [];

            for (let itemId in this.projects.completed) {
                if (!this.projects["completed"][itemId].completed) {
                    toRestore.push(itemId);
                }
            }
        toRestore.forEach(itemId => this.moveItem(itemId, this.projects["completed"][itemId].origin));
    },
    archive: function() {
        let toArchive = [];
            for (let project in this.projects) {
                if (project !== "completed") {
                    for (let itemId in this.projects[project]) {
                        if (this.projects[project][itemId].completed) {
                            this.projects[project][itemId].origin = project;
                            toArchive.push(itemId);
                        }
                    }
                }
            }
        
        toArchive.forEach(itemId => this.moveItem(itemId, "completed"));
    },
    refresh: function() {
        this.restore();
        this.archive();
    },            
    TodoItem: function(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    },
    toggleItem: function(itemId) {
        let located = this.locateItem(itemId);
        if (located) {
            located.item.completed = !located.item.completed;
        }
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
        if (project === "completed") return console.log("Can't touch this ⚠️");
        if (this.projects[project]) delete this.projects[project];
    },
    createProject: function(newProject) {
        if (!this.projects[newProject]) this.projects[newProject] = {};
    },
    moveItem(itemId, destination) {
        let located = this.locateItem(itemId);
        if (located) {

            if (!this.projects[destination]) this.createProject(destination); // create project folder if non-existent
            
            this.projects[destination][itemId] = located.item;
            delete this.projects[located.project][itemId];
        }
    },
    editItemTitle: function(itemId, newTitle) {
        this.locateItem(itemId).item.title = newTitle;
    },
    editItemDescription: function(itemId, newDescription) {
        this.locateItem(itemId).item.description = newDescription;
    },
    editItemDueDate: function(itemId, newDate) {
        this.locateItem(itemId).item.dueDate = newDate;
    },
    editItemPriority: function(itemId, newPriority) {
        this.locateItem(itemId).item.priority = newPriority;
    },
    locateItem: function(itemId) {
        for (let project in this.projects) {
            if (this.projects[project][itemId]) {
                return {project, item: this.projects[project][itemId]};
            }
        }
        console.log("Item not found");

    }
    
};

// only for development so I can access stuff through the console
window.appLogic = appLogic;
console.table(appLogic);