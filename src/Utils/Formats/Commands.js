class Command {
  constructor(name, desc, alias, usage, permissions) {
    this.name = name;
    this.desc = desc;
    this.alias = alias;
    this.usage = usage;
    this.permissions = permissions;
  };
};

module.exports = Command;