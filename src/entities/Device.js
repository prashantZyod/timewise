/**
 * Device Entity
 * Represents the data structure and operations for devices used for attendance
 */
class Device {
  /**
   * Create a new Device instance
   * @param {Object} data - Device data
   * @param {string} data.id - Unique identifier for the device
   * @param {string} data.name - Device name
   * @param {string} data.type - Device type (e.g., "tablet", "kiosk", "mobile")
   * @param {string} data.serial_number - Device serial number
   * @param {string} data.branch_id - ID of the branch where device is located
   * @param {string} data.location - Specific location within the branch
   * @param {string} data.ip_address - Device IP address
   * @param {string} data.mac_address - Device MAC address
   * @param {boolean} data.is_active - Whether the device is active
   * @param {Date} data.last_ping - Last time the device was online
   */
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || '';
    this.type = data.type || 'tablet';
    this.serial_number = data.serial_number || '';
    this.brand = data.brand || '';
    this.model = data.model || '';
    this.os = data.os || '';
    this.os_version = data.os_version || '';
    this.branch_id = data.branch_id || '';
    this.location = data.location || '';
    this.ip_address = data.ip_address || '';
    this.mac_address = data.mac_address || '';
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.last_ping = data.last_ping ? new Date(data.last_ping) : new Date();
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
    
    // Geolocation data
    this.latitude = data.latitude || null;
    this.longitude = data.longitude || null;
    this.last_location_update = data.last_location_update ? new Date(data.last_location_update) : null;
    
    // Device verification and approval properties
    this.user_id = data.user_id || null;
    this.fingerprint = data.fingerprint || null;
    this.user_agent = data.user_agent || navigator.userAgent;
    this.status = data.status || 'pending'; // pending, approved, rejected
    this.is_approved = data.is_approved !== undefined ? data.is_approved : false;
    this.approvedAt = data.approvedAt ? new Date(data.approvedAt) : null;
    this.rejectedAt = data.rejectedAt ? new Date(data.rejectedAt) : null;
    this.approval_notes = data.approval_notes || '';
    this.last_login_date = data.last_login_date ? new Date(data.last_login_date) : null;
  }

  /**
   * Get a device by ID
   * @param {string} id - The device ID
   * @returns {Promise<Device|null>} - Returns a promise with device or null
   */
  static async getById(id) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const deviceData = JSON.parse(localStorage.getItem('devices') || '[]');
        const device = deviceData.find(d => d.id === id);
        resolve(device ? new Device(device) : null);
      }, 300);
    });
  }

  /**
   * Get all devices
   * @returns {Promise<Device[]>} - Returns a promise with device array
   */
  static async getAll() {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const deviceData = JSON.parse(localStorage.getItem('devices') || '[]');
        resolve(deviceData.map(data => new Device(data)));
      }, 300);
    });
  }

  /**
   * List devices with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Device[], total: number, page: number, limit: number}>} - Paginated result
   */
  static async list(page = 1, limit = 10) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const deviceData = JSON.parse(localStorage.getItem('devices') || '[]');
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = deviceData.slice(startIndex, endIndex);
        
        resolve({
          data: paginatedData.map(data => new Device(data)),
          total: deviceData.length,
          page,
          limit
        });
      }, 300);
    });
  }

  /**
   * Create a new device
   * @param {Object} data - Device data
   * @returns {Promise<Device>} - Created device
   */
  static async create(data) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const device = new Device(data);
        const deviceData = JSON.parse(localStorage.getItem('devices') || '[]');
        deviceData.push(device);
        localStorage.setItem('devices', JSON.stringify(deviceData));
        resolve(device);
      }, 300);
    });
  }

  /**
   * Update a device
   * @param {string} id - The device ID
   * @param {Object} data - The data to update
   * @returns {Promise<Device>} Updated device
   */
  static async update(id, data) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const deviceData = JSON.parse(localStorage.getItem('devices') || '[]');
        const index = deviceData.findIndex(device => device.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        // Update the device data
        const updatedDevice = {
          ...deviceData[index],
          ...data,
          updated_at: new Date()
        };
        
        deviceData[index] = updatedDevice;
        localStorage.setItem('devices', JSON.stringify(deviceData));
        
        resolve(new Device(updatedDevice));
      }, 300);
    });
  }

  /**
   * Delete a device
   * @param {string} id - The device ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const deviceData = JSON.parse(localStorage.getItem('devices') || '[]');
        const filteredDevices = deviceData.filter(device => device.id !== id);
        
        if (filteredDevices.length === deviceData.length) {
          resolve(false);
          return;
        }
        
        localStorage.setItem('devices', JSON.stringify(filteredDevices));
        resolve(true);
      }, 300);
    });
  }
  
  /**
   * Filter device records based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Device[]>} - Returns a promise with filtered device array
   */
  static async filter(criteria) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const deviceData = JSON.parse(localStorage.getItem('devices') || '[]');
        
        const filtered = deviceData.filter(device => {
          return Object.entries(criteria).every(([key, value]) => {
            // Handle string case-insensitive search
            if (typeof value === 'string' && typeof device[key] === 'string') {
              return device[key].toLowerCase().includes(value.toLowerCase());
            }
            // Handle exact match
            return device[key] === value;
          });
        });
        
        resolve(filtered.map(data => new Device(data)));
      }, 300);
    });
  }
  
  /**
   * Update device status (ping)
   * @param {string} id - The device ID
   * @returns {Promise<Device>} Updated device
   */
  static async ping(id) {
    return Device.update(id, { last_ping: new Date() });
  }

  /**
   * Get devices by branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Device[]>} - Returns a promise with devices array
   */
  static async getByBranch(branchId) {
    return Device.filter({ branch_id: branchId });
  }
}

