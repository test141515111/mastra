import { z } from 'zod';

/**
 * Convert a plain schema object to a Zod schema
 */
export function createZodSchema(schemaObj: Record<string, any>): z.ZodTypeAny {
  const schemaEntries = Object.entries(schemaObj).map(([key, value]) => {
    let fieldSchema: z.ZodTypeAny;
    
    switch (value.type) {
      case 'string':
        fieldSchema = z.string();
        break;
      case 'number':
        fieldSchema = z.number();
        break;
      case 'boolean':
        fieldSchema = z.boolean();
        break;
      case 'array':
        fieldSchema = z.array(createZodSchema(value.items));
        break;
      case 'object':
        fieldSchema = createZodSchema(value.properties);
        break;
      default:
        fieldSchema = z.any();
    }
    
    // Apply optional modifier if specified
    if (value.optional) {
      fieldSchema = fieldSchema.optional();
    }
    
    return [key, fieldSchema];
  });
  
  return z.object(Object.fromEntries(schemaEntries));
}

/**
 * Parse a JSON string into a schema object
 */
export function parseSchemaJson(jsonString: string): Record<string, any> {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Invalid schema JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate input against a schema
 */
export function validateWithSchema(schema: z.ZodTypeAny, input: any): any {
  return schema.parse(input);
}
