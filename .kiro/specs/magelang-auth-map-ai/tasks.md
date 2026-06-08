# Implementation Tasks: Login & User Management, Smart Map Integration, AI Assistant

## Overview

Dokumen ini merupakan breakdown dari requirements menjadi implementasi tasks yang dapat dikerjakan secara paralel atau sekuensial. Setiap task memiliki acceptance criteria yang terukur dan mencakup property-based testing untuk critical components.

## Phase 1: Database Schema & Infrastructure Setup

### 1.1 Update Prisma Schema untuk User Management

- [ ] **Task**: Extend Prisma schema untuk support:
  - `User` model dengan fields: id, email, passwordHash, name, avatar, bio, createdAt, updatedAt, lastLogin, isVerified, isActive
  - `UserPreferences` model dengan fields: interests[], budgetLevel, mobilityLevel, maxSpendPerDay, distancePreference, language
  - `UserLocation` model dengan fields: id, userId, latitude, longitude, accuracy, altitude, speed, timestamp, source, deviceId
  - `SavedItinerary` model dengan fields: id, userId, title, description, duration, totalDistance, totalEstimatedCost, isCompleted, completedAt, rating, feedback, createdAt
  - Add indexes untuk performance (email, userId on locations, etc)
  - Add soft delete support (isDeleted flag) untuk User dan SavedItinerary

- [ ] **Acceptance Criteria**:
  - Prisma schema compiles without errors
  - All models have proper relationships (one-to-many, etc)
  - Unique constraints on email
  - Indexes on frequently queried fields
  - Migration generated and tested

- [ ] **Testing**:
  - Schema validates correct
  - Relationships work bidirectionally
  - Soft delete fields present

**Estimated Effort**: 2-3 hours

**Dependencies**: None

---

### 1.2 Setup Redis Cache Connection

- [ ] **Task**: Configure Redis connection untuk caching layer
  - Install `redis` package
  - Create RedisClient wrapper class
  - Configure connection pooling
  - Add environment variables (REDIS_URL, REDIS_PASSWORD)
  - Implement cache TTL strategies per data type
  - Add error handling dan fallback to in-memory cache

- [ ] **Acceptance Criteria**:
  - Redis connects successfully in dev environment
  - Cache set/get operations working
  - TTL honored correctly
  - Fallback works if Redis unavailable

- [ ] **Testing**:
  - Connection test passing
  - Set/get operations correct
  - TTL enforcement verified

**Estimated Effort**: 2-3 hours

**Dependencies**: Prisma schema update (1.1)

---

### 1.3 Setup OpenAI API Integration

- [ ] **Task**: Configure OpenAI API untuk AI recommendations
  - Install `openai` package
  - Create OpenAI client wrapper dengan error handling
  - Add environment variables (OPENAI_API_KEY)
  - Implement retry logic dengan exponential backoff
  - Add cost tracking per request
  - Implement prompt templates untuk itinerary generation

- [ ] **Acceptance Criteria**:
  - OpenAI API key configured correctly
  - Test prompt returns valid response
  - Error handling working
  - Retry logic tested

- [ ] **Testing**:
  - API call successful
  - Prompt templates generate expected responses
  - Error handling verified

**Estimated Effort**: 2-3 hours

**Dependencies**: None

---

## Phase 2: Authentication & User Management Backend

### 2.1 Implement AuthService - Login & Registration

**PBT Task**: ✅ Write property-based tests untuk authentication

- [ ] **Task**: Implement core auth service pada `backend/src/services/authService.ts`
  - Function: `register(email, password, name)`
    - Validate email format (RFC 5322)
    - Validate password strength (8+ chars, mixed case, number, special char)
    - Hash password dengan bcrypt (10 rounds minimum)
    - Create User record di Prisma
    - Return User object (tanpa password)
  - Function: `login(email, password)`
    - Query user by email
    - Verify password menggunakan bcrypt.compare()
    - Generate JWT access token (15 min expiry)
    - Generate JWT refresh token (7 days expiry)
    - Store refresh token ke database
    - Return tokens + user object
  - Function: `verifyToken(token)` - validate JWT
  - Function: `refreshAccessToken(refreshToken)` - issue new access token
  - Add password validation helper: `validatePasswordStrength(password): boolean`

