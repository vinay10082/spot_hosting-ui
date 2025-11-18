import { Injectable } from '@angular/core';
import { ComponentDefinition, ComponentInstance } from '../models/component.model';
import { COMPONENT_DEFINITIONS } from '../../shared/constants/component-definitions';

@Injectable({
  providedIn: 'root'
})
export class ComponentRegistryService {
  private definitions: ComponentDefinition[] = COMPONENT_DEFINITIONS;

  get componentsByCategory(): Record<string, ComponentDefinition[]> {
    const categorized: Record<string, ComponentDefinition[]> = {
      layout: [],
      content: [],
      form: [],
      media: [],
    };

    this.definitions.forEach(comp => {
      categorized[comp.category].push(comp);
    });

    return categorized;
  }

  getDefinitionByType(type: string): ComponentDefinition | undefined {
    return this.definitions.find(def => def.type === type);
  }

  createInstance(type: string): ComponentInstance | null {
    const definition = this.getDefinitionByType(type);
    if (!definition) return null;

    return {
      id: this.generateId(),
      type: definition.type,
      props: { ...definition.defaultProps },
      children: [],
      order: 0
    };
  }

  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  validateProps(type: string, props: Record<string, any>): { valid: boolean; errors: string[] } {
    const definition = this.getDefinitionByType(type);
    if (!definition) {
      return { valid: false, errors: ['Component type not found'] };
    }

    const errors: string[] = [];

    definition.properties.forEach(prop => {
      const value = props[prop.name];
      
      if (prop.validation?.required && (value === undefined || value === null || value === '')) {
        errors.push(`${prop.name} is required`);
      }

      if (prop.type === 'number' && typeof value === 'number') {
        if (prop.validation?.min !== undefined && value < prop.validation.min) {
          errors.push(`${prop.name} must be at least ${prop.validation.min}`);
        }
        if (prop.validation?.max !== undefined && value > prop.validation.max) {
          errors.push(`${prop.name} must be at most ${prop.validation.max}`);
        }
      }

      if (prop.validation?.pattern && typeof value === 'string') {
        const regex = new RegExp(prop.validation.pattern);
        if (!regex.test(value)) {
          errors.push(`${prop.name} format is invalid`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  }
}
