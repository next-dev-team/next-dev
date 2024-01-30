/**
 * Checks if the input is an instance of FormData
 * @param form - The input to check
 * @returns True if the input is an instance of FormData, otherwise false
 */
const isFormData = (form: unknown): form is FormData =>
  form instanceof FormData;

export default isFormData;