- [ ] **Acceptance Criteria**:
  - register() creates user dengan hashed password
  - login() returns valid JWT tokens
  - Duplicate email rejected
  - Invalid password rejected
  - Token verification working

- [ ] **Property-Based Testing** (for correctness):
  ```
  PROPERTY 1: Password Hashing Determinism
  ∀ password ∈ ValidPasswords :
    hash1 = bcrypt.hash(password, 10)
    hash2 = bcrypt.hash(password, 10)
    bcrypt.compare(password, hash1) = true
    ∧ bcrypt.compare(password, hash2) = true
  
  PROPERTY 2: JWT Token Claims
  ∀ userId ∈ ValidUserIds :
    token = generateAccessToken(userId)
    claims = verifyToken(token)
    claims.userId = userId ∧ claims.iat < claims.exp
  
  PROPERTY 3: Password Strength Validation
  ∀ password ∈ Strings :
    validatePasswordStrength(password) = true
    ⟹ length(password) ≥ 8
      ∧ contains_uppercase(password)
      ∧ contains_lowercase(password)
      ∧ contains_digit(password)
      ∧ contains_special_char(password)
  ```

- [ ] **Testing Approach**:
  - Unit tests with Jest
  - Mock Prisma client
  - Property-based tests dengan fast-check untuk password validation
  - Test edge cases: empty fields, SQL injection attempts, very long inputs

**Estimated Effort**: 4-5 hours

**Dependencies**: Database schema (1.1)

---

### 2.2 Implement 2FA (TOTP) Setup

- [ ] **Task**: Implement 2FA support pada AuthService
  - Install `speakeasy` package (TOTP generation)
  - Function: `generate2FASecret(userId)` - generate QR code secret
  - Function: `verify2FACode(userId, code)` - validate TOTP code
  - Store 2FA secret encrypted pada User model
  - Generate backup codes (8 codes, store hashed)
  - Store used codes ke prevent replay attacks (Redis dengan short TTL)

- [ ] **Acceptance Criteria**:
  - QR code generated correctly
  - TOTP verification working within ±30 seconds
  - Replay attacks prevented
  - Backup codes functional

- [ ] **Testing**:
  - Generate 2FA secret produces valid QR code
  - Verify valid TOTP code passes
  - Verify invalid TOTP code fails
  - Replay attack prevented

**Estimated Effort**: 3-4 hours

**Dependencies**: AuthService (2.1), Redis setup (1.2)

---

### 2.3 Implement Password Reset Flow

- [ ] **Task**: Implement forgot password & reset password endpoints
  - Function: `forgotPassword(email)` - generate reset token, send email
    - Generate secure token (CSPRNG, 64 bytes)
    - Store token hash + userId + expiration (1 hour) di database
    - Send reset link via email (integration dengan email service)
    - Prevent user enumeration (return same success message)
  - Function: `resetPassword(token, newPassword)` - reset password
    - Validate token not expired
    - Validate new password strength
    - Hash new password
    - Update User.passwordHash
    - Invalidate all existing refresh tokens (force re-login)
    - Delete reset token

- [ ] **Acceptance Criteria**:
  - Reset token generated securely
  - Email sent correctly
  - Token expires after 1 hour
  - Password updated correctly
  - All sessions invalidated

- [ ] **Testing**:
  - Reset token generated
  - Email sending (mock)
  - Token validation working
  - Password update persisted

**Estimated Effort**: 3-4 hours

**Dependencies**: AuthService (2.1), Email service setup

---

### 2.4 Implement User Profile & Preferences Service

