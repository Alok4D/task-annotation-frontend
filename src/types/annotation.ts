export interface ImageModel {
  id: number;
  image: string;
  user: number;
  created_at: string;
}

export interface EraserLine {
  points: number[];
  size: number;
}

export type PenType = 'BALLPEN' | 'CALLIGRAPHY' | 'HIGHLIGHTER' | 'MARKER' | 'PENCIL';
export type LineStyle = 'SOLID' | 'DASHED' | 'DOTTED';

export interface PenLine {
  points: number[];
  size: number;
  color: string;
  type: PenType;
  style: LineStyle;
}

export interface Annotation {
  id: number;
  image: number;
  polygon_points: { x: number; y: number }[];
  eraser_lines?: EraserLine[];
  pen_lines?: PenLine[];
  user: number;
  created_at: string;
}
