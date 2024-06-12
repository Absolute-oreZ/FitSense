export const passwordValidator = (_, value) => {
    if (!value) {
        return Promise.reject(new Error("Please input your password!"));
    }
    if (value.length < 8) {
        return Promise.reject(
            new Error("Password must be at least 8 characters long!")
        );
    }
    if (value.length > 16) {
        return Promise.reject(
            new Error("Password cannot be more than 16 characters long!")
        );
    }
    if (!/[A-Z]/.test(value)) {
        return Promise.reject(
            new Error("Password must contain at least one uppercase letter!")
        );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return Promise.reject(
            new Error("Password must contain at least one special character!")
        );
    }
    if (!/\d/.test(value)) {
        return Promise.reject(
            new Error("Password must contain at least one number!")
        );
    }
    return Promise.resolve();
};

export const ageValidator = (_, dob) => {
    if (!dob) {
        return Promise.reject(new Error("Please provide your date of birth!"));
    }

    // Calculate today's date
    const today = new Date();

    // Calculate the user's birth date
    const birthDate = new Date(dob);

    // Calculate the user's age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    // Check if the user is at least 18 years old
    if (age < 18) {
        return Promise.reject(new Error("You must be at least 18 years old to use our service!"));
    }

    return Promise.resolve();
};