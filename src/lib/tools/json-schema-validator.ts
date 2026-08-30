import Ajv from "ajv";

let _ajv: Ajv | null = null;
function getAjv() {
  if (!_ajv) _ajv = new Ajv({ allErrors: true, strict: false });
  return _ajv;
}

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  error: string | null;
};

export function validateJsonSchema(schemaStr: string, dataStr: string): ValidationResult {
  try {
    if (!schemaStr.trim() || !dataStr.trim()) return { valid: false, errors: [], error: null };
    const schema = JSON.parse(schemaStr);
    const data = JSON.parse(dataStr);
    const validate = getAjv().compile(schema);
    const valid = validate(data) as boolean;
    const errors = valid ? [] : (validate.errors ?? []).map(e => `${e.instancePath || "root"}: ${e.message}`);
    return { valid, errors, error: null };
  } catch (e) {
    return { valid: false, errors: [], error: e instanceof Error ? e.message : "Validation failed" };
  }
}
