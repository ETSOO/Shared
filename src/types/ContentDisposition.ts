import { Utils } from '../Utils';

/**
 * Content disposition of HTTP
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
 */
export class ContentDisposition {
    constructor(type: 'inline' | 'attachment', filename: string);
    constructor(type: 'form-data', filename: string, name: string);
    constructor(
        public readonly type: string,
        public readonly filename: string,
        public readonly name?: string
    ) {}

    /**
     * Format to standard output
     * @returns Result
     */
    format() {
        const items = [this.type];
        if (this.name) items.push(`name="${this.name}"`);
        const filename1 = this.filename.replace(/[^a-zA-Z0-9\.-]/g, '_');
        items.push(`filename="${filename1}"`);
        if (filename1 != this.filename)
            items.push(
                `filename*="UTF-8''${encodeURIComponent(this.filename)}"`
            );
        return items.join('; ');
    }

    /**
     * Parse header value
     * @param header Content-Disposition header value
     * @returns Object
     */
    static parse(header: string | undefined | null) {
        if (!header) return undefined;

        const parts = header.trim().split(/\s*;\s*/g);
        const len = parts.length;
        if (len < 2) return undefined;

        const type = parts[0];
        let name: string | undefined;
        let filename: string = '';

        for (let i = 1; i < len; i++) {
            const part = parts[i];
            let [field, value] = part.split(/\s*=\s*/g);

            // case-insensitive
            field = field.toLowerCase();

            // Remove quotes
            value = Utils.trim(value, '"');

            if (field === 'name') {
                name = value;
            } else if (field === 'filename') {
                if (filename === '') filename = value;
            } else if (field === 'filename*') {
                const pos = value.indexOf("''");
                filename =
                    pos == -1
                        ? value
                        : decodeURIComponent(value.substring(pos + 2));
            }
        }

        if (type === 'form-data') {
            return new ContentDisposition(type, filename, name ?? 'file');
        }

        if (type === 'inline' || type === 'attachment') {
            return new ContentDisposition(type, filename);
        }

        return undefined;
    }
}
