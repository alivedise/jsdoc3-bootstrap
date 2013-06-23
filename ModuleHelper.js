/**
 * A helper object to convert a module list into a package-like hierarchy.
 *
 * @param {array} memberModules
 *           The member modules array from publish.js.
 *
 * @param {function} linkto
 *           The linkto function from publish.js
 */
function ModuleHelper(memberModules, linkto) {
    this.memberModules = memberModules;
    this.linkto = linkto;
}

/**
 * Make the hierarchy.
 */
ModuleHelper.prototype.makeModuleMap = function() {
    var moduleMap = {
        itemCount: 0,
        name: ''
    };
    function addModule(module, parent, names) {
        //print("addModule", module, parent, names);
        parent = parent || moduleMap;
        names = names || module.name;
        if ("string" === typeof names) {
            names = names.split('/');
        }
        //print("addModule", parent, names);
        var path0 = names[0];
        if (names.length === 1) {
            parent[path0] = {
                module: module,
                name: path0
            };
            parent.itemCount++;
            //print("addModule", module.name);
            return;
        }
        parent[path0] = parent[path0] || {
            itemCount: 0,
            name: parent.name + '/' + path0
        };
        addModule(module, parent[path0], names.slice(1));
    }
    this.memberModules.forEach(function(m) {
        addModule(m);
    });
    return moduleMap;
};

/**
 * Returns a formatted HTML string for the nav menu.
 *
 * @param {object} moduleMap
 *           The module map. If not provided a module map will be generated.
 */
ModuleHelper.prototype.printModules = function(moduleMap) {
    var linkto = this.linkto;

    function printModules(modules, arr, indent) {
        arr = arr || [];
        indent = indent || 0;
        for (var i in modules) {
            var module = modules[i];
            if (module.module) {
                arr.push('<li>'+linkto(module.module.longname, module.name)+'</li>');
            }
        }
        for (var i in modules) {
            var module = modules[i];
            if (!module.module) {
                if (module.itemCount > 0) {
                    arr.push('<li>' + module.name + '</li>');
                }
                printModules(module, arr, indent + 2);
            }
        }
        return arr;
    }

    if (this.memberModules.length < 1) {
        return '';
    }

    moduleMap = moduleMap || this.makeModuleMap(this.memberModules);
    var arr = printModules(moduleMap);
    return arr.join('\n');
};

exports.ModuleHelper = ModuleHelper;
