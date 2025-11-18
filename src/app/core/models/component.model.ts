export interface ComponentProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'spacing' | 'typography';
  defaultValue: any;
  options?: string[];
  validation?: PropertyValidation;
}

export interface PropertyValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface ComponentDefinition {
  id: string;
  type: string;
  name: string;
  icon: string;
  category: 'layout' | 'content' | 'form' | 'media';
  properties: ComponentProperty[];
  canHaveChildren: boolean;
  defaultProps: Record<string, any>;
}

export interface ComponentInstance {
  id: string;
  type: string;
  props: Record<string, any>;
  children: ComponentInstance[];
  parentId?: string;
  order: number;
}

export interface ResponsiveMode {
  mode: 'desktop' | 'tablet' | 'mobile';
  width: number;
}
