/**
 * Mock integration for file uploads
 */
export const UploadFile = async (file, destination) => {
  // Mock implementation that simulates file upload
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would upload to a storage service and return a URL
      const mockUrl = `https://example.com/uploads/${destination}/${file.name}`;
      resolve(mockUrl);
    }, 1500);
  });
};