- [ ] **Task**: Implement UserService untuk profile & preferences management
  - Function: `getUserProfile(userId)` - get user info
  - Function: `updateUserProfile(userId, data)` - update name, avatar, bio
  - Function: `getUserPreferences(userId)` - get preferences
  - Function: `updateUserPreferences(userId, preferences)` - update interests, budget, etc
  - Validate all inputs (name length, interests from enum, budget positive, etc)
  - Emit events untuk cache invalidation

- [ ] **Acceptance Criteria**:
  - Profile retrieved correctly
  - Profile updates persisted
  - Preferences validated
  - Cache invalidated on update

- [ ] **Testing**:
  - CRUD operations work
  - Validation enforced
  - Cache invalidation tested

**Estimated Effort**: 2-3 hours

**Dependencies**: Database schema (1.1)

---

## Phase 3: Location & Map Backend Services

### 3.1 Implement LocationService - Distance Calculation

**PBT Task**: ✅ Write property-based tests untuk Haversine distance

- [ ] **Task**: Implement LocationService pada `backend/src/services/locationService.ts`
  - Function: `haversineDistance(lat1, lng1, lat2, lng2): number`
    - Calculate great-circle distance accurately
    - Return distance in kilometers
    - Precision: ±0.01 km
  - Function: `updateUserLocation(userId, lat, lng, accuracy)`
    - Validate coordinates in bounds
    - Create/update UserLocation record
    - Invalidate nearby destination cache
  - Function: `getUserLocation(userId)` - get latest location
  - Function: `getLocationHistory(userId, limit)` - get location history

- [ ] **Acceptance Criteria**:
  - Haversine calculation accurate to ±0.01 km
  - Distance symmetric: dist(A→B) ≈ dist(B→A)
  - Location updates persisted correctly
  - History retrieved in chronological order

- [ ] **Property-Based Testing**:
  ```
  PROPERTY 1: Distance Symmetry
  ∀ point1, point2 ∈ ValidCoordinates :
    dist1 = haversineDistance(point1, point2)
    dist2 = haversineDistance(point2, point1)
    |dist1 - dist2| < 0.01 km
  
  PROPERTY 2: Triangle Inequality
  ∀ pointA, pointB, pointC ∈ ValidCoordinates :
    distAC ≤ distAB + distBC (within ±0.1 km margin)
  
  PROPERTY 3: Coordinate Validation
  ∀ lat, lng ∈ Strings :
    (lat ∈ [-90, 90] ∧ lng ∈ [-180, 180])
    ⟹ updateUserLocation(lat, lng) succeeds
  ```

- [ ] **Testing Approach**:
  - Unit tests dengan known distances
  - Property-based tests untuk coordinate validation
  - Test symmetry property
  - Test triangle inequality

**Estimated Effort**: 3-4 hours

**Dependencies**: Database schema (1.1)

---

### 3.2 Implement Nearby Destinations Query

- [ ] **Task**: Implement nearby destination search
  - Function: `getNearbyDestinations(userId, radius, limit)`
    - Get user current location
    - Query all Tourism destinations from Prisma
    - Filter by distance <= radius
    - Sort by distance ascending
    - Use Redis cache untuk distance calculations (5 min TTL)
    - Return paginated results
  - Implement cache key strategy: `nearby:{userId}:{lat_rounded}:{lng_rounded}`
  - Handle cache invalidation on destination update

- [ ] **Acceptance Criteria**:
  - Nearby destinations filtered correctly
  - Results sorted by distance
  - Cache hit rate > 80%
  - Response time < 200ms

- [ ] **Testing**:
  - Filter logic correct
  - Sorting verified
  - Cache working
  - Response time within SLO

**Estimated Effort**: 2-3 hours

**Dependencies**: LocationService (3.1), Redis (1.2)

---

## Phase 4: AI Recommendation Engine Backend

### 4.1 Implement Recommendation Scoring Algorithm

**PBT Task**: ✅ Write property-based tests untuk scoring algorithm

