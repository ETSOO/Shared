String.prototype.format = function (
    this: string,
    ...parameters: string[]
): string {
    let template = this;
    parameters.forEach((value, index) => {
        template = template.replace(new RegExp(`\\{${index}\\}`, 'g'), value);
    });
    return template;
};

export {};
