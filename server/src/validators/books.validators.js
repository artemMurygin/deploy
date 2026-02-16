function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
}

function toArrayOfIds(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(Number).filter(Boolean);
    return String(value)
        .split(',')
        .map((x) => Number(x.trim()))
        .filter(Boolean);
}

function validateCreateBook(body) {
    const errors = [];

    if (!isNonEmptyString(body.title)) errors.push('title is required');
    if (body.publish_year != null && !Number.isInteger(Number(body.publish_year))) errors.push('publish_year must be integer');
    if (body.pages != null && !Number.isInteger(Number(body.pages))) errors.push('pages must be integer');

    if (body.status && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(body.status)) errors.push('invalid status');
    if (body.language && typeof body.language !== 'string') errors.push('language must be string');

    return errors;
}

function validateUpdateBook(body) {
    const errors = [];

    if (body.title != null && !isNonEmptyString(body.title)) errors.push('title must be non-empty string');
    if (body.publish_year != null && !Number.isInteger(Number(body.publish_year))) errors.push('publish_year must be integer');
    if (body.pages != null && !Number.isInteger(Number(body.pages))) errors.push('pages must be integer');

    if (body.status != null && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(body.status)) errors.push('invalid status');
    if (body.language != null && typeof body.language !== 'string') errors.push('language must be string');

    return errors;
}

module.exports = {validateCreateBook, validateUpdateBook, toArrayOfIds};