interface String {
    /**
     * Format string
     * @param this Template
     * @param parameters Parameters to fill the template
     * @returns Result
     */
    format(this: string, ...parameters: string[]): string;
}
