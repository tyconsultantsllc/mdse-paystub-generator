import { Card, CardContent } from "./ui/card"
import { formatCurrency } from "../lib/utils"

interface DriverInfo {
    firstName: string
    lastName: string
    address: string
    ssn: string
    payPeriodStart: string
    payPeriodEnd: string
}

interface Routes {
    fourHourRoutes: number
    sixHourRoutes: number
}

interface RouteRates {
    fourHourRate: number
    sixHourRate: number
}

interface CustomItem {
    id: string
    name: string
    quantity: number
    rate: number
}

interface Incentives {
    pickUp: number
    gas: number
    rushHourDelivery: number
    lateNightDelivery: number
    highQuantityDelivery: number
}

interface IncentiveRates {
    pickUpRate: number
    gasRate: number
    rushHourRate: number
    lateNightRate: number
    highQuantityRate: number
}

interface StatDelivery {
    miles: number
}

interface StatRate {
    mileRate: number
}

interface PaystubPreviewProps {
    driverInfo: DriverInfo
    routes: Routes
    routeRates: RouteRates
    customRoutes: CustomItem[]
    incentives: Incentives
    incentiveRates: IncentiveRates
    customIncentives: CustomItem[]
    statDelivery: StatDelivery
    statRate: StatRate
    customStatDeliveries: CustomItem[]
    routesTotal: number
    incentivesTotal: number
    statDeliveryTotal: number
    grandTotal: number
    notes: string
}