- [ ] **Task**: Implement RecommendationService pada `backend/src/services/recommendationService.ts`
  - Function: `scoreDestinations(userId, maxResults)`
    - Get user location + preferences
    - Query all destinations
    - For each destination: calculate score components
      - Distance score (0-30): 30 * (1 - distance/maxDistance)
      - Category relevance (0-35): 35 if match, 0 otherwise
      - Rating score (0-20): (rating/5) * 20
      - Budget score (0-15): based on compatibility
      - Accessibility (0-10): based on mobility level
    - Total score = sum of components
    - Filter by maxDistance
    - Sort descending by score
    - Cache results untuk 30 minutes
    - Return scored destinations

- [ ] **Acceptance Criteria**:
  - Scoring algorithm produces 0-100 scores
  - Results filtered by distance
  - Results sorted by score descending
  - Cache working
  - Response time < 200ms

- [ ] **Property-Based Testing**:
  ```
  PROPERTY 1: Score Bounds
  ∀ destination ∈ Destinations :
    score(destination) ∈ [0, 100]
  
  PROPERTY 2: Component Bounds
  ∀ destination ∈ Destinations :
    distanceScore ∈ [0, 30]
    ∧ categoryScore ∈ [0, 35]
    ∧ ratingScore ∈ [0, 20]
    ∧ budgetScore ∈ [0, 15]
    ∧ accessibilityScore ∈ [0, 10]
  
  PROPERTY 3: Score Ordering Consistency
  ∀ destinations ∈ ScoredDestinations :
    destination[i].score ≥ destination[i+1].score (descending)
  
  PROPERTY 4: Filter Correctness
  ∀ destination ∈ Results :
    distance(destination) ≤ maxDistance
  ```

- [ ] **Testing**:
  - Component scores within bounds
  - Total score bounded 0-100
  - Results sorted correctly
  - Filter logic verified
  - Property-based tests covering edge cases

**Estimated Effort**: 4-5 hours

**Dependencies**: LocationService (3.1), UserService (2.4)

---

### 4.2 Implement Itinerary Generation Algorithm

**PBT Task**: ✅ Write property-based tests untuk itinerary feasibility

- [ ] **Task**: Implement greedy itinerary generation
  - Function: `generateItinerary(userId, params: {duration, startTime, interests, budget})`
    - Get scored recommendations dari 4.1
    - Initialize: currentTime = startTime, remainingTime = duration, remainingBudget = budget
    - Greedy loop: select destinations yang fit
      - Skip if < 30 min remaining
      - Calculate: travel time + stay time (max 120 min)
      - Check time fit
      - Estimate cost
      - Check budget fit
      - Add to itinerary
    - Minimum 2 destinations if possible
    - Validate itinerary feasibility
    - Return itinerary items dengan timing
  - Function: `formatItineraryForLLM(itinerary, userPrefs)` - prepare context untuk OpenAI

- [ ] **Acceptance Criteria**:
  - Itinerary generated dengan 2-6 destinations
  - Total duration <= requested duration
  - Total cost <= budget
  - Items chronologically ordered
  - No overlapping time slots

- [ ] **Property-Based Testing**:
  ```
  PROPERTY 1: Time Feasibility
  ∀ itinerary ∈ GeneratedItineraries :
    sum(item.duration for item in itinerary) ≤ requested_duration
  
  PROPERTY 2: Budget Feasibility
  ∀ itinerary ∈ GeneratedItineraries :
    sum(item.cost for item in itinerary) ≤ budget
  
  PROPERTY 3: Chronological Order
  ∀ i ∈ [0, len(itinerary)-2] :
    itinerary[i].endTime ≤ itinerary[i+1].startTime
  
  PROPERTY 4: Minimum Items
  ∀ itinerary ∈ GeneratedItineraries, len(destinations) ≥ 2 :
    len(itinerary) ≥ 2
  ```