/**
 * Initialize sample device data for testing and demo
 */
export const initializeSampleDevices = () => {
  const existingDevices = JSON.parse(localStorage.getItem('devices') || '[]');
  
  if (existingDevices.length === 0) {
    const sampleDevices = [
      {
        id: "device-001",
        name: "Reception Tablet",
        type: "tablet",
        brand: "Samsung",
        model: "Galaxy Tab S7",
        os: "Android",
        os_version: "12",
        serial_number: "SAMS7T12345",
        branch_id: "branch-001",
        location: "Front Desk",
        ip_address: "192.168.1.101",
        mac_address: "00:1A:2B:3C:4D:5E",
        is_active: true,
        last_ping: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        latitude: 40.7128,
        longitude: -74.0060,
        last_location_update: new Date(),
        user_id: "staff-001",
        status: "approved",
        is_approved: true,
        approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        user_agent: "Mozilla/5.0 (Linux; Android 12; Galaxy Tab S7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
      },
      {
        id: "device-002",
        name: "Sales Floor Kiosk",
        type: "kiosk",
        brand: "Lenovo",
        model: "ThinkCentre M70q",
        os: "Windows",
        os_version: "11",
        serial_number: "LEN70Q67890",
        branch_id: "branch-001",
        location: "Sales Floor",
        ip_address: "192.168.1.102",
        mac_address: "00:2C:3D:4E:5F:6G",
        is_active: true,
        last_ping: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        latitude: 40.7138,
        longitude: -74.0070,
        last_location_update: new Date(),
        user_id: "staff-002",
        status: "approved",
        is_approved: true,
        approvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        user_agent: "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
      },
      {
        id: "device-003",
        name: "Manager's iPhone",
        type: "mobile",
        brand: "Apple",
        model: "iPhone 13",
        os: "iOS",
        os_version: "15.2",
        serial_number: "APPL13XYZ789",
        branch_id: "branch-002",
        location: "Mobile",
        ip_address: "192.168.1.103",
        mac_address: "00:3D:4E:5F:6G:7H",
        is_active: true,
        last_ping: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        latitude: 40.7150,
        longitude: -74.0080,
        last_location_update: new Date(),
        user_id: "staff-003",
        status: "pending",
        is_approved: false,
        user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1"
      },
      {
        id: "device-004",
        name: "Warehouse Scanner",
        type: "scanner",
        brand: "Zebra",
        model: "TC52",
        os: "Android",
        os_version: "10",
        serial_number: "ZEBRA52SCAN123",
        branch_id: "branch-003",
        location: "Warehouse",
        ip_address: "192.168.1.104",
        mac_address: "00:4E:5F:6G:7H:8I",
        is_active: false,
        last_ping: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        latitude: 40.7160,
        longitude: -74.0090,
        last_location_update: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        user_id: "staff-004",
        status: "rejected",
        is_approved: false,
        rejectedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        approval_notes: "Device failed security scan",
        user_agent: "Mozilla/5.0 (Linux; Android 10; TC52) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36"
      },
      {
        id: "device-005",
        name: "New Employee iPad",
        type: "tablet",
        brand: "Apple",
        model: "iPad Pro",
        os: "iPadOS",
        os_version: "15.1",
        serial_number: "IPADPRO987654",
        branch_id: "branch-002",
        location: "Training Room",
        ip_address: "192.168.1.105",
        mac_address: "00:5F:6G:7H:8I:9J",
        is_active: true,
        last_ping: new Date(),
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(),
        latitude: 40.7170,
        longitude: -74.0100,
        last_location_update: new Date(),
        user_id: "staff-005",
        status: "pending",
        is_approved: false,
        user_agent: "Mozilla/5.0 (iPad; CPU OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1"
      }
    ];
    
    localStorage.setItem('devices', JSON.stringify(sampleDevices));
    return sampleDevices;
  }
  
  return existingDevices;
};

export default Device;