export default function PaystubPreview({
    driverInfo,
    routes,
    routeRates,
    incentives,
    incentiveRates,
    statDelivery,
    statRate,
    routesTotal,
    incentivesTotal,
    statDeliveryTotal,
    grandTotal,
    notes,
}: PaystubPreviewProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    }

    const payPeriod =
        driverInfo.payPeriodStart && driverInfo.payPeriodEnd
            ? `${formatDate(driverInfo.payPeriodStart)} - ${formatDate(driverInfo.payPeriodEnd)}`
            : "Not specified"

    const fullName = `${driverInfo.firstName} ${driverInfo.lastName}`.trim()

    return (
        <Card style={{ width: "8.5in", minHeight: "11in", backgroundColor: "white" }}>
            <CardContent style={{ padding: "0.5in", height: "100%", display: "flex", flexDirection: "column" }}>
                <div className="border-b-2" style={{ paddingBottom: "0.5rem", marginBottom: "0.75rem" }}>
                    <div className="text-center" style={{ marginBottom: "0.5rem" }}>
                        <div
                            style={{
                                width: "300px",
                                height: "80px",
                                margin: "0 auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "0.5rem",
                            }}
                        >
                            <img
                                src="/images/mdscripts-logo.png"
                                alt="MDSCRIPTS express"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.75rem" }}>
                        <div>
                            <p style={{ margin: "0.1rem 0" }}>
                                <strong>Name:</strong> {fullName || "_______________"}
                            </p>
                            <p style={{ margin: "0.1rem 0" }}>
                                <strong>Address:</strong> {driverInfo.address || "_______________"}
                            </p>
                            <p style={{ margin: "0.1rem 0" }}>
                                <strong>SSN (Last 4):</strong> {driverInfo.ssn ? `XXX-XX-${driverInfo.ssn}` : "XXX-XX-____"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p style={{ margin: "0.1rem 0" }}>
                                <strong>Pay Period:</strong> {payPeriod}
                            </p>
                            <p style={{ margin: "0.1rem 0" }}>
                                <strong>Payment Date:</strong> {formatDate(driverInfo.payPeriodEnd) || "_______________"}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    {/* Routes Section */}
                    <div>
                        <h2
                            className="font-bold border-b"
                            style={{ marginBottom: "0.25rem", paddingBottom: "0.1rem", fontSize: "0.75rem" }}
                        >
                            ROUTES COMPLETED
                        </h2>
                        <table style={{ width: "100%", fontSize: "0.65rem", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f9fafb" }}>
                                    <th style={{ textAlign: "left", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Route Type</th>
                                    <th style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Qty</th>
                                    <th style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Rate</th>
                                    <th style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "0.2rem", border: "1px solid #e5e7eb" }}>4-Hour Routes</td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {routes.fourHourRoutes}
                                    </td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(routeRates.fourHourRate)}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(routes.fourHourRoutes * routeRates.fourHourRate)}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "0.2rem", border: "1px solid #e5e7eb" }}>6-Hour Routes</td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {routes.sixHourRoutes}
                                    </td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(routeRates.sixHourRate)}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(routes.sixHourRoutes * routeRates.sixHourRate)}
                                    </td>
                                </tr>
                                <tr className="font-bold" style={{ backgroundColor: "#f3f4f6" }}>
                                    <td colSpan={3} style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        Routes Subtotal:
                                    </td>
                                    <td style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(routesTotal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Incentives Section */}
                    <div>
                        <h2
                            className="font-bold border-b"
                            style={{ marginBottom: "0.25rem", paddingBottom: "0.1rem", fontSize: "0.75rem" }}
                        >
                            INCENTIVES & BONUSES
                        </h2>
                        <table style={{ width: "100%", fontSize: "0.65rem", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f9fafb" }}>
                                    <th style={{ textAlign: "left", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Incentive Type</th>
                                    <th style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Qty</th>
                                    <th style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Rate</th>
                                    <th style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "0.2rem", border: "1px solid #e5e7eb" }}>Pick Up</td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {incentives.pickUp}
                                    </td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(incentiveRates.pickUpRate)}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(incentives.pickUp * incentiveRates.pickUpRate)}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "0.2rem", border: "1px solid #e5e7eb" }}>Gas</td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {incentives.gas}
                                    </td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(incentiveRates.gasRate)}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(incentives.gas * incentiveRates.gasRate)}
                                    </td>
                                </tr>
                                <tr className="font-bold" style={{ backgroundColor: "#f3f4f6" }}>
                                    <td colSpan={3} style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        Incentives Subtotal:
                                    </td>
                                    <td style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(incentivesTotal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* STAT Deliveries Section */}
                    <div>
                        <h2
                            className="font-bold border-b"
                            style={{ marginBottom: "0.25rem", paddingBottom: "0.1rem", fontSize: "0.75rem" }}
                        >
                            STAT DELIVERIES
                        </h2>
                        <table style={{ width: "100%", fontSize: "0.65rem", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f9fafb" }}>
                                    <th style={{ textAlign: "left", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Type</th>
                                    <th style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Qty</th>
                                    <th style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Rate</th>
                                    <th style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "0.2rem", border: "1px solid #e5e7eb" }}>STAT Delivery Mileage</td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {statDelivery.miles}
                                    </td>
                                    <td style={{ textAlign: "center", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(statRate.mileRate)}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(statDelivery.miles * statRate.mileRate)}
                                    </td>
                                </tr>
                                <tr className="font-bold" style={{ backgroundColor: "#f3f4f6" }}>
                                    <td colSpan={3} style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        STAT Delivery Subtotal:
                                    </td>
                                    <td style={{ textAlign: "right", padding: "0.2rem", border: "1px solid #e5e7eb" }}>
                                        {formatCurrency(statDeliveryTotal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Grand Total */}
                    <div className="border-t-2" style={{ paddingTop: "0.5rem", marginTop: "auto" }}>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr className="font-bold" style={{ fontSize: "0.875rem" }}>
                                    <td style={{ textAlign: "right", padding: "0.25rem" }}>TOTAL PAYMENT:</td>
                                    <td style={{ textAlign: "right", width: "25%", padding: "0.25rem" }}>{formatCurrency(grandTotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Notes */}
                    {notes && (
                        <div
                            style={{
                                fontSize: "0.5rem",
                                marginTop: "0.5rem",
                                borderTop: "1px solid #d1d5db",
                                paddingTop: "0.5rem",
                            }}
                        >
                            {notes.split("\n").map((line, index) => (
                                <p key={index} style={{ marginTop: index > 0 ? "0.25rem" : "0" }}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