- [ ] **Testing**:
  - Itinerary respects time constraint
  - Itinerary respects budget constraint
  - Chronological order verified
  - Edge cases handled

**Estimated Effort**: 3-4 hours

**Dependencies**: Scoring algorithm (4.1)

---

### 4.3 Integrate OpenAI API untuk AI Summary

- [ ] **Task**: Call OpenAI untuk generate natural language itinerary summary
  - Function: `generateItinerarySummary(itinerary, userPrefs)`
    - Construct prompt with destinations, times, costs
    - Call OpenAI GPT-4 dengan:
      - Model: gpt-4 (atau gpt-3.5-turbo for cost)
      - Temperature: 0.7
      - Max tokens: 500
    - Handle API errors dengan fallback
    - Retry dengan exponential backoff
    - Cache response untuk 24 hours
  - Function: `generateDestinationInsights(destinationId)`
    - Similar flow untuk per-destination tips

- [ ] **Acceptance Criteria**:
  - OpenAI API called successfully
  - Response includes summary + tips
  - Fallback working if API error
  - Response time < 3 seconds total
  - Caching working

- [ ] **Testing**:
  - OpenAI integration working
  - Fallback tested
  - Response quality verified
  - Caching tested

**Estimated Effort**: 2-3 hours

**Dependencies**: OpenAI setup (1.3), Itinerary generation (4.2)

---

### 4.4 Implement Itinerary Save & Retrieval

- [ ] **Task**: Save generated itineraries dan provide retrieval endpoints
  - Function: `saveItinerary(userId, itinerary, title, description)`
    - Store SavedItinerary record
    - Store itinerary items (as JSON)
    - Validate before save
  - Function: `getUserItineraries(userId)`
    - Get all itineraries untuk user (descending by date)
    - Paginate results
  - Function: `getItinerary(userId, itineraryId)`
    - Get full itinerary details
    - Verify ownership
  - Function: `deleteItinerary(userId, itineraryId)` - soft delete
  - Function: `rateItinerary(userId, itineraryId, rating, feedback)`
    - Update rating and feedback
    - Track untuk analytics

- [ ] **Acceptance Criteria**:
  - Itinerary saved correctly
  - Retrieval working
  - Soft delete functional
  - Ratings stored
  - Only owner dapat access/modify

- [ ] **Testing**:
  - Save/retrieve operations work
  - Ownership checks verified
  - Soft delete functional

**Estimated Effort**: 2-3 hours

**Dependencies**: Database schema (1.1)

---

## Phase 5: API Routes Implementation

### 5.1 Implement Authentication Routes

- [ ] **Task**: Create auth endpoints pada `backend/src/routes/auth.ts`
  - `POST /api/auth/register` - register new user
  - `POST /api/auth/login` - login user
  - `POST /api/auth/refresh` - refresh access token
  - `POST /api/auth/logout` - logout user
  - `POST /api/auth/forgot-password` - request password reset
  - `POST /api/auth/reset-password` - reset password
  - `POST /api/auth/setup-2fa` - generate 2FA QR code
  - `POST /api/auth/verify-2fa` - verify 2FA code
  - Add rate limiting middleware
  - Add input validation middleware
  - Add error handling

- [ ] **Acceptance Criteria**:
  - All endpoints respond correctly
  - Rate limiting enforced
  - Input validation working
  - Proper HTTP status codes
  - Error messages helpful

- [ ] **Testing**:
  - Each endpoint tested với valid/invalid inputs
  - Rate limiting verified
  - Error responses correct

**Estimated Effort**: 3-4 hours

**Dependencies**: AuthService (2.1, 2.2, 2.3)

---

### 5.2 Implement User Routes

- [ ] **Task**: Create user endpoints pada `backend/src/routes/users.ts`
  - `GET /api/users/profile` - get user profile
  - `PUT /api/users/profile` - update user profile
  - `GET /api/users/preferences` - get preferences
  - `PUT /api/users/preferences` - update preferences
  - `DELETE /api/users/account` - delete account
  - Add JWT middleware untuk authentication
  - Add input validation

