export const getErrorMessage = (error: any): string => {
    if (error?.response?.data) {
        const data = error.response.data;
        if (data.error) return data.error;
        if (data.message) return data.message;
    }
    if (error?.message) return error.message;
    return "Failed to perform action";
};
