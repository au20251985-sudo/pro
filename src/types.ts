export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  specs: {
    cpu?: string;
    ram?: string;
    storage: string;
    gpu?: string;
    display: string;
    camera?: string;
    battery?: string;
  };
  image: string;
  category: 'Gaming' | 'O\'qish' | 'Biznes' | 'Universal' | 'Telefon';
  description: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}
