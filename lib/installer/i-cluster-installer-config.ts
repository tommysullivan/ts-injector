export interface IClusterInstallerConfig {
    installationTimeoutInMilliseconds: number;
    licenseType: string;
    sshMethod: string;
    sshUsername: string;
    sshPassword: string;
    adminUsername: string;
    adminPassword: string;
    coreVersion: string;
    location: string;
    disks: Array<string>;
}