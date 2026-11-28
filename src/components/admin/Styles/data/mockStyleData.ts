export interface IDepartmentItem {
  id: string;
  department: string;
  numberOfStyles: number;
  numberOfColorways: number;
  categories: string[];
}

export interface ICategoryStyleItem {
  id: string;
  category: string;
  numberOfStyles: number;
  numberOfColorways: number;
  season: string;
  department: string;
}

export interface IArticleItem {
  style: string;
  fit: string;
  image: string;
  month: string;
  retailPrice: string;
  fob: string;
  activeColor: string;
  sizeRange: string;
  fabric: string;
  fabricDescription: string;
  composition: string;
  promoteStatus: string;
  assignedBranch: string;
  packingCode: string;
  transportMode: string;
  supplier: string;
  exDelivery: string;
  sustainability: string;
  // Structured classification, sourced from the real Categories/Brands/
  // Color-Size chart modules — optional so legacy rows without them still work.
  seasonId?: string;
  categoryId?: string;
  segmentId?: string;
  subCategoryId?: string;
  brandId?: string;
  colorIds?: string[];
  sizeIds?: string[];
}

export const mockDepartmentsList: IDepartmentItem[] = [
  {
    id: "women",
    department: "Women",
    numberOfStyles: 150,
    numberOfColorways: 600,
    categories: [
      "Blouses", "Shirts", "T-Shirts", "Polo Shirts", "Sweatshirts", "Sweatshirt Jacke",
      "Indoor jackets", "Indoor Blazer", "Indoor-Sakko", "Indoor-Weste", "Outdoor jackets",
      "Outdoor-Coat", "Outdoor-Weste", "Outdoor-Poncho", "Outdoor-Umhang", "Knitwear",
      "Knitted sweater", "Knitted Vest", "Knitted Cardigan", "Knitted twinset", "Pants",
      "Jeans pants", "Skirts", "One-pieces/Dresses", "Underwear", "Swimwear", "Accessories",
      "Socks/Hosiery", "Daywear", "Hats", "Baggage"
    ],
  },
  {
    id: "men",
    department: "Men",
    numberOfStyles: 120,
    numberOfColorways: 370,
    categories: [
      "Shirts", "T-Shirts", "Polo Shirts", "Sweatshirts", "Sweatshirt Jacke", "Indoor jackets",
      "Indoor Blazer", "Indoor-Sakko", "Indoor-Weste", "Outdoor jackets", "Outdoor-Coat",
      "Outdoor-Weste", "Outdoor-Poncho", "Outdoor-Umhang", "Knitwear", "Knitted sweater",
      "Knitted Vest", "Knitted Cardigan", "Knitted twinset", "Pants", "Jeans pants",
      "One-pieces/Dresses", "Underwear", "Swimwear", "Accessories", "Socks/Hosiery",
      "Daywear", "Hats", "Baggage"
    ],
  },
  {
    id: "kids",
    department: "Kids",
    numberOfStyles: 80,
    numberOfColorways: 150,
    categories: [
      "Blouses", "Shirts", "T-Shirts", "Polo Shirts", "Sweatshirts", "Sweatshirt Jacke",
      "Indoor jackets", "Indoor", "Outdoor", "jackets", "Knitwear", "Sweater", "Pants",
      "Jeans pants", "Skirts", "One-pieces/Dresses", "Underwear", "Swimwear", "Accessories",
      "Socks/Hosiery", "Daywear", "Hats", "School Bag"
    ],
  },
  {
    id: "home",
    department: "Home",
    numberOfStyles: 15,
    numberOfColorways: 40,
    categories: ["Curtains", "Home Cloths", "Back Pack"],
  },
  {
    id: "specials",
    department: "Specials",
    numberOfStyles: 15,
    numberOfColorways: 15,
    categories: ["Fine Jewelry", "Fashion Jewelry", "Fragrances", "Flags"],
  },
  {
    id: "gifts",
    department: "Gifts",
    numberOfStyles: 15,
    numberOfColorways: 15,
    categories: ["Gift Cards", "Pens", "Mugs", "Water Bottle", "Key ring"],
  },
];

export const mockCategoryStylesList: ICategoryStyleItem[] = [
  { id: "blouses", category: "Blouses", numberOfStyles: 10, numberOfColorways: 15, season: "2027 Main Collection", department: "Women" },
  { id: "shirts", category: "Shirts", numberOfStyles: 10, numberOfColorways: 15, season: "2027 Main Collection", department: "Men" },
  { id: "t-shirts", category: "T-Shirts", numberOfStyles: 10, numberOfColorways: 15, season: "2027 Main Collection", department: "Men" },
  { id: "polo-shirts", category: "Polo Shirts", numberOfStyles: 10, numberOfColorways: 15, season: "2027 Main Collection", department: "Men" },
  { id: "sweatshirts", category: "Sweatshirts", numberOfStyles: 10, numberOfColorways: 15, season: "2027 Main Collection", department: "Men" },
  { id: "sweatshirt-jacke", category: "Sweatshirts Jacke", numberOfStyles: 10, numberOfColorways: 15, season: "2027 Main Collection", department: "Men" },
  { id: "indoor-jackets", category: "Indoor Jackets", numberOfStyles: 10, numberOfColorways: 15, season: "2027 Main Collection", department: "Men" },
  { id: "indoor-blazer", category: "Indoor Blazer", numberOfStyles: 10, numberOfColorways: 15, season: "2027 Main Collection", department: "Men" },
];

export const mockArticlesListGrouped: { month: string; count: number; items: IArticleItem[] }[] = [
  {
    month: "January",
    count: 10,
    items: [
      {
        style: "212632",
        fit: "Slim",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
        month: "702",
        retailPrice: "14.99€",
        fob: "150BDT",
        activeColor: "0100, 5978",
        sizeRange: "Letter Size",
        fabric: "FA-CK-01",
        fabricDescription: "Single Jersey, 100% BCI",
        composition: "80% Cotton, 20% Polyester",
        promoteStatus: "Concept",
        assignedBranch: "Dhaka",
        packingCode: "EI",
        transportMode: "L",
        supplier: "Square",
        exDelivery: "25.11.26",
        sustainability: "Re-cycled",
      },
      {
        style: "212633",
        fit: "Regular",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=200&q=80",
        month: "702",
        retailPrice: "18.99€",
        fob: "180BDT",
        activeColor: "0100, 4402",
        sizeRange: "Letter Size",
        fabric: "FA-CK-02",
        fabricDescription: "Pique Cotton, 100% Organic",
        composition: "100% Cotton",
        promoteStatus: "Development",
        assignedBranch: "Chittagong",
        packingCode: "EI",
        transportMode: "A",
        supplier: "Beximco",
        exDelivery: "10.12.26",
        sustainability: "Organic Cotton",
      },
    ],
  },
  {
    month: "February",
    count: 1,
    items: [
      {
        style: "212634",
        fit: "Oversized",
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=200&q=80",
        month: "703",
        retailPrice: "24.99€",
        fob: "210BDT",
        activeColor: "5978, 8820",
        sizeRange: "Letter Size",
        fabric: "FA-CK-05",
        fabricDescription: "Heavy Jersey 240GSM",
        composition: "100% Cotton",
        promoteStatus: "Approved",
        assignedBranch: "Dhaka",
        packingCode: "FL",
        transportMode: "S",
        supplier: "Ha-Meem",
        exDelivery: "15.01.27",
        sustainability: "Re-cycled Poly",
      },
    ],
  },
];
