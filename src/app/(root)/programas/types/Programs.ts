export interface Program {
  title: string;
  description: string;
  banners: Banners[];
}

export interface Banners {
  image: string;
  title: string;
  name: string;
}
