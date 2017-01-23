export interface IDockerImageNameConfig {
    name: string;
    type?: string;
    instances: number;
    diskProvider?: boolean;
}