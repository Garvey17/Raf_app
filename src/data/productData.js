// import iphoneXR from "../";
// import iphone11 from "../Assets/iphone-11.webp";
// import iphone11Pro from "../Assets/iphone-11-pro.webp";
// import iphone12 from "../Assets/iphone-12.webp";
// import iphone12Pro from "../Assets/iphone-12-pro.webp";
// import iphone13 from "../Assets/iphone-13.webp";
// import iphone13Pro from "../Assets/iphone-13-pro.webp";
// import iphone14 from "../Assets/iphone-14.webp";
// import iphone14Pro from "../Assets/iPhone-14-Pro-eSIM.webp";
// import iphone15 from "../Assets/iphone-15.webp";
// import iphone15Pro from "../Assets/iphone-15-Pro.png";
// import iphone16 from "../Assets/iphone-16.jpeg";
// import iphone16SE from "../Assets/iphone-16-se.jpeg";
// import iphone17 from "../Assets/iphone-17.jpeg";
// import iphone17Air from "../Assets/iphone-17-air.jpeg";
// import iphone17Pro from "../Assets/iphone-17-pro.jpeg";
// import logo from "../Assets/miryoku logo.svg"

// export const logoAsset = logo;
// export const products = [
//   {
//     id: "iphone-xr",
//     name: "iPhone XR",
//     description:
//       "The iPhone XR features a Liquid Retina display and the powerful A12 Bionic chip.",
//     price: 299000,
//     category: "iPhone",
//     image: iphoneXR,
//     colors: ["Black", "White", "Blue", "Coral", "Yellow", "Red"],
//     storage: ["64GB", "128GB", "256GB"],
//     inStock: true,
//     releaseYear: 2018,
//   },
//   {
//     id: "iphone-11",
//     name: "iPhone 11",
//     description:
//       "Dual-camera system, A13 Bionic chip, and all-day battery life.",
//     price: 355000,
//     category: "iPhone",
//     image: iphone11,
//     colors: ["Black", "White", "Green", "Yellow", "Purple", "Red"],
//     storage: ["64GB", "128GB", "256GB"],
//     inStock: true,
//     releaseYear: 2019,
//   },
//   {
//     id: "iphone-11-pro",
//     name: "iPhone 11 Pro",
//     description:
//       "Triple-camera system with Ultra Wide, Wide, and Telephoto lenses. Powered by A13 Bionic.",
//     price: 435000,
//     category: "iPhone",
//     image: iphone11Pro,
//     colors: ["Space Gray", "Silver", "Midnight Green", "Gold"],
//     storage: ["64GB", "256GB", "512GB"],
//     inStock: true,
//     releaseYear: 2019,
//   },
//   {
//     id: "iphone-12",
//     name: "iPhone 12",
//     description:
//       "Super Retina XDR display and 5G speed powered by the A14 Bionic chip.",
//     price: 480000,
//     category: "iPhone",
//     image: iphone12,
//     colors: ["Black", "White", "Red", "Green", "Blue", "Purple"],
//     storage: ["64GB", "128GB", "256GB"],
//     inStock: true,
//     releaseYear: 2020,
//   },
//   {
//     id: "iphone-12-pro",
//     name: "iPhone 12 Pro",
//     description:
//       "A14 Bionic chip, Ceramic Shield, and LiDAR scanner for next-level AR.",
//     price: 575000,
//     category: "iPhone",
//     image: iphone12Pro,
//     colors: ["Silver", "Graphite", "Gold", "Pacific Blue"],
//     storage: ["128GB", "256GB", "512GB"],
//     inStock: true,
//     releaseYear: 2020,
//   },
//   {
//     id: "iphone-13",
//     name: "iPhone 13",
//     description:
//       "A15 Bionic chip, advanced dual-camera system, and improved battery life.",
//     price: 610000,
//     category: "iPhone",
//     image: iphone13,
//     colors: ["Pink", "Blue", "Midnight", "Starlight", "Red", "Green"],
//     storage: ["128GB", "256GB", "512GB"],
//     inStock: true,
//     releaseYear: 2021,
//   },
//   {
//     id: "iphone-13-pro",
//     name: "iPhone 13 Pro",
//     description:
//       "ProMotion display, A15 Bionic, and a triple-camera system with cinematic mode.",
//     price: 730000,
//     category: "iPhone",
//     image: iphone13Pro,
//     colors: ["Graphite", "Gold", "Silver", "Sierra Blue"],
//     storage: ["128GB", "256GB", "512GB", "1TB"],
//     inStock: true,
//     releaseYear: 2021,
//   },
//   {
//     id: "iphone-14",
//     name: "iPhone 14",
//     description:
//       "A15 Bionic chip with improved camera system and crash detection safety feature.",
//     price: 720000,
//     category: "iPhone",
//     image: iphone14,
//     colors: ["Midnight", "Starlight", "Blue", "Purple", "Red", "Yellow"],
//     storage: ["128GB", "256GB", "512GB"],
//     inStock: true,
//     releaseYear: 2022,
//   },
//   {
//     id: "iphone-14-pro",
//     name: "iPhone 14 Pro",
//     description:
//       "Dynamic Island, Always-On display, and the powerful A16 Bionic chip.",
//     price: 890000,
//     category: "iPhone",
//     image: iphone14Pro,
//     colors: ["Deep Purple", "Gold", "Silver", "Space Black"],
//     storage: ["128GB", "256GB", "512GB", "1TB"],
//     inStock: true,
//     releaseYear: 2022,
//   },
//   {
//     id: "iphone-15",
//     name: "iPhone 15",
//     description:
//       "Dynamic Island, USB-C, and A16 Bionic for amazing performance.",
//     price: 880000,
//     category: "iPhone",
//     image: iphone15,
//     colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
//     storage: ["128GB", "256GB", "512GB"],
//     inStock: true,
//     releaseYear: 2023,
//   },
//   {
//     id: "iphone-15-pro",
//     name: "iPhone 15 Pro",
//     description:
//       "Titanium design, A17 Pro chip, and next-gen camera system.",
//     price: 1050000,
//     category: "iPhone",
//     image: iphone15Pro,
//     colors: [
//       "Natural Titanium",
//       "Blue Titanium",
//       "White Titanium",
//       "Black Titanium",
//     ],
//     storage: ["128GB", "256GB", "512GB", "1TB"],
//     inStock: true,
//     releaseYear: 2023,
//   },
//   {
//     id: "iphone-16",
//     name: "iPhone 16",
//     description:
//       "Upgraded A18 chip, improved battery life, and stunning Super Retina XDR display.",
//     price: 960000,
//     category: "iPhone",
//     image: iphone16,
//     colors: ["Black", "White", "Pink", "Blue", "Mint"],
//     storage: ["128GB", "256GB", "512GB"],
//     inStock: true,
//     releaseYear: 2024,
//   },
//   {
//     id: "iphone-16-pro",
//     name: "iPhone 16 Pro",
//     description:
//       "A18 Pro chip, thinner bezels, and advanced camera system for pro creators.",
//     price: 1180000,
//     category: "iPhone",
//     image: iphone16Pro,
//     colors: [
//       "Natural Titanium",
//       "Desert Titanium",
//       "Black Titanium",
//       "White Titanium",
//     ],
//     storage: ["256GB", "512GB", "1TB"],
//     inStock: true,
//     releaseYear: 2024,
//   },
//   {
//     id: "iphone-17",
//     name: "iPhone 17",
//     description:
//       "A19 chip with enhanced AI capabilities and ultra-bright Retina display.",
//     price: 1100000,
//     category: "iPhone",
//     image: iphone17,
//     colors: ["Black", "Silver", "Sky Blue", "Blush Pink"],
//     storage: ["128GB", "256GB", "512GB"],
//     inStock: true,
//     releaseYear: 2025,
//   },
//   {
//     id: "iphone-17-pro",
//     name: "iPhone 17 Pro",
//     description:
//       "A19 Pro chip, revolutionary camera, and all-new ProMotion Ultra display.",
//     price: 1350000,
//     category: "iPhone",
//     image: iphone17Pro,
//     colors: ["Titanium Gray", "Sandstone", "Blue Titanium", "Obsidian Black"],
//     storage: ["256GB", "512GB", "1TB", "2TB"],
//     inStock: true,
//     releaseYear: 2025,
//   },
// ];
