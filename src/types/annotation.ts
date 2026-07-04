export interface ImageModel {
  id: number;
  image: string;
  user: number;
  created_at: string;
}

export interface Annotation {
  id: number;
  image: number;
  polygon_points: { x: number; y: number }[];
  user: number;
  created_at: string;
}
