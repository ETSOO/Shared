/**
 * Similar result with node.js path.parse(path)
 */
export type ParsedPath = {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
};
