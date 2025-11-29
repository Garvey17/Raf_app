import { dangote3x } from "@/Assets/assets"; // Placeholder, will need to handle images

export const cementProducts = [
  {
    id: "opc-43",
    name: "Ordinary Portland Cement (OPC) 43 Grade",
    description: "High-strength cement suitable for general construction, concrete works, and plastering.",
    price: 380,
    weight: "50kg",
    category: "OPC",
    image: dangote3x,
    features: ["High durability", "Quick setting", "Corrosion resistant"],
    inStock: true,
  },
  {
    id: "opc-53",
    name: "Ordinary Portland Cement (OPC) 53 Grade",
    description: "Superior strength cement ideal for high-rise buildings, bridges, and heavy-duty structures.",
    price: 420,
    weight: "50kg",
    category: "OPC",
    image: dangote3x,
    features: ["Extra strength", "Fast hardening", "Crack resistant"],
    inStock: true,
  },
  {
    id: "ppc",
    name: "Portland Pozzolana Cement (PPC)",
    description: "Eco-friendly cement with fly ash, perfect for residential buildings and marine works.",
    price: 360,
    weight: "50kg",
    category: "PPC",
    image: dangote3x,
    features: ["Better workability", "Low heat of hydration", "Chemical resistant"],
    inStock: true,
  },
  {
    id: "white-cement",
    name: "White Cement",
    description: "Premium white cement for decorative flooring, wall putty, and architectural finishes.",
    price: 850,
    weight: "25kg",
    category: "White Cement",
    image: dangote3x,
    features: ["High whiteness", "Smooth finish", "Versatile use"],
    inStock: true,
  },
  {
    id: "rapid-hardening",
    name: "Rapid Hardening Cement",
    description: "Specialized cement that gains strength quickly, used for road repairs and precast concrete.",
    price: 450,
    weight: "50kg",
    category: "Specialty",
    image: dangote3x,
    features: ["Early strength gain", "Cold weather concreting", "Time-saving"],
    inStock: false,
  }
];

export const services = [
    {
        id: 1,
        title: "Bulk Delivery",
        description: "Reliable and timely delivery of bulk cement orders directly to your construction site.",
        icon: "Truck"
    },
    {
        id: 2,
        title: "Quality Testing",
        description: "On-site quality testing services to ensure the cement meets all structural requirements.",
        icon: "ClipboardCheck"
    },
    {
        id: 3,
        title: "Expert Consultation",
        description: "Get advice from our civil engineers on the best cement type for your specific project.",
        icon: "HardHat"
    }
]
