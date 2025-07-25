/**
 * User entity for authentication and user management
 */
export class User {
  /**
   * Gets the current logged in user
   * @returns {Promise<Object>} The user object
   */
  static async me() {
    // Mock implementation - in a real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          full_name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin', // or 'user'
        });
      }, 500);
    });
  }

  /**
   * Logs the user out
   * @returns {Promise<void>}
   */
  static async logout() {
    // Mock implementation - in a real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }
}
