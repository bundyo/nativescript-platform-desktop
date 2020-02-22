export declare enum connectionType {
    none = 0,
    wifi = 1,
    mobile = 2
}
export declare function getConnectionType(): number;
export declare function startMonitoring(connectionTypeChangedCallback: (newConnectionType: number) => void): void;
export declare function stopMonitoring(): void;
