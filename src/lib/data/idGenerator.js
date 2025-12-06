// Helper function to generate MongoDB-like ObjectIds
export const generateId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const randomValue = Math.random().toString(16).substring(2, 18);
    return timestamp + randomValue.padEnd(16, '0');
};

// Helper function to generate order numbers
export const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const random = Math.floor(Math.random() * 9999) + 1;
    const sequentialNumber = String(random).padStart(4, '0');
    return `ORD-${dateStr}-${sequentialNumber}`;
};

// Helper function to generate staff numbers
export const generateStaffNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const random = Math.floor(Math.random() * 999) + 1;
    const sequentialNumber = String(random).padStart(3, '0');
    return `STF-${dateStr}-${sequentialNumber}`;
};

// Helper function to generate driver numbers
export const generateDriverNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const random = Math.floor(Math.random() * 999) + 1;
    const sequentialNumber = String(random).padStart(3, '0');
    return `DRV-${dateStr}-${sequentialNumber}`;
};

// Helper function to generate payment numbers
export const generatePaymentNumber = (orderNumber) => {
    if (orderNumber) {
        return `PAY-${orderNumber}`;
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const random = Math.floor(Math.random() * 9999) + 1;
    const sequentialNumber = String(random).padStart(4, '0');
    return `PAY-${dateStr}-${sequentialNumber}`;
};

// Helper function to generate delivery numbers
export const generateDeliveryNumber = (orderNumber) => {
    if (orderNumber) {
        return `DEL-${orderNumber}`;
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const random = Math.floor(Math.random() * 9999) + 1;
    const sequentialNumber = String(random).padStart(4, '0');
    return `DEL-${dateStr}-${sequentialNumber}`;
};