- [ ] **Acceptance Criteria**:
  - Endpoints respond correctly
  - Only authenticated user dapat access own data
  - Updates persisted correctly
  - Validation enforced

- [ ] **Testing**:
  - CRUD operations tested
  - Authentication verification
  - Validation tested

**Estimated Effort**: 2-3 hours

**Dependencies**: UserService (2.4)

---

### 5.3 Implement Location Routes

- [ ] **Task**: Create location endpoints pada `backend/src/routes/locations.ts`
  - `POST /api/locations/update` - update user location
  - `GET /api/locations/current` - get current location
  - `GET /api/locations/history` - get location history
  - `DELETE /api/locations/history` - delete location history
  - `GET /api/destinations/nearby` - get nearby destinations
  - Add input validation
  - Add error handling

- [ ] **Acceptance Criteria**:
  - Location updates persisted
  - Nearby destinations returned correctly
  - History retrieved
  - Response times within SLO

- [ ] **Testing**:
  - Location updates tested
  - Nearby query tested
  - History operations tested

**Estimated Effort**: 2-3 hours

**Dependencies**: LocationService (3.1, 3.2)

---

### 5.4 Implement AI Recommendation Routes

- [ ] **Task**: Create recommendation endpoints pada `backend/src/routes/recommendations.ts`
  - `GET /api/recommendations/score` - get scored destinations
  - `POST /api/ai/generate-itinerary` - generate itinerary
  - `GET /api/ai/destination-insights/{id}` - get AI insights
  - `POST /api/itineraries` - save itinerary
  - `GET /api/itineraries` - list user itineraries
  - `GET /api/itineraries/{id}` - get itinerary details
  - `PUT /api/itineraries/{id}` - update itinerary
  - `DELETE /api/itineraries/{id}` - delete itinerary
  - `POST /api/itineraries/{id}/rate` - rate itinerary
  - Add input validation
  - Add error handling
  - Add caching headers

- [ ] **Acceptance Criteria**:
  - All endpoints functional
  - Validation enforced
  - Caching working
  - Response times within SLO

- [ ] **Testing**:
  - Each endpoint tested
  - Cache verified
  - Error handling verified

**Estimated Effort**: 3-4 hours

**Dependencies**: RecommendationService (4.1, 4.2, 4.3, 4.4)

---

## Phase 6: Frontend Implementation

### 6.1 Implement Login & Registration Pages

- [ ] **Task**: Create login & registration UI pada frontend
  - `frontend/app/login/page.tsx` - login page
    - Email input field
    - Password input field
    - "Forgot password?" link
    - Login button
    - Social login buttons (optional)
    - Loading states
    - Error handling
    - 2FA prompt saat required
  - `frontend/app/register/page.tsx` - registration page
    - Email input dengan validation
    - Password input dengan strength indicator
    - Confirm password field
    - Name input field
    - Accept terms checkbox
    - Register button
    - Loading states
    - Error handling
  - Add form validation (client-side)
  - Add API integration

- [ ] **Acceptance Criteria**:
  - UI renders correctly
  - Form submission works
  - Validation enforced
  - Error messages displayed
  - Loading states working
  - Responsive on mobile

- [ ] **Testing**:
  - Component renders
  - Form submission
  - Validation logic
  - API integration

**Estimated Effort**: 4-5 hours

**Dependencies**: Auth routes (5.1)

---

### 6.2 Implement Smart Map Component

- [ ] **Task**: Create interactive map page pada `frontend/app/smart-map/page.tsx`
  - Initialize Leaflet.js map centered on Magelang
  - Add user location marker (blue dot) dengan accuracy circle
  - Add destination markers (red pins) dengan popup info
  - Real-time position updates (setiap 5-10 detik)
  - Click destination untuk detail view
  - Draw route line (optional)
  - Map controls: zoom, center, fullscreen
  - Mobile responsive
  - Dark mode support
  - Show distance + travel time
  - Handle permission denied gracefully

