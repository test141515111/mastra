import { z } from 'zod';
import { SchemaDefinition } from '../types';

/**
 * Create a Zod schema from a schema definition
 */
export function createZodSchema(schema: SchemaDefinition): any {
  switch (schema.type) {
    case 'object':
      if (!schema.properties) {
        return z.object({});
      }
      
      const shape: Record<string, any> = {};
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const zodProp = createZodSchema(propSchema);
        shape[key] = schema.required?.includes(key) ? zodProp : zodProp.optional();
      }
      
      return z.object(shape);
      
    case 'array':
      if (!schema.items) {
        return z.array(z.any());
      }
      return z.array(createZodSchema(schema.items));
      
    case 'string':
      return z.string();
      
    case 'number':
      return z.number();
      
    case 'boolean':
      return z.boolean();
      
    case 'null':
      return z.null();
      
    default:
      return z.any();
  }
}
