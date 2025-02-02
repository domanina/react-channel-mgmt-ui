import moment from 'moment-timezone';


export const filterData = (data, query) => {
    if (!query.trim()) {
        return data
    }
    const lowerCaseQuery = query.trim().toLowerCase()
    const filterFields = ['name', 'id', 'channel', 'type']

    return data.filter(item => {
        return filterFields.some(field => {
            return String(item[field]).toLowerCase().includes(lowerCaseQuery)
        })
    })
}


export const validateTextField = (name, value) => {
    let regex = new RegExp("^[\\u{0000}-\\u{007F}äÄöÖüÜß]*$", "u");
    if (value.length > fieldMaxLengths[name]) {
        return `Maximum field length exceeded ${fieldMaxLengths[name]}`;
    } else if (!regex.test(value)) {  // Checks for non ASCII characters
        return 'Unsupported characters';
    } else if (/<[^>]*>/g.test(value)) {  // Checks for markup
        return 'Unsupported characters. Please do not use plain text and no markup language.';
    }
    return '';
};


export const isFormValid = (itemData, method = "POST") => {
    const dateValidationErrors = validateDateTimeFields(itemData.startTime, itemData.endTime);

    const textFields = ['title', 'description', 'name'];
    const textFieldsValid = textFields.every(field => !validateTextField(field, itemData[field]));

    if (method === "POST") {
        return (
            itemData.type !== '' &&
            (itemData.images !== '' || itemData.base64Image !== '') &&
            textFieldsValid &&
            itemData.startTime !== '' &&
            itemData.endTime !== '' &&
            !dateValidationErrors.startTime &&
            !dateValidationErrors.endTime
        );
    }

    if (method === "PUT") {
        return (
            textFieldsValid &&
            !dateValidationErrors.startTime &&
            !dateValidationErrors.endTime
        );
    }

    return false;
};