- [ ] **Acceptance Criteria**:
  - Map renders correctly
  - User position tracked
  - Markers display correctly
  - Real-time updates working
  - Touch interactions working
  - Responsive design

- [ ] **Testing**:
  - Component renders
  - Location updates
  - Marker interactions
  - Responsive layout

**Estimated Effort**: 5-6 hours

**Dependencies**: Location routes (5.3)

---

### 6.3 Implement AI Assistant Page

- [ ] **Task**: Create AI itinerary generator page pada `frontend/app/ai-assistant/page.tsx`
  - Form untuk input preferences:
    - Duration (hours) - number input
    - Start time - datetime picker
    - Interests - multi-select checkboxes
    - Budget - number input
  - "Generate Itinerary" button
  - Loading state dengan spinner
  - Display generated itinerary:
    - Table/card showing each destination
    - Time, duration, cost, travel time
    - AI-generated summary text
    - Tips dan recommendations
  - "Save Itinerary" button
  - Display saved itineraries list
  - Error handling
  - Fallback UI saat AI unavailable

- [ ] **Acceptance Criteria**:
  - Form renders correctly
  - API calls working
  - Itinerary displays correctly
  - Save/retrieve working
  - Responsive design
  - Error handling

- [ ] **Testing**:
  - Component renders
  - Form submission
  - API integration
  - Itinerary display
  - Responsive layout

**Estimated Effort**: 5-6 hours

**Dependencies**: Recommendation routes (5.4)

---

### 6.4 Implement User Profile & Settings Page

- [ ] **Task**: Create profile management page pada `frontend/app/profile/page.tsx`
  - Display user profile info (name, email, avatar)
  - Edit profile form
  - Preferences section
  - 2FA management
  - Change password
  - Logout button
  - Delete account (dengan confirmation)
  - Save changes button
  - Loading states
  - Error handling

- [ ] **Acceptance Criteria**:
  - Profile displays correctly
  - Edit form working
  - Preferences update
  - 2FA enable/disable
  - Changes persisted
  - Confirmation dialogs

- [ ] **Testing**:
  - Page renders
  - Form submissions
  - API integration
  - State management

**Estimated Effort**: 4-5 hours

**Dependencies**: User routes (5.2)

---

### 6.5 Add Global Authentication Context & Middleware

- [ ] **Task**: Setup authentication state management
  - Create AuthContext (React Context API)
  - Store user, token, loading state
  - Implement useAuth() hook
  - Add ProtectedRoute component
  - Token refresh logic
  - Auto-logout on token expiration
  - Persist auth state to sessionStorage/httpOnly cookie
  - Add JWT token interceptor untuk API calls

- [ ] **Acceptance Criteria**:
  - Auth state accessible globally
  - Protected routes working
  - Token refresh transparent
  - Auto-logout working
  - Session persistence

- [ ] **Testing**:
  - Context provides data correctly
  - Protected routes guard correctly
  - Token refresh working

**Estimated Effort**: 3-4 hours

**Dependencies**: Auth routes (5.1)

---

## Phase 7: Integration & Testing

### 7.1 End-to-End Testing - Complete User Flows

- [ ] **Task**: Implement E2E tests untuk critical user journeys
  - User registration → login → profile setup
  - Login → location capture → map display
  - Map → click destination → view details
  - AI Assistant → generate itinerary → save
  - Retrieve saved itinerary → rate
  - Use testing framework: Cypress or Playwright

- [ ] **Acceptance Criteria**:
  - E2E tests passing
  - Critical flows covered
  - Tests runnable in CI/CD

- [ ] **Testing**:
  - Run E2E test suite
  - Verify all flows complete

**Estimated Effort**: 4-5 hours

**Dependencies**: All frontend & backend implementation

---

### 7.2 Load Testing & Performance Benchmarking

