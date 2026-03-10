import { fal } from "@fal-ai/client";

// The API Key needs to be set either via env var or manually configured.
// For browser demonstrations, we can configure it manually.
// WARNING: In production, do not expose your API key in the client application.
// You should use a server-side proxy to keep your credentials secure.

const FAL_KEY = "b1ecdc80-2833-4ac9-85fd-21baa139c58e:6a9b82016232bd0a912d72d5ef3c5291";

fal.config({
  credentials: FAL_KEY,
});

export { fal };

/**
 * Utility function to convert a File object to a Base64 string.
 * This can be used if we want to pass a data URI directly to Fal AI instead of uploading.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
