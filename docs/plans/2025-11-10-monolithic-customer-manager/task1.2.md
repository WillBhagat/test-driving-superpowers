# Task 1.2: Implement Mock API Service

**Agent Context:** You are creating a mock backend API service that simulates realistic server behavior with delays and error handling. This service will be used for all CRUD operations until a real backend is implemented.

**Behavior:** Create an apiService object with methods for fetching, creating, updating, and deleting customers. Each method should simulate network delay and return promises.

**Acceptance Criteria:**
- Given the need for simulated backend operations
- When calling apiService methods
- Then each method returns a Promise that resolves after 1-2 seconds
- And fetchCustomers() returns array of mock customers wrapped in ApiResponse
- And createCustomer(customer) adds new customer and returns it in ApiResponse
- And updateCustomer(id, updates) updates existing customer and returns it in ApiResponse
- And deleteCustomer(id) removes customer and returns success ApiResponse
- And all methods use the Customer and ApiResponse<T> interfaces from Task 1.1

**Test Scenarios:**
- **Happy path:** Each CRUD operation completes successfully after delay
- **Data persistence:** Mock data should persist across calls during component lifetime (use module-level array)
- **ID generation:** createCustomer generates unique IDs (use UUID or timestamp)
- **Update validation:** updateCustomer only updates if customer exists
- **Delete validation:** deleteCustomer only succeeds if customer exists
- **Error cases:** Methods return ApiResponse with success: false for invalid operations

**Agent-Specific Context:**
- **File to modify:** `src/components/CustomerManager.tsx` (add apiService after interfaces)
- **Tests to create:** None for this subtask (will be tested through integration)
- **Dependencies available:** Customer, ValidationError, ApiResponse interfaces from Task 1.1
- **Interfaces to provide:** apiService object with methods: fetchCustomers(), createCustomer(), updateCustomer(), deleteCustomer()

**Architecture Constraints:**
- Define apiService as a plain JavaScript object with methods
- Place apiService after interfaces, before component definition
- Use setTimeout to simulate 1000-2000ms network delay
- Store mock data in a module-level array (let mockCustomers: Customer[] = [...])
- Include 2-3 sample customers in initial mock data
- All methods must return Promise<ApiResponse<appropriate-type>>
- Generate IDs using Date.now() or crypto.randomUUID()

**Definition of Done:**
- apiService object defined with all four CRUD methods
- Each method has realistic delay simulation
- Methods manipulate shared mockCustomers array
- All methods return properly typed ApiResponse promises
- Initial mock data includes 2-3 sample customers
- Code is placed correctly in file after interfaces