- [ ] **Task**: Performance testing untuk identify bottlenecks
  - Simulate 100 concurrent login requests
  - Simulate 50 concurrent itinerary generations
  - Monitor response times, CPU, memory
  - Use tool: Apache JMeter or k6
  - Document results

- [ ] **Acceptance Criteria**:
  - Login response < 500ms (p99)
  - Itinerary generation < 3s
  - No memory leaks
  - Database connection pool healthy

**Estimated Effort**: 3-4 hours

**Dependencies**: All implementation complete

---

### 7.3 Security Testing & Vulnerability Scan

- [ ] **Task**: Security testing untuk identify vulnerabilities
  - SQL injection testing
  - XSS vulnerability testing
  - CSRF token validation
  - Rate limiting enforcement
  - JWT token validation
  - Use tool: OWASP ZAP or Burp Suite
  - Fix any vulnerabilities found

- [ ] **Acceptance Criteria**:
  - No critical vulnerabilities
  - Security best practices followed
  - Rate limiting working
  - Authentication robust

**Estimated Effort**: 3-4 hours

**Dependencies**: All implementation complete

---

## Summary of Dependencies & Critical Path

**Critical Path (Longest chain)**:
1. Database schema (1.1) → 3 hours
2. AuthService implementation (2.1) → 4 hours
3. Auth routes (5.1) → 3 hours
4. Login page (6.1) → 4 hours
5. **Total critical path: ~14 hours minimum**

**Parallelizable Tasks**:
- Phase 1: All infrastructure tasks can run in parallel
- Phase 2: Auth, User, Location services can be parallelized
- Phase 4: Recommendation services parallelizable
- Phase 5: Routes parallelizable
- Phase 6: Frontend pages parallelizable

**Recommended Execution Order**:
1. Start Phase 1 (infrastructure setup) - parallel all tasks
2. Start Phase 2 (auth) - critical for user sessions
3. Parallel: Phase 3 (location) + Phase 4 (recommendations)
4. Parallel: Phase 5 (routes) based on service completion
5. Parallel: Phase 6 (frontend) based on route availability
6. Phase 7 (testing) - after all implementation complete

**Estimated Total Effort**: 60-75 hours (with parallelization)
**Timeline with 2 developers**: 4-5 weeks

---

## Testing Strategy Summary

### Test Coverage by Component

| Component | Unit Tests | Integration | E2E | Property-Based |
|-----------|-----------|------------|-----|---|
| AuthService | ✅ | ✅ | ✅ | ✅ 3 properties |
| LocationService | ✅ | ✅ | ✅ | ✅ 3 properties |
| RecommendationService | ✅ | ✅ | ✅ | ✅ 4 properties |
| API Routes | ✅ | ✅ | ✅ | - |
| Frontend Components | ✅ | ✅ | ✅ | - |
| Security | ✅ | - | ✅ | - |

### Property-Based Test Framework

Use **fast-check** untuk JavaScript/TypeScript:

```bash
npm install --save-dev fast-check @types/jest
```

Example PBT template:
```typescript
import fc from 'fast-check';

describe('AuthService - Password Validation', () => {
  it('should always accept strong passwords', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({minLength: 8}),
          fc.boolean()
        ),
        ([password, _]) => {
          const valid = validatePasswordStrength(password);
          // Property assertion
          expect(typeof valid).toBe('boolean');
        }
      )
    );
  });
});
```

---

## Deployment Checklist

- [ ] Environment variables configured (.env files)
- [ ] Database migrations run
- [ ] Redis cache available
- [ ] OpenAI API key configured
- [ ] Email service configured
- [ ] HTTPS certificates ready
- [ ] CORS configured
- [ ] Rate limiting configured
- [ ] Logging setup
- [ ] Error monitoring setup
- [ ] Database backups configured
- [ ] Load balancer configured
- [ ] Monitoring dashboards ready
- [ ] Runbooks for common issues created
- [ ] Documentation complete
