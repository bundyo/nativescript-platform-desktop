export declare class FileSystemAccess {
    getLastModified(path: string): Date | any;
    getFileSize(path: string): number | any;
    getParent(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
    } | any;
    getFile(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
        extension: string;
    } | any;
    getFolder(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
    } | any;
    getExistingFolder(path: string, onError?: (error: any) => any): {
        path: string;
        name: string;
    } | any;
    eachEntity(path: string, onEntity: (file: {
        path: string;
        name: string;
        extension: string;
    }) => any, onError?: (error: any) => any): void;
    getEntities(path: string, onError?: (error: any) => any): Array<{
        path: string;
        name: string;
        extension: string;
    }>;
    fileExists(path: string): boolean;
    folderExists(path: string): boolean;
    private exists;
    concatPath(left: string, right: string): string | any;
    deleteFile(path: string, onError?: (error: any) => any): void;
    deleteFolder(path: string, onError?: (error: any) => any): void;
    emptyFolder(path: string, onError?: (error: any) => any): void;
    rename(path: string, newPath: string, onError?: (error: any) => any): void;
    getLogicalRootPath(): string | any;
    getDocumentsFolderPath(): string | any;
    getTempFolderPath(): string | any;
    getCurrentAppPath(): string;
    readText: any;
    readTextAsync(path: string, encoding?: any): void;
    readTextSync(path: string, onError?: (error: any) => any, encoding?: any): void;
    read: any;
    readAsync(path: string): any;
    readSync(path: string, onError?: (error: any) => any): any;
    writeText: any;
    writeTextAsync(path: string, content: string, encoding?: any): Promise<void> | any;
    writeTextSync(path: string, content: string, onError?: (error: any) => any, encoding?: any): void;
    write: any;
    writeAsync(path: string, content: any): Promise<void> | any;
    writeSync(path: string, content: any, onError?: (error: any) => any): void;
    private getKnownPath;
    private getFileExtension;
    private deleteEntity;
    private enumEntities;
    getPathSeparator(): string;
    normalizePath(path: string): string | any;
    joinPath(left: string, right: string): string | any;
    joinPaths(paths: string[]): string;
}
