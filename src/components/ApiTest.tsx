import { useState } from 'react';
import { paystubApi } from '../services/api-client';

const ApiTest: React.FC = () => {
    const [status, setStatus] = useState<string>('Not tested');
    const [loading, setLoading] = useState<boolean>(false);

    const testHealthCheck = async () => {
        setLoading(true);
        try {
            const result = await paystubApi.healthCheck();
            setStatus(`✅ API Connected! Status: ${result.status}, Service: ${result.service}`);
        } catch (error) {
            setStatus(`❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const testCalculation = async () => {
        setLoading(true);
        try {
            const testData = {
                driverInfo: {
                    name: "Test Driver",
                    address: "123 Test St",
                    ssn: "1234",
                    payPeriodStart: "2024-01-01T00:00:00.000Z",
                    payPeriodEnd: "2024-01-07T00:00:00.000Z"
                },
                routes: { fourHourRoutes: 2, sixHourRoutes: 1 },
                routeRates: { fourHourRate: 80, sixHourRate: 120 },
                customRoutes: [],
                incentives: { pickUp: 1, gas: 1, rushHourDelivery: 0, lateNightDelivery: 0, highQuantityDelivery: 0 },
                incentiveRates: { pickUpRate: 17.5, gasRate: 20, rushHourRate: 5, lateNightRate: 5, highQuantityRate: 5 },
                customIncentives: [],
                statDelivery: { miles: 25 },
                statRate: { mileRate: 1.2 },
                customStatDeliveries: [],
                notes: "Test calculation"
            };

            const result = await paystubApi.calculateTotals(testData);
            setStatus(`✅ Calculation Success! Grand Total: $${result.grandTotal.toFixed(2)}`);
        } catch (error) {
            setStatus(`❌ Calculation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
            <h3>API Connection Test</h3>
            <p><strong>Status:</strong> {status}</p>
            <div style={{ gap: '10px', display: 'flex' }}>
                <button
                    onClick={testHealthCheck}
                    disabled={loading}
                    style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    {loading ? 'Testing...' : 'Test Health Check'}
                </button>
                <button
                    onClick={testCalculation}
                    disabled={loading}
                    style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    {loading ? 'Testing...' : 'Test Calculation'}
                </button>
            </div>
        </div>
    );
};

export default ApiTest;