module.exports = function(repositoryInfoJSON, phase, _) {
    return {
        //TODO: Create IOperatingSystem and have eacn OS class implement the packaging variance
        isYum: function(operatingSystem) {
            var hostOS = operatingSystem.name.toLowerCase();
            return hostOS == "centos" || hostOS == 'redhat';
        },
        packageCommandFor: function(operatingSystem) {
            return this.isYum(operatingSystem) ? 'yum' : 'apt-get'
        },
        repoListCommandFor: function(operatingSystem) {
            return this.isYum(operatingSystem) ? 'yum repolist all' : 'apt-cache policy'
        },
        packageListCommandFor: function(operatingSystem) {
            return this.isYum(operatingSystem) ? 'yum list installed' : 'dpkg -l';
        },
        repositoryURLFor: function(operatingSystem, componentName) {
            var repoType = this.packageCommandFor(operatingSystem);
            var repo = _.findWhere(repositoryInfoJSON.repositories, {type: repoType, phase: phase});
            if(repo==null) throw new Error(`Could not find host for type ${repoType} and phase ${phase}`);
            if(repo.host==null) throw new Error(`Found repo for type ${repoType} and phase ${phase}, but there was no host specified`);
            var path = repositoryInfoJSON.pathsForComponents[componentName];
            if(path==null) throw new Error(`Could not find repo for component ${componentName}`);
            return `http://${repo.host}${path}`;
        }
    }
}