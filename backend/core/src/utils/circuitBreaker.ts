import CircuitBreaker from 'opossum';

const options = {
  timeout: 3000, // If our AI service takes longer than 3 seconds, trigger failure
  errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
  resetTimeout: 30000 // After 30 seconds, try again
};

/**
 * Creates a circuit breaker wrapper for a function
 * @param action The async function to wrap
 * @param fallback The fallback function if the circuit is open
 */
export function createCircuitBreaker(action: (...args: any[]) => Promise<any>, fallback: any) {
  const breaker = new CircuitBreaker(action, options);
  
  breaker.fallback(fallback);
  
  breaker.on('open', () => console.warn('⚠️ AI Service Circuit Opened (Service Down or Overloaded)'));
  breaker.on('halfOpen', () => console.info('🔍 AI Service Circuit Half-Open (Probing...)'));
  breaker.on('close', () => console.info('✅ AI Service Circuit Closed (Service Recovered)'));

  return breaker;
}
