import type { ProductType } from "@/types/types";

export { categories } from "./categories";

export const products: ProductsType = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    description: "A timeless white t-shirt made from 100% organic cotton.",
    images: ["/assets/products/1g.png", "/assets/products/1gr.png", "/assets/products/1p.png"],
    colors: [{
      name: "Gray",
      code: "#808080",
    }, {
      name: "Green",
      code: "#22c55e",
    }, {
      name: "Purple",
      code: "#a855f7",
    }],
    category: "T-Shirts",
    isNew: true,
    isFeatured: true,
    isArchived: false,
    createdAt: "2024-06-01T10:00:00Z",
    sizes: [
      {
        size: "S",
        price: 19.99,
        discount: 0,
        variants: [
          { color: "Gray", colorCode: "#808080", image: "/assets/products/1g.png", stock: 10 },
          { color: "Green", colorCode: "#22c55e", image: "/assets/products/1gr.png", stock: 5 },
        ]
      },
      {
        size: "M",
        price: 21.99,
        discount: 2, // $2 off for Medium
        variants: [
          { color: "Gray", colorCode: "#808080", image: "/assets/products/1g.png", stock: 15 },
          { color: "Green", colorCode: "#22c55e", image: "/assets/products/1gr.png", stock: 8 },
          { color: "Purple", colorCode: "#a855f7", image: "/assets/products/1p.png", stock: 0 },
        ]
      },
      {
        size: "L",
        price: 23.99,
        discount: 0,
        variants: [
          { color: "Gray", colorCode: "#808080", image: "/assets/products/1g.png", stock: 12 },
          { color: "Purple", colorCode: "#a855f7", image: "/assets/products/1p.png", stock: 3 },
        ]
      },
      {
        size: "XL",
        price: 25.99,
        discount: 3, // $3 off for XL
        variants: [
          { color: "Gray", colorCode: "#808080", image: "/assets/products/1g.png", stock: 8 },
          { color: "Green", colorCode: "#22c55e", image: "/assets/products/1gr.png", stock: 4 },
          { color: "Purple", colorCode: "#a855f7", image: "/assets/products/1p.png", stock: 6 },
        ]
      },
    ],
  },
  {
    id: 2,
    name: "Designer Coffee Mug",
    description: "Beautiful ceramic mug perfect for your morning coffee or tea.",
    imageSrc: "",
    images: ["/assets/products/mug-blue.png", "/assets/products/mug-red.png", "/assets/products/mug-white.png"],
    colors: [{
      name: "Blue",
      code: "#3b82f6",
    }, {
      name: "Red",
      code: "#ef4444",
    }, {
      name: "White",
      code: "#ffffff",
    }],
    category: "Accessories",
    isNew: false,
    isFeatured: true,
    isArchived: false,
    createdAt: "2024-05-15T09:30:00Z",
    // Standalone product - no size variations, just colors
    sizes: [
      {
        size: "One Size",
        price: 14.99,
        discount: 3,
        variants: [
          { color: "Blue", colorCode: "#3b82f6", image: "/assets/products/mug-blue.png", stock: 20 },
          { color: "Red", colorCode: "#ef4444", image: "/assets/products/mug-red.png", stock: 15 },
          { color: "White", colorCode: "#ffffff", image: "/assets/products/mug-white.png", stock: 25 },
        ]
      }
    ],
  },
  {
    id: 3,
    name: "Premium Cotton Polo",
    description: "Elegant polo shirt with breathable fabric and modern fit.",
    imageSrc: "",
    images: ["/assets/products/polo-navy.png", "/assets/products/polo-white.png"],
    colors: [{
      name: "Navy",
      code: "#1e3a8a",
    }, {
      name: "White",
      code: "#ffffff",
    }],
    category: "T-Shirts",
    isNew: true,
    isFeatured: false,
    isArchived: false,
    createdAt: "2024-06-10T14:20:00Z",
    sizes: [
      {
        size: "S",
        price: 29.99,
        variants: [
          { color: "Navy", colorCode: "#1e3a8a", image: "/assets/products/polo-navy.png", stock: 12 },
        ]
      },
      {
        size: "M",
        price: 29.99,
        variants: [
          { color: "Navy", colorCode: "#1e3a8a", image: "/assets/products/polo-navy.png", stock: 18 },
          { color: "White", colorCode: "#ffffff", image: "/assets/products/polo-white.png", stock: 15 },
        ]
      },
      {
        size: "L",
        price: 31.99,
        discount: 5, // Special discount on Large
        variants: [
          { color: "Navy", colorCode: "#1e3a8a", image: "/assets/products/polo-navy.png", stock: 10 },
          { color: "White", colorCode: "#ffffff", image: "/assets/products/polo-white.png", stock: 8 },
        ]
      },
    ],
  },
];

export const brands: string[] = Array.from(
  new Set(products.map((product) => product.brand)),
);
