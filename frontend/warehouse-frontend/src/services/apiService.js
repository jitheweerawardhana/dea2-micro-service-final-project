import apiGateway from '../lib/axios';

/**
 * Example Service to interact with your Microservices through the API Gateway
 * Replace '/api/v1/warehouse' with the actual context-path of your microservice
 */

export const getInventoryItems = async () => {
  try {
    // This will hit http://13.53.95.161:8222/api/v1/warehouse/items
    const response = await apiGateway.get('/api/v1/warehouse/items');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

// export const checkEurekaStatus = async () => {
//     try {
//       // Direct call to Eureka (You'll likely get a CORS block depending on how Eureka is hosted)
//       // Usually, Eureka is accessed from the backend service or Gateway, not directly from frontend.
//       // But here is the URL logic anyway.
//       const eurekaUrl = process.env.NEXT_PUBLIC_EUREKA_URL || 'http://13.53.95.161:8761';
//       const response = await fetch(`${eurekaUrl}/eureka/apps`, {
//         headers: { Accept: 'application/json' },
//       });
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching Eureka status:', error);
//       throw error;
//     }
//   };
