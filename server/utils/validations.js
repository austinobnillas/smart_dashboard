const validateUserData = (data) => {
    const errors = [];

    if (!data.username || data.username.trim().length < 3) {
        errors.push("Username must be at least 3 characters long.");
    }

    if (!data.pw || data.pw.length < 4) {
        errors.push("Password must be at least 4 characters long.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
};
module.exports = { validateUserData };