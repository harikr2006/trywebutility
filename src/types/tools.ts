export interface Tool {
  name: string;
  description: string;
  path: string;
  icon: string;
  category: ToolCategory;
  tags?: string[];
}

export type ToolCategory =
  | "Formatters & Validators"
  | "Encoders & Decoders"
  | "Converters"
  | "Generators"
  | "Testers & Analysis";
