/**
 * Base interfaces for API requests and responses
 */

// Base API request interface
export interface BaseRequest {
  // Common request properties can go here
}

// Base API response interface
export interface BaseResponse {
  success: boolean
  message?: string
}
