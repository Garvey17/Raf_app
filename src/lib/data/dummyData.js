// Centralized dummy data for MongoDB to Supabase migration
// This file contains in-memory data that replaces MongoDB during migration

import { generateId } from './idGenerator';

// Helper function to generate dates
const daysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

const hoursAgo = (hours) => {
    const date = new Date();
    date.setHours(date.getHours() - hours);
    return date;
};

// ==================== USERS ====================
export const users = [
    {
        _id: "user_001",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+234-801-234-5678",
        location: {
            address: "123 Main Street",
            city: "Lagos",
            state: "Lagos State",
            zipCode: "100001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=1",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z", // hashed "password123"
        verificationStatus: "verified",
        lastPurchaseDate: daysAgo(15),
        createdAt: daysAgo(120),
        updatedAt: daysAgo(15)
    },
    {
        _id: "user_002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+234-802-345-6789",
        location: {
            address: "456 Oak Avenue",
            city: "Abuja",
            state: "FCT",
            zipCode: "900001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=5",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "verified",
        lastPurchaseDate: daysAgo(5),
        createdAt: daysAgo(90),
        updatedAt: daysAgo(5)
    },
    {
        _id: "user_003",
        name: "Michael Johnson",
        email: "michael.j@example.com",
        phone: "+234-803-456-7890",
        location: {
            address: "789 Pine Road",
            city: "Port Harcourt",
            state: "Rivers State",
            zipCode: "500001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=12",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "pending",
        lastPurchaseDate: daysAgo(45),
        createdAt: daysAgo(60),
        updatedAt: daysAgo(10)
    },
    {
        _id: "user_004",
        name: "Sarah Williams",
        email: "sarah.w@example.com",
        phone: "+234-804-567-8901",
        location: {
            address: "321 Elm Street",
            city: "Kano",
            state: "Kano State",
            zipCode: "700001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=20",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "verified",
        lastPurchaseDate: daysAgo(2),
        createdAt: daysAgo(150),
        updatedAt: daysAgo(2)
    },
    {
        _id: "user_005",
        name: "David Brown",
        email: "david.brown@example.com",
        phone: "+234-805-678-9012",
        location: {
            address: "654 Maple Drive",
            city: "Ibadan",
            state: "Oyo State",
            zipCode: "200001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=33",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "unverified",
        lastPurchaseDate: null,
        createdAt: daysAgo(10),
        updatedAt: daysAgo(10)
    },
    {
        _id: "user_006",
        name: "Emily Davis",
        email: "emily.d@example.com",
        phone: "+234-806-789-0123",
        location: {
            address: "987 Cedar Lane",
            city: "Enugu",
            state: "Enugu State",
            zipCode: "400001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=45",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "verified",
        lastPurchaseDate: daysAgo(30),
        createdAt: daysAgo(200),
        updatedAt: daysAgo(30)
    },
    {
        _id: "user_007",
        name: "Robert Taylor",
        email: "robert.t@example.com",
        phone: "+234-807-890-1234",
        location: {
            address: "147 Birch Court",
            city: "Kaduna",
            state: "Kaduna State",
            zipCode: "800001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=52",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "verified",
        lastPurchaseDate: daysAgo(100),
        createdAt: daysAgo(180),
        updatedAt: daysAgo(100)
    },
    {
        _id: "user_008",
        name: "Lisa Anderson",
        email: "lisa.a@example.com",
        phone: "+234-808-901-2345",
        location: {
            address: "258 Willow Way",
            city: "Benin City",
            state: "Edo State",
            zipCode: "300001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=47",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "pending",
        lastPurchaseDate: daysAgo(7),
        createdAt: daysAgo(45),
        updatedAt: daysAgo(7)
    },
    {
        _id: "user_009",
        name: "Christopher Martinez",
        email: "chris.m@example.com",
        phone: "+234-809-012-3456",
        location: {
            address: "369 Spruce Street",
            city: "Calabar",
            state: "Cross River State",
            zipCode: "540001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=68",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "verified",
        lastPurchaseDate: daysAgo(20),
        createdAt: daysAgo(75),
        updatedAt: daysAgo(20)
    },
    {
        _id: "user_010",
        name: "Amanda Wilson",
        email: "amanda.w@example.com",
        phone: "+234-810-123-4567",
        location: {
            address: "741 Ash Boulevard",
            city: "Jos",
            state: "Plateau State",
            zipCode: "930001",
            country: "Nigeria"
        },
        image: "https://i.pravatar.cc/150?img=48",
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        verificationStatus: "verified",
        lastPurchaseDate: daysAgo(3),
        createdAt: daysAgo(130),
        updatedAt: daysAgo(3)
    }
];

// ==================== PRODUCTS ====================
export const products = [
    {
        _id: "prod_001",
        title: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
        price: 45000,
        category: "Electronics",
        stock: 50,
        isActive: true,
        createdAt: daysAgo(180),
        updatedAt: daysAgo(30)
    },
    {
        _id: "prod_002",
        title: "Smart Watch Series 5",
        description: "Advanced fitness tracking, heart rate monitoring, and smartphone notifications.",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
        price: 85000,
        category: "Electronics",
        stock: 30,
        isActive: true,
        createdAt: daysAgo(150),
        updatedAt: daysAgo(20)
    },
    {
        _id: "prod_003",
        title: "Leather Laptop Bag",
        description: "Professional leather laptop bag with multiple compartments. Fits up to 15-inch laptops.",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
        price: 25000,
        category: "Accessories",
        stock: 75,
        isActive: true,
        createdAt: daysAgo(200),
        updatedAt: daysAgo(10)
    },
    {
        _id: "prod_004",
        title: "Portable Bluetooth Speaker",
        description: "Waterproof portable speaker with 360-degree sound and 12-hour battery.",
        images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"],
        price: 18000,
        category: "Electronics",
        stock: 100,
        isActive: true,
        createdAt: daysAgo(120),
        updatedAt: daysAgo(5)
    },
    {
        _id: "prod_005",
        title: "Ergonomic Office Chair",
        description: "Comfortable office chair with lumbar support and adjustable height.",
        images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500"],
        price: 65000,
        category: "Furniture",
        stock: 20,
        isActive: true,
        createdAt: daysAgo(90),
        updatedAt: daysAgo(15)
    },
    {
        _id: "prod_006",
        title: "4K Webcam",
        description: "Ultra HD webcam with auto-focus and built-in microphone for video conferencing.",
        images: ["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500"],
        price: 32000,
        category: "Electronics",
        stock: 45,
        isActive: true,
        createdAt: daysAgo(100),
        updatedAt: daysAgo(8)
    },
    {
        _id: "prod_007",
        title: "Wireless Gaming Mouse",
        description: "High-precision gaming mouse with customizable RGB lighting and 16000 DPI.",
        images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"],
        price: 15000,
        category: "Electronics",
        stock: 60,
        isActive: true,
        createdAt: daysAgo(110),
        updatedAt: daysAgo(12)
    },
    {
        _id: "prod_008",
        title: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with blue switches and aluminum frame.",
        images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"],
        price: 28000,
        category: "Electronics",
        stock: 40,
        isActive: true,
        createdAt: daysAgo(95),
        updatedAt: daysAgo(6)
    },
    {
        _id: "prod_009",
        title: "Standing Desk Converter",
        description: "Adjustable standing desk converter for healthier work posture.",
        images: ["https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500"],
        price: 42000,
        category: "Furniture",
        stock: 25,
        isActive: true,
        createdAt: daysAgo(85),
        updatedAt: daysAgo(18)
    },
    {
        _id: "prod_010",
        title: "USB-C Hub 7-in-1",
        description: "Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.",
        images: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500"],
        price: 12000,
        category: "Electronics",
        stock: 80,
        isActive: true,
        createdAt: daysAgo(70),
        updatedAt: daysAgo(4)
    },
    {
        _id: "prod_011",
        title: "LED Desk Lamp",
        description: "Adjustable LED desk lamp with touch control and USB charging port.",
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"],
        price: 8500,
        category: "Accessories",
        stock: 90,
        isActive: true,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(2)
    },
    {
        _id: "prod_012",
        title: "Noise Cancelling Earbuds",
        description: "True wireless earbuds with active noise cancellation and 24-hour battery.",
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500"],
        price: 38000,
        category: "Electronics",
        stock: 55,
        isActive: true,
        createdAt: daysAgo(50),
        updatedAt: daysAgo(7)
    },
    {
        _id: "prod_013",
        title: "Monitor Stand with Drawer",
        description: "Wooden monitor stand with storage drawer for desk organization.",
        images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"],
        price: 16000,
        category: "Furniture",
        stock: 35,
        isActive: true,
        createdAt: daysAgo(40),
        updatedAt: daysAgo(9)
    },
    {
        _id: "prod_014",
        title: "Wireless Charging Pad",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
        images: ["https://images.unsplash.com/photo-1591290619762-c588f0e0c2e6?w=500"],
        price: 9500,
        category: "Electronics",
        stock: 70,
        isActive: true,
        createdAt: daysAgo(30),
        updatedAt: daysAgo(3)
    },
    {
        _id: "prod_015",
        title: "Cable Management Box",
        description: "Large cable management box to hide power strips and organize cables.",
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"],
        price: 5500,
        category: "Accessories",
        stock: 100,
        isActive: true,
        createdAt: daysAgo(25),
        updatedAt: daysAgo(1)
    },
    {
        _id: "prod_016",
        title: "External SSD 1TB",
        description: "Portable external SSD with 1TB storage and USB 3.1 Gen 2 interface.",
        images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500"],
        price: 52000,
        category: "Electronics",
        stock: 30,
        isActive: true,
        createdAt: daysAgo(80),
        updatedAt: daysAgo(11)
    },
    {
        _id: "prod_017",
        title: "Laptop Cooling Pad",
        description: "Laptop cooling pad with 5 fans and adjustable height settings.",
        images: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500"],
        price: 11000,
        category: "Accessories",
        stock: 50,
        isActive: true,
        createdAt: daysAgo(65),
        updatedAt: daysAgo(5)
    },
    {
        _id: "prod_018",
        title: "Smart LED Light Bulb",
        description: "WiFi-enabled smart LED bulb with color changing and voice control.",
        images: ["https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500"],
        price: 7500,
        category: "Electronics",
        stock: 85,
        isActive: true,
        createdAt: daysAgo(55),
        updatedAt: daysAgo(6)
    },
    {
        _id: "prod_019",
        title: "Desk Organizer Set",
        description: "5-piece desk organizer set with pen holder, tray, and file sorter.",
        images: ["https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=500"],
        price: 6500,
        category: "Accessories",
        stock: 95,
        isActive: true,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(4)
    },
    {
        _id: "prod_020",
        title: "HD Monitor 27-inch",
        description: "27-inch Full HD monitor with IPS panel and ultra-thin bezels.",
        images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"],
        price: 95000,
        category: "Electronics",
        stock: 15,
        isActive: true,
        createdAt: daysAgo(100),
        updatedAt: daysAgo(14)
    },
    {
        _id: "prod_021",
        title: "Ergonomic Mouse Pad",
        description: "Gel wrist rest mouse pad for comfortable extended use.",
        images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500"],
        price: 4500,
        category: "Accessories",
        stock: 120,
        isActive: true,
        createdAt: daysAgo(35),
        updatedAt: daysAgo(2)
    },
    {
        _id: "prod_022",
        title: "Webcam Privacy Cover",
        description: "Ultra-thin webcam cover for laptop and desktop privacy protection.",
        images: ["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500"],
        price: 2000,
        category: "Accessories",
        stock: 200,
        isActive: true,
        createdAt: daysAgo(20),
        updatedAt: daysAgo(1)
    },
    {
        _id: "prod_023",
        title: "Portable Power Bank 20000mAh",
        description: "High-capacity power bank with fast charging and dual USB ports.",
        images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500"],
        price: 14000,
        category: "Electronics",
        stock: 65,
        isActive: true,
        createdAt: daysAgo(75),
        updatedAt: daysAgo(8)
    },
    {
        _id: "prod_024",
        title: "Laptop Screen Protector",
        description: "Anti-glare laptop screen protector for 15.6-inch displays.",
        images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"],
        price: 3500,
        category: "Accessories",
        stock: 110,
        isActive: true,
        createdAt: daysAgo(40),
        updatedAt: daysAgo(3)
    },
    {
        _id: "prod_025",
        title: "Bluetooth Keyboard and Mouse Combo",
        description: "Wireless keyboard and mouse combo with long battery life.",
        images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"],
        price: 22000,
        category: "Electronics",
        stock: 40,
        isActive: true,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(7)
    }
];

// ==================== STAFF ====================
export const staff = [
    {
        _id: "staff_001",
        staffNumber: "STF-20241101-001",
        name: "Admin User",
        email: "admin@company.com",
        phone: "+234-901-111-1111",
        role: "admin",
        department: "administration",
        status: "active",
        dateJoined: daysAgo(365),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        lastLogin: hoursAgo(2),
        permissions: ["all"],
        notes: "System administrator",
        createdAt: daysAgo(365),
        updatedAt: hoursAgo(2)
    },
    {
        _id: "staff_002",
        staffNumber: "STF-20241115-002",
        name: "Transport Officer James",
        email: "james.transport@company.com",
        phone: "+234-901-222-2222",
        role: "transport_officer",
        department: "logistics",
        status: "active",
        dateJoined: daysAgo(200),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        lastLogin: hoursAgo(5),
        permissions: ["manage_dispatches", "assign_drivers", "view_deliveries"],
        notes: "Handles dispatch operations",
        createdAt: daysAgo(200),
        updatedAt: hoursAgo(5)
    },
    {
        _id: "staff_003",
        staffNumber: "STF-20241120-003",
        name: "Warehouse Manager Sarah",
        email: "sarah.warehouse@company.com",
        phone: "+234-901-333-3333",
        role: "warehouse_manager",
        department: "warehouse",
        status: "active",
        dateJoined: daysAgo(180),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        lastLogin: hoursAgo(8),
        permissions: ["manage_inventory", "approve_orders", "view_products"],
        notes: "Manages warehouse operations",
        createdAt: daysAgo(180),
        updatedAt: hoursAgo(8)
    },
    {
        _id: "staff_004",
        staffNumber: "STF-20241125-004",
        name: "Sales Rep Michael",
        email: "michael.sales@company.com",
        phone: "+234-901-444-4444",
        role: "sales_representative",
        department: "sales",
        status: "active",
        dateJoined: daysAgo(150),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        lastLogin: hoursAgo(12),
        permissions: ["view_customers", "create_orders", "view_analytics"],
        notes: "Top performing sales representative",
        createdAt: daysAgo(150),
        updatedAt: hoursAgo(12)
    },
    {
        _id: "staff_005",
        staffNumber: "STF-20241130-005",
        name: "Customer Service Lisa",
        email: "lisa.cs@company.com",
        phone: "+234-901-555-5555",
        role: "customer_service",
        department: "customer_service",
        status: "active",
        dateJoined: daysAgo(120),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        lastLogin: hoursAgo(1),
        permissions: ["view_customers", "view_orders", "send_notifications"],
        notes: "Handles customer inquiries",
        createdAt: daysAgo(120),
        updatedAt: hoursAgo(1)
    },
    {
        _id: "staff_006",
        staffNumber: "STF-20241201-006",
        name: "Accountant David",
        email: "david.accounts@company.com",
        phone: "+234-901-666-6666",
        role: "accountant",
        department: "finance",
        status: "active",
        dateJoined: daysAgo(100),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        lastLogin: hoursAgo(24),
        permissions: ["view_payments", "verify_payments", "view_analytics"],
        notes: "Manages financial records",
        createdAt: daysAgo(100),
        updatedAt: hoursAgo(24)
    },
    {
        _id: "staff_007",
        staffNumber: "STF-20241205-007",
        name: "Operations Manager Emily",
        email: "emily.ops@company.com",
        phone: "+234-901-777-7777",
        role: "warehouse_manager",
        department: "operations",
        status: "active",
        dateJoined: daysAgo(80),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        lastLogin: hoursAgo(6),
        permissions: ["view_all", "manage_operations"],
        notes: "Oversees daily operations",
        createdAt: daysAgo(80),
        updatedAt: hoursAgo(6)
    },
    {
        _id: "staff_008",
        staffNumber: "STF-20241210-008",
        name: "IT Support Robert",
        email: "robert.it@company.com",
        phone: "+234-901-888-8888",
        role: "other",
        department: "other",
        status: "active",
        dateJoined: daysAgo(60),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        lastLogin: hoursAgo(48),
        permissions: ["system_admin", "manage_staff"],
        notes: "IT support and maintenance",
        createdAt: daysAgo(60),
        updatedAt: hoursAgo(48)
    }
];

// ==================== DRIVERS ====================
export const drivers = [
    {
        _id: "driver_001",
        driverNumber: "DRV-20241101-001",
        name: "Driver John",
        email: "john.driver@company.com",
        phone: "+234-902-111-1111",
        role: "driver",
        department: "logistics",
        vehicleAssigned: "TRK-001",
        totalDeliveries: 145,
        dateJoined: daysAgo(300),
        status: "active",
        licenseNumber: "LAG-DL-12345",
        licenseExpiry: new Date("2026-12-31"),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        currentLocation: "Lagos",
        lastDeliveryDate: daysAgo(1),
        rating: 4.8,
        notes: "Reliable and punctual",
        createdAt: daysAgo(300),
        updatedAt: daysAgo(1)
    },
    {
        _id: "driver_002",
        driverNumber: "DRV-20241110-002",
        name: "Driver Peter",
        email: "peter.driver@company.com",
        phone: "+234-902-222-2222",
        role: "driver",
        department: "logistics",
        vehicleAssigned: "TRK-002",
        totalDeliveries: 98,
        dateJoined: daysAgo(250),
        status: "active",
        licenseNumber: "ABJ-DL-67890",
        licenseExpiry: new Date("2027-06-30"),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        currentLocation: "Abuja",
        lastDeliveryDate: daysAgo(2),
        rating: 4.6,
        notes: "Good with fragile items",
        createdAt: daysAgo(250),
        updatedAt: daysAgo(2)
    },
    {
        _id: "driver_003",
        driverNumber: "DRV-20241115-003",
        name: "Driver Ahmed",
        email: "ahmed.driver@company.com",
        phone: "+234-902-333-3333",
        role: "driver",
        department: "logistics",
        vehicleAssigned: "TRK-003",
        totalDeliveries: 76,
        dateJoined: daysAgo(200),
        status: "active",
        licenseNumber: "KAN-DL-11223",
        licenseExpiry: new Date("2026-09-15"),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        currentLocation: "Kano",
        lastDeliveryDate: daysAgo(3),
        rating: 4.7,
        notes: "Excellent route knowledge",
        createdAt: daysAgo(200),
        updatedAt: daysAgo(3)
    },
    {
        _id: "driver_004",
        driverNumber: "DRV-20241120-004",
        name: "Driver Chidi",
        email: "chidi.driver@company.com",
        phone: "+234-902-444-4444",
        role: "driver",
        department: "logistics",
        vehicleAssigned: "TRK-004",
        totalDeliveries: 52,
        dateJoined: daysAgo(150),
        status: "active",
        licenseNumber: "ENU-DL-44556",
        licenseExpiry: new Date("2027-03-20"),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        currentLocation: "Enugu",
        lastDeliveryDate: daysAgo(5),
        rating: 4.5,
        notes: "New but promising",
        createdAt: daysAgo(150),
        updatedAt: daysAgo(5)
    },
    {
        _id: "driver_005",
        driverNumber: "DRV-20241125-005",
        name: "Driver Tunde",
        email: "tunde.driver@company.com",
        phone: "+234-902-555-5555",
        role: "driver",
        department: "logistics",
        vehicleAssigned: "TRK-005",
        totalDeliveries: 120,
        dateJoined: daysAgo(280),
        status: "on_leave",
        licenseNumber: "OYO-DL-77889",
        licenseExpiry: new Date("2026-11-10"),
        password: "$2a$10$rO5bNCQjzGKqH5F5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z",
        currentLocation: "Ibadan",
        lastDeliveryDate: daysAgo(15),
        rating: 4.9,
        notes: "On annual leave",
        createdAt: daysAgo(280),
        updatedAt: daysAgo(15)
    }
];

// ==================== ORDERS ====================
export const orders = [
    {
        _id: "order_001",
        orderNumber: "ORD-20241201-0001",
        user: "user_001",
        customerName: "John Doe",
        customerPhone: "+234-801-234-5678",
        items: [
            { productName: "Premium Wireless Headphones", quantity: 1, priceAtPurchase: 45000 },
            { productName: "Portable Bluetooth Speaker", quantity: 2, priceAtPurchase: 18000 }
        ],
        totalAmount: 81000,
        status: "delivered",
        address: "123 Main Street, Lagos, Lagos State",
        deliveryDate: daysAgo(10),
        instructions: "Call on arrival",
        payment: "payment_001",
        createdAt: daysAgo(15),
        updatedAt: daysAgo(10)
    },
    {
        _id: "order_002",
        orderNumber: "ORD-20241202-0002",
        user: "user_002",
        customerName: "Jane Smith",
        customerPhone: "+234-802-345-6789",
        items: [
            { productName: "Smart Watch Series 5", quantity: 1, priceAtPurchase: 85000 }
        ],
        totalAmount: 85000,
        status: "shipped",
        address: "456 Oak Avenue, Abuja, FCT",
        deliveryDate: daysAgo(2),
        instructions: "Leave at reception",
        payment: "payment_002",
        createdAt: daysAgo(5),
        updatedAt: daysAgo(2)
    },
    {
        _id: "order_003",
        orderNumber: "ORD-20241203-0003",
        user: "user_003",
        customerName: "Michael Johnson",
        customerPhone: "+234-803-456-7890",
        items: [
            { productName: "Ergonomic Office Chair", quantity: 1, priceAtPurchase: 65000 },
            { productName: "Standing Desk Converter", quantity: 1, priceAtPurchase: 42000 }
        ],
        totalAmount: 107000,
        status: "paid",
        address: "789 Pine Road, Port Harcourt, Rivers State",
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        instructions: "Fragile items, handle with care",
        payment: "payment_003",
        createdAt: daysAgo(3),
        updatedAt: daysAgo(1)
    },
    {
        _id: "order_004",
        orderNumber: "ORD-20241204-0004",
        user: "user_004",
        customerName: "Sarah Williams",
        customerPhone: "+234-804-567-8901",
        items: [
            { productName: "Leather Laptop Bag", quantity: 1, priceAtPurchase: 25000 },
            { productName: "Wireless Gaming Mouse", quantity: 1, priceAtPurchase: 15000 },
            { productName: "Mechanical Keyboard", quantity: 1, priceAtPurchase: 28000 }
        ],
        totalAmount: 68000,
        status: "approved",
        address: "321 Elm Street, Kano, Kano State",
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        instructions: "",
        payment: "payment_004",
        createdAt: daysAgo(2),
        updatedAt: daysAgo(1)
    },
    {
        _id: "order_005",
        orderNumber: "ORD-20241205-0005",
        user: "user_006",
        customerName: "Emily Davis",
        customerPhone: "+234-806-789-0123",
        items: [
            { productName: "4K Webcam", quantity: 1, priceAtPurchase: 32000 }
        ],
        totalAmount: 32000,
        status: "pending",
        address: "987 Cedar Lane, Enugu, Enugu State",
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        instructions: "Ring doorbell twice",
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
    },
    {
        _id: "order_006",
        orderNumber: "ORD-20241128-0006",
        user: "user_008",
        customerName: "Lisa Anderson",
        customerPhone: "+234-808-901-2345",
        items: [
            { productName: "USB-C Hub 7-in-1", quantity: 2, priceAtPurchase: 12000 },
            { productName: "LED Desk Lamp", quantity: 1, priceAtPurchase: 8500 }
        ],
        totalAmount: 32500,
        status: "delivered",
        address: "258 Willow Way, Benin City, Edo State",
        deliveryDate: daysAgo(5),
        instructions: "",
        payment: "payment_006",
        createdAt: daysAgo(7),
        updatedAt: daysAgo(5)
    },
    {
        _id: "order_007",
        orderNumber: "ORD-20241129-0007",
        user: "user_009",
        customerName: "Christopher Martinez",
        customerPhone: "+234-809-012-3456",
        items: [
            { productName: "Noise Cancelling Earbuds", quantity: 1, priceAtPurchase: 38000 },
            { productName: "Wireless Charging Pad", quantity: 1, priceAtPurchase: 9500 }
        ],
        totalAmount: 47500,
        status: "shipped",
        address: "369 Spruce Street, Calabar, Cross River State",
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        instructions: "Deliver before 5 PM",
        payment: "payment_007",
        createdAt: daysAgo(4),
        updatedAt: daysAgo(1)
    },
    {
        _id: "order_008",
        orderNumber: "ORD-20241130-0008",
        user: "user_010",
        customerName: "Amanda Wilson",
        customerPhone: "+234-810-123-4567",
        items: [
            { productName: "External SSD 1TB", quantity: 1, priceAtPurchase: 52000 }
        ],
        totalAmount: 52000,
        status: "paid",
        address: "741 Ash Boulevard, Jos, Plateau State",
        deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        instructions: "Call 30 minutes before delivery",
        payment: "payment_008",
        createdAt: daysAgo(3),
        updatedAt: hoursAgo(12)
    },
    {
        _id: "order_009",
        orderNumber: "ORD-20241125-0009",
        user: "user_001",
        customerName: "John Doe",
        customerPhone: "+234-801-234-5678",
        items: [
            { productName: "HD Monitor 27-inch", quantity: 1, priceAtPurchase: 95000 }
        ],
        totalAmount: 95000,
        status: "delivered",
        address: "123 Main Street, Lagos, Lagos State",
        deliveryDate: daysAgo(8),
        instructions: "",
        payment: "payment_009",
        createdAt: daysAgo(12),
        updatedAt: daysAgo(8)
    },
    {
        _id: "order_010",
        orderNumber: "ORD-20241126-0010",
        user: "user_002",
        customerName: "Jane Smith",
        customerPhone: "+234-802-345-6789",
        items: [
            { productName: "Laptop Cooling Pad", quantity: 1, priceAtPurchase: 11000 },
            { productName: "Cable Management Box", quantity: 2, priceAtPurchase: 5500 }
        ],
        totalAmount: 22000,
        status: "cancelled",
        address: "456 Oak Avenue, Abuja, FCT",
        deliveryDate: daysAgo(6),
        instructions: "Cancelled by customer",
        createdAt: daysAgo(8),
        updatedAt: daysAgo(6)
    }
];

// Continue in next part...

// ==================== PAYMENTS ====================
export const payments = [
    {
        _id: "payment_001",
        paymentNumber: "PAY-ORD-20241201-0001",
        user: "user_001",
        order: "order_001",
        customerName: "John Doe",
        paymentMethod: "card",
        reference: "PAY-REF-001-" + Date.now(),
        amount: 81000,
        verificationStatus: "approved",
        verifiedBy: "staff_006",
        verifiedAt: daysAgo(14),
        status: "success",
        paidAt: daysAgo(14),
        createdAt: daysAgo(15),
        updatedAt: daysAgo(14)
    },
    {
        _id: "payment_002",
        paymentNumber: "PAY-ORD-20241202-0002",
        user: "user_002",
        order: "order_002",
        customerName: "Jane Smith",
        paymentMethod: "bank_transfer",
        reference: "PAY-REF-002-" + Date.now(),
        amount: 85000,
        verificationStatus: "approved",
        verifiedBy: "staff_006",
        verifiedAt: daysAgo(4),
        status: "success",
        paidAt: daysAgo(4),
        createdAt: daysAgo(5),
        updatedAt: daysAgo(4)
    },
    {
        _id: "payment_003",
        paymentNumber: "PAY-ORD-20241203-0003",
        user: "user_003",
        order: "order_003",
        customerName: "Michael Johnson",
        paymentMethod: "mobile_money",
        reference: "PAY-REF-003-" + Date.now(),
        amount: 107000,
        verificationStatus: "approved",
        verifiedBy: "staff_006",
        verifiedAt: daysAgo(2),
        status: "success",
        paidAt: daysAgo(2),
        createdAt: daysAgo(3),
        updatedAt: daysAgo(2)
    },
    {
        _id: "payment_004",
        paymentNumber: "PAY-ORD-20241204-0004",
        user: "user_004",
        order: "order_004",
        customerName: "Sarah Williams",
        paymentMethod: "card",
        reference: "PAY-REF-004-" + Date.now(),
        amount: 68000,
        verificationStatus: "pending",
        verifiedBy: null,
        verifiedAt: null,
        status: "pending",
        paidAt: daysAgo(1),
        createdAt: daysAgo(2),
        updatedAt: daysAgo(1)
    },
    {
        _id: "payment_006",
        paymentNumber: "PAY-ORD-20241128-0006",
        user: "user_008",
        order: "order_006",
        customerName: "Lisa Anderson",
        paymentMethod: "ussd",
        reference: "PAY-REF-006-" + Date.now(),
        amount: 32500,
        verificationStatus: "approved",
        verifiedBy: "staff_006",
        verifiedAt: daysAgo(6),
        status: "success",
        paidAt: daysAgo(6),
        createdAt: daysAgo(7),
        updatedAt: daysAgo(6)
    },
    {
        _id: "payment_007",
        paymentNumber: "PAY-ORD-20241129-0007",
        user: "user_009",
        order: "order_007",
        customerName: "Christopher Martinez",
        paymentMethod: "card",
        reference: "PAY-REF-007-" + Date.now(),
        amount: 47500,
        verificationStatus: "approved",
        verifiedBy: "staff_006",
        verifiedAt: daysAgo(3),
        status: "success",
        paidAt: daysAgo(3),
        createdAt: daysAgo(4),
        updatedAt: daysAgo(3)
    },
    {
        _id: "payment_008",
        paymentNumber: "PAY-ORD-20241130-0008",
        user: "user_010",
        order: "order_008",
        customerName: "Amanda Wilson",
        paymentMethod: "bank_transfer",
        reference: "PAY-REF-008-" + Date.now(),
        amount: 52000,
        verificationStatus: "approved",
        verifiedBy: "staff_006",
        verifiedAt: hoursAgo(10),
        status: "success",
        paidAt: hoursAgo(10),
        createdAt: daysAgo(3),
        updatedAt: hoursAgo(10)
    },
    {
        _id: "payment_009",
        paymentNumber: "PAY-ORD-20241125-0009",
        user: "user_001",
        order: "order_009",
        customerName: "John Doe",
        paymentMethod: "card",
        reference: "PAY-REF-009-" + Date.now(),
        amount: 95000,
        verificationStatus: "approved",
        verifiedBy: "staff_006",
        verifiedAt: daysAgo(11),
        status: "success",
        paidAt: daysAgo(11),
        createdAt: daysAgo(12),
        updatedAt: daysAgo(11)
    }
];

// ==================== CARTS ====================
export const carts = [
    {
        _id: "cart_001",
        user: "user_005",
        items: [
            {
                id: "prod_010",
                name: "USB-C Hub 7-in-1",
                price: 12000,
                image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
                quantity: 1
            },
            {
                id: "prod_011",
                name: "LED Desk Lamp",
                price: 8500,
                image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
                quantity: 2
            }
        ],
        createdAt: daysAgo(5),
        updatedAt: daysAgo(2)
    },
    {
        _id: "cart_002",
        user: "user_007",
        items: [
            {
                id: "prod_001",
                name: "Premium Wireless Headphones",
                price: 45000,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                quantity: 1
            }
        ],
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3)
    },
    {
        _id: "cart_003",
        user: "user_003",
        items: [
            {
                id: "prod_014",
                name: "Wireless Charging Pad",
                price: 9500,
                image: "https://images.unsplash.com/photo-1591290619762-c588f0e0c2e6?w=500",
                quantity: 3
            },
            {
                id: "prod_021",
                name: "Ergonomic Mouse Pad",
                price: 4500,
                image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
                quantity: 1
            }
        ],
        createdAt: daysAgo(1),
        updatedAt: hoursAgo(6)
    }
];

// ==================== DISPATCHES ====================
export const dispatches = [
    {
        _id: "dispatch_001",
        order: "order_003",
        orderNumber: "ORD-20241203-0003",
        customerName: "Michael Johnson",
        productQuantity: 2,
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        destination: "789 Pine Road, Port Harcourt, Rivers State",
        totalAmount: 107000,
        dispatchStatus: "ready_for_dispatch",
        driver: null,
        driverPhone: null,
        vehicleNumber: null,
        assignedBy: null,
        assignedAt: null,
        dispatchedAt: null,
        deliveredAt: null,
        notes: "Fragile items - handle with care",
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
    },
    {
        _id: "dispatch_002",
        order: "order_004",
        orderNumber: "ORD-20241204-0004",
        customerName: "Sarah Williams",
        productQuantity: 3,
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        destination: "321 Elm Street, Kano, Kano State",
        totalAmount: 68000,
        dispatchStatus: "dispatched",
        driver: "Driver Ahmed",
        driverPhone: "+234-902-333-3333",
        vehicleNumber: "TRK-003",
        assignedBy: "staff_002",
        assignedAt: hoursAgo(24),
        dispatchedAt: hoursAgo(12),
        deliveredAt: null,
        notes: "",
        createdAt: daysAgo(1),
        updatedAt: hoursAgo(12)
    },
    {
        _id: "dispatch_003",
        order: "order_002",
        orderNumber: "ORD-20241202-0002",
        customerName: "Jane Smith",
        productQuantity: 1,
        deliveryDate: daysAgo(2),
        destination: "456 Oak Avenue, Abuja, FCT",
        totalAmount: 85000,
        dispatchStatus: "in_transit",
        driver: "Driver Peter",
        driverPhone: "+234-902-222-2222",
        vehicleNumber: "TRK-002",
        assignedBy: "staff_002",
        assignedAt: daysAgo(3),
        dispatchedAt: daysAgo(3),
        deliveredAt: null,
        notes: "Leave at reception",
        createdAt: daysAgo(4),
        updatedAt: daysAgo(3)
    },
    {
        _id: "dispatch_004",
        order: "order_001",
        orderNumber: "ORD-20241201-0001",
        customerName: "John Doe",
        productQuantity: 3,
        deliveryDate: daysAgo(10),
        destination: "123 Main Street, Lagos, Lagos State",
        totalAmount: 81000,
        dispatchStatus: "delivered",
        driver: "Driver John",
        driverPhone: "+234-902-111-1111",
        vehicleNumber: "TRK-001",
        assignedBy: "staff_002",
        assignedAt: daysAgo(14),
        dispatchedAt: daysAgo(13),
        deliveredAt: daysAgo(10),
        notes: "",
        createdAt: daysAgo(14),
        updatedAt: daysAgo(10)
    },
    {
        _id: "dispatch_005",
        order: "order_007",
        orderNumber: "ORD-20241129-0007",
        customerName: "Christopher Martinez",
        productQuantity: 2,
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        destination: "369 Spruce Street, Calabar, Cross River State",
        totalAmount: 47500,
        dispatchStatus: "in_transit",
        driver: "Driver Chidi",
        driverPhone: "+234-902-444-4444",
        vehicleNumber: "TRK-004",
        assignedBy: "staff_002",
        assignedAt: daysAgo(2),
        dispatchedAt: daysAgo(1),
        deliveredAt: null,
        notes: "Deliver before 5 PM",
        createdAt: daysAgo(3),
        updatedAt: daysAgo(1)
    }
];

// ==================== DELIVERIES ====================
export const deliveries = [
    {
        _id: "delivery_001",
        deliveryNumber: "DEL-ORD-20241201-0001",
        order: "order_001",
        dispatch: "dispatch_004",
        orderNumber: "ORD-20241201-0001",
        customerName: "John Doe",
        quantity: 3,
        dropLocation: "123 Main Street, Lagos, Lagos State",
        phoneNumber: "+234-801-234-5678",
        deliveryDate: daysAgo(10),
        driver: "Driver John",
        driverPhone: "+234-902-111-1111",
        truckNumber: "TRK-001",
        dispatchedAt: daysAgo(13),
        deliveredAt: daysAgo(10),
        receivedBy: "John Doe",
        deliveryStatus: "delivered",
        deliveryNotes: "Delivered successfully",
        proofOfDelivery: null,
        createdAt: daysAgo(13),
        updatedAt: daysAgo(10)
    },
    {
        _id: "delivery_002",
        deliveryNumber: "DEL-ORD-20241202-0002",
        order: "order_002",
        dispatch: "dispatch_003",
        orderNumber: "ORD-20241202-0002",
        customerName: "Jane Smith",
        quantity: 1,
        dropLocation: "456 Oak Avenue, Abuja, FCT",
        phoneNumber: "+234-802-345-6789",
        deliveryDate: daysAgo(2),
        driver: "Driver Peter",
        driverPhone: "+234-902-222-2222",
        truckNumber: "TRK-002",
        dispatchedAt: daysAgo(3),
        deliveredAt: null,
        receivedBy: null,
        deliveryStatus: "in_transit",
        deliveryNotes: "En route to destination",
        proofOfDelivery: null,
        createdAt: daysAgo(3),
        updatedAt: hoursAgo(6)
    },
    {
        _id: "delivery_003",
        deliveryNumber: "DEL-ORD-20241129-0007",
        order: "order_007",
        dispatch: "dispatch_005",
        orderNumber: "ORD-20241129-0007",
        customerName: "Christopher Martinez",
        quantity: 2,
        dropLocation: "369 Spruce Street, Calabar, Cross River State",
        phoneNumber: "+234-809-012-3456",
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        driver: "Driver Chidi",
        driverPhone: "+234-902-444-4444",
        truckNumber: "TRK-004",
        dispatchedAt: daysAgo(1),
        deliveredAt: null,
        receivedBy: null,
        deliveryStatus: "in_transit",
        deliveryNotes: "Expected delivery tomorrow",
        proofOfDelivery: null,
        createdAt: daysAgo(1),
        updatedAt: hoursAgo(3)
    },
    {
        _id: "delivery_004",
        deliveryNumber: "DEL-ORD-20241128-0006",
        order: "order_006",
        dispatch: "dispatch_006",
        orderNumber: "ORD-20241128-0006",
        customerName: "Lisa Anderson",
        quantity: 3,
        dropLocation: "258 Willow Way, Benin City, Edo State",
        phoneNumber: "+234-808-901-2345",
        deliveryDate: daysAgo(5),
        driver: "Driver John",
        driverPhone: "+234-902-111-1111",
        truckNumber: "TRK-001",
        dispatchedAt: daysAgo(6),
        deliveredAt: daysAgo(5),
        receivedBy: "Lisa Anderson",
        deliveryStatus: "delivered",
        deliveryNotes: "Package delivered in good condition",
        proofOfDelivery: null,
        createdAt: daysAgo(6),
        updatedAt: daysAgo(5)
    }
];

// ==================== NOTIFICATIONS ====================
export const notifications = [
    {
        _id: "notif_001",
        userId: "user_001",
        type: "success",
        category: "order",
        title: "Order Delivered",
        message: "Your order ORD-20241201-0001 has been successfully delivered.",
        icon: "📦",
        read: true,
        metadata: { orderId: "order_001", orderNumber: "ORD-20241201-0001" },
        expiresAt: null,
        createdAt: daysAgo(10),
        updatedAt: daysAgo(9)
    },
    {
        _id: "notif_002",
        userId: "user_002",
        type: "info",
        category: "shipment",
        title: "Order Shipped",
        message: "Your order ORD-20241202-0002 is on its way!",
        icon: "🚚",
        read: false,
        metadata: { orderId: "order_002", orderNumber: "ORD-20241202-0002" },
        expiresAt: null,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2)
    },
    {
        _id: "notif_003",
        userId: "user_003",
        type: "success",
        category: "payment",
        title: "Payment Confirmed",
        message: "Your payment of ₦107,000 has been confirmed.",
        icon: "💳",
        read: false,
        metadata: { paymentId: "payment_003", amount: 107000 },
        expiresAt: null,
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2)
    },
    {
        _id: "notif_004",
        userId: "user_004",
        type: "warning",
        category: "payment",
        title: "Payment Pending",
        message: "Your payment is being verified. This may take up to 24 hours.",
        icon: "⏳",
        read: false,
        metadata: { paymentId: "payment_004", orderId: "order_004" },
        expiresAt: null,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
    },
    {
        _id: "notif_005",
        userId: "user_005",
        type: "info",
        category: "system",
        title: "Welcome!",
        message: "Welcome to our e-commerce platform. Start shopping now!",
        icon: "👋",
        read: true,
        metadata: {},
        expiresAt: null,
        createdAt: daysAgo(10),
        updatedAt: daysAgo(8)
    },
    {
        _id: "notif_006",
        userId: "user_006",
        type: "info",
        category: "order",
        title: "Order Received",
        message: "We've received your order ORD-20241205-0005 and will process it soon.",
        icon: "✅",
        read: false,
        metadata: { orderId: "order_005", orderNumber: "ORD-20241205-0005" },
        expiresAt: null,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
    },
    {
        _id: "notif_007",
        userId: "user_008",
        type: "success",
        category: "order",
        title: "Order Delivered",
        message: "Your order ORD-20241128-0006 has been delivered successfully.",
        icon: "📦",
        read: true,
        metadata: { orderId: "order_006", orderNumber: "ORD-20241128-0006" },
        expiresAt: null,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(4)
    },
    {
        _id: "notif_008",
        userId: "user_009",
        type: "info",
        category: "shipment",
        title: "Out for Delivery",
        message: "Your order ORD-20241129-0007 is out for delivery and will arrive soon.",
        icon: "🚚",
        read: false,
        metadata: { orderId: "order_007", orderNumber: "ORD-20241129-0007" },
        expiresAt: null,
        createdAt: hoursAgo(6),
        updatedAt: hoursAgo(6)
    },
    {
        _id: "notif_009",
        userId: "user_010",
        type: "success",
        category: "payment",
        title: "Payment Verified",
        message: "Your payment of ₦52,000 has been verified and approved.",
        icon: "💳",
        read: false,
        metadata: { paymentId: "payment_008", amount: 52000 },
        expiresAt: null,
        createdAt: hoursAgo(10),
        updatedAt: hoursAgo(10)
    },
    {
        _id: "notif_010",
        userId: null,
        type: "alert",
        category: "company",
        title: "System Maintenance",
        message: "Scheduled maintenance on Sunday 2 AM - 4 AM. Service may be temporarily unavailable.",
        icon: "🔧",
        read: false,
        metadata: {},
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: hoursAgo(48),
        updatedAt: hoursAgo(48)
    },
    {
        _id: "notif_011",
        userId: null,
        type: "info",
        category: "company",
        title: "New Products Available",
        message: "Check out our latest collection of electronics and accessories!",
        icon: "🎉",
        read: false,
        metadata: {},
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3)
    },
    {
        _id: "notif_012",
        userId: "user_001",
        type: "success",
        category: "order",
        title: "Order Delivered",
        message: "Your order ORD-20241125-0009 has been delivered.",
        icon: "📦",
        read: true,
        metadata: { orderId: "order_009", orderNumber: "ORD-20241125-0009" },
        expiresAt: null,
        createdAt: daysAgo(8),
        updatedAt: daysAgo(7)
    },
    {
        _id: "notif_013",
        userId: "user_002",
        type: "warning",
        category: "order",
        title: "Order Cancelled",
        message: "Your order ORD-20241126-0010 has been cancelled as requested.",
        icon: "❌",
        read: true,
        metadata: { orderId: "order_010", orderNumber: "ORD-20241126-0010" },
        expiresAt: null,
        createdAt: daysAgo(6),
        updatedAt: daysAgo(5)
    },
    {
        _id: "notif_014",
        userId: "user_007",
        type: "info",
        category: "system",
        title: "Items in Your Cart",
        message: "You have items waiting in your cart. Complete your purchase today!",
        icon: "🛒",
        read: false,
        metadata: { cartId: "cart_002" },
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: daysAgo(2),
        updatedAt: daysAgo(2)
    },
    {
        _id: "notif_015",
        userId: null,
        type: "success",
        category: "stock",
        title: "Back in Stock",
        message: "Popular items are back in stock. Shop now before they're gone!",
        icon: "📢",
        read: false,
        metadata: {},
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1)
    }
];

// Helper to get virtual status for users
export const getUserStatus = (user) => {
    if (!user.lastPurchaseDate) {
        return "inactive";
    }
    const daysSinceLastPurchase = Math.floor(
        (Date.now() - new Date(user.lastPurchaseDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastPurchase <= 90 ? "active" : "inactive";
};

// Export all data as a single object for easy access
export const dummyData = {
    users,
    products,
    staff,
    drivers,
    orders,
    payments,
    carts,
    dispatches,
    deliveries,
    notifications
};

export default dummyData;

