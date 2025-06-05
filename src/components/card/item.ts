export interface Item {
  id: string;
  name: string;
  imgPath?: string;
}

export interface CeldaItem {
  id: string;
  quantity: number;
  Celda: {
    id: string;
    name: string;
  };
}
