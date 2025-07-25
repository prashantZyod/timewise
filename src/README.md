# TimeWise Data Management Architecture

## Overview

This project implements a clean separation of concerns for data management with three key layers:

1. **Entity Models** - Core data structures with validation and basic CRUD operations
2. **API Services** - Business logic and backend integration layer
3. **Context Providers** - Global state management for React components

## Architecture Layers

### Entity Models (`src/entities/`)

Entity models define the structure and validation rules for each data type. They are implemented as classes with:

- Constructor for data validation and initialization
- Static methods for CRUD operations (create, read, update, delete)
- Domain-specific methods related to the entity

Example entity structure:
```javascript
class Entity {
  constructor(data) {
    // Validate and initialize data
  }
  
  // Static CRUD methods
  static getAll() {}
  static getById(id) {}
  static create(data) {}
  static update(id, data) {}
  static delete(id) {}
  
  // Domain-specific methods
  someEntitySpecificMethod() {}
}
```

### API Services (`src/services/`)

Service modules wrap entity operations and provide:

- Error handling
- API integration logic
- Business logic that spans multiple entities
- Future integration with backend services

Example service structure:
```javascript
class EntityService {
  // CRUD operations
  static async getAll() {}
  static async getById(id) {}
  static async create(data) {}
  static async update(id, data) {}
  static async delete(id) {}
  
  // Additional service methods
  static async specializedOperation() {}
}
```

### Context Providers (`src/contexts/`)

Context providers manage global state for React components:

- Create and expose React Context
- Manage state with useState/useReducer
- Provide actions to modify state
- Handle side effects with useEffect
- Expose custom hooks for component access

Example context structure:
```javascript
// Context creation
const EntityContext = createContext();

// Provider component
export const EntityProvider = ({ children }) => {
  const [state, setState] = useState([]);
  
  // Actions and side effects
  const fetchData = useCallback(async () => {}, []);
  
  return (
    <EntityContext.Provider value={{ state, actions }}>
      {children}
    </EntityContext.Provider>
  );
};

// Custom hook
export const useEntity = () => {
  const context = useContext(EntityContext);
  if (context === undefined) {
    throw new Error('useEntity must be used within EntityProvider');
  }
  return context;
};
```

## Usage in Components

Components should access data through context hooks:

```javascript
import { useStaff, useBranch, useAttendance } from '../contexts';

function MyComponent() {
  const { staffMembers, createStaff } = useStaff();
  const { branches } = useBranch();
  
  // Use the data and actions in your component
}
```

## Benefits

- **Separation of Concerns**: Each layer has a specific responsibility
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new entities or services
- **Backend Integration**: Service layer abstracts API communication
- **Code Reusability**: Logic is not duplicated across components
