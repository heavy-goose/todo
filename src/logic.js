export const logic = {
  projects: {
    default: {},
    completed: {},
  },
  currentProject: 'default',
  addItem(title, description, dueDate, priority) {
    const itemId = crypto.randomUUID();
    if (!this.projects.default) this.projects.default = {};
    if (this.currentProject === 'completed') this.currentProject = 'default';
    this.projects[this.currentProject][itemId] = new this.TodoItem(
      title,
      description,
      dueDate,
      priority,
    );
    return itemId;
  },
  restore() {
    const toRestore = [];

    for (const itemId in this.projects.completed) {
      if (!this.projects.completed[itemId].completed) {
        toRestore.push(itemId);
      }
    }

    toRestore.forEach((itemId) =>
      this.moveItem(itemId, this.projects.completed[itemId].origin),
    );
  },
  archive() {
    const toArchive = [];
    for (const project in this.projects) {
      if (project !== 'completed') {
        for (const itemId in this.projects[project]) {
          if (this.projects[project][itemId].completed) {
            this.projects[project][itemId].origin = project;
            toArchive.push(itemId);
          }
        }
      }
    }

    toArchive.forEach((itemId) => this.moveItem(itemId, 'completed'));
  },
  refresh() {
    this.restore();
    this.archive();
  },
  TodoItem(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  },
  toggleItem(itemId) {
    const located = this.locateItem(itemId);
    if (located) {
      located.item.completed = !located.item.completed;
    }
    this.refresh();
  },
  removeItem(itemId) {
    const located = this.locateItem(itemId);
    if (located) {
      delete this.projects[located.project][itemId];
    } else {
      console.log('Item not found');
    }
  },
  removeProject(project) {
    if (project === 'completed') return console.log("Can't touch this ⚠️");
    if (this.projects[project]) {
      delete this.projects[project];
      this.currentProject = 'default';
    }
  },
  createProject(newProject) {
    if (!this.projects[newProject]) this.projects[newProject] = {};
  },
  moveItem(itemId, destination) {
    const located = this.locateItem(itemId);
    if (located) {
      if (!this.projects[destination]) this.createProject(destination); // create project folder if non-existent

      this.projects[destination][itemId] = located.item;
      delete this.projects[located.project][itemId];
    }
  },
  editItemTitle(itemId, newTitle) {
    this.locateItem(itemId).item.title = newTitle;
  },
  editItemDescription(itemId, newDescription) {
    this.locateItem(itemId).item.description = newDescription;
  },
  editItemDueDate(itemId, newDate) {
    this.locateItem(itemId).item.dueDate = newDate;
  },
  editItemPriority(itemId, newPriority) {
    this.locateItem(itemId).item.priority = newPriority;
  },
  locateItem(itemId) {
    for (const project in this.projects) {
      if (this.projects[project][itemId]) {
        return { project, item: this.projects[project][itemId] };
      }
    }
    console.log('Item not found');
  },
};
