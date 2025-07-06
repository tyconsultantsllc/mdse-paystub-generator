"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select } from "./ui/select"
import { Printer, FileSpreadsheet, Plus, Save, Trash2 } from "lucide-react"
import PaystubPreview from "./paystub-preview"
import { generatePaystubPDF } from "../lib/pdf-generator"
import { Checkbox } from "./ui/checkbox"

interface CustomItem {
    id: string
    name: string
    quantity: number
    rate: number
}

interface Driver {
    id: string
    firstName: string
    lastName: string
    address: string
    ssn: string
}

export default function PaystubGenerator() {
    // Driver management
    const [drivers, setDrivers] = useState<Driver[]>([])
    const [selectedDriverId, setSelectedDriverId] = useState<string>("")
    const [showAddDriver, setShowAddDriver] = useState(false)

    const [driverInfo, setDriverInfo] = useState({
        firstName: "",
        lastName: "",
        address: "",
        ssn: "",
        payPeriodStart: "",
        payPeriodEnd: "",
    })

    const [routes, setRoutes] = useState({
        fourHourRoutes: 0,
        sixHourRoutes: 0,
    })

    const [routeRates, setRouteRates] = useState({
        fourHourRate: 80,
        sixHourRate: 120,
    })

    const [customRoutes, setCustomRoutes] = useState<CustomItem[]>([])

    const [incentives, setIncentives] = useState({
        pickUp: 0,
        gas: 0,
        rushHourDelivery: 0,
        lateNightDelivery: 0,
        highQuantityDelivery: 0,
    })

    const [incentiveRates, setIncentiveRates] = useState({
        pickUpRate: 17.5,
        gasRate: 20.0,
        rushHourRate: 5.0,
        lateNightRate: 5.0,
        highQuantityRate: 5.0,
    })

    const [customIncentives, setCustomIncentives] = useState<CustomItem[]>([])

    const [statDelivery, setStatDelivery] = useState({
        miles: 0,
    })

    const [statRate, setStatRate] = useState({
        mileRate: 1.2,
    })

    const [customStatDeliveries, setCustomStatDeliveries] = useState<CustomItem[]>([])

    const [notes, setNotes] = useState(
        "This payment is for services rendered as an independent contractor. No taxes have been withheld.",
    )

    const [pdfOptions, setPdfOptions] = useState({
        includeCheckSpace: false,
        checkSpaceHeight: 2,
    })

    // Load drivers from localStorage on component mount
    useEffect(() => {
        const savedDrivers = localStorage.getItem("paystubDrivers")
        if (savedDrivers) {
            try {
                const parsedDrivers = JSON.parse(savedDrivers)
                setDrivers(parsedDrivers)
            } catch (error) {
                console.error("Error loading drivers:", error)
                setDrivers([])
            }
        }
    }, [])

    // Save drivers to localStorage whenever drivers change
    useEffect(() => {
        if (drivers.length > 0) {
            localStorage.setItem("paystubDrivers", JSON.stringify(drivers))
        }
    }, [drivers])

    const handleDriverSelect = (driverId: string) => {
        setSelectedDriverId(driverId)
        if (driverId === "") {
            // Clear form if no driver selected
            setDriverInfo({
                firstName: "",
                lastName: "",
                address: "",
                ssn: "",
                payPeriodStart: "",
                payPeriodEnd: "",
            })
        } else {
            const selectedDriver = drivers.find((d) => d.id === driverId)
            if (selectedDriver) {
                setDriverInfo({
                    firstName: selectedDriver.firstName,
                    lastName: selectedDriver.lastName,
                    address: selectedDriver.address,
                    ssn: selectedDriver.ssn,
                    payPeriodStart: "",
                    payPeriodEnd: "",
                })
            }
        }
    }

    const handleSaveDriver = () => {
        if (!driverInfo.firstName.trim() || !driverInfo.lastName.trim()) {
            alert("Please enter both first and last name")
            return
        }

        const newDriver: Driver = {
            id: `driver-${Date.now()}`,
            firstName: driverInfo.firstName.trim(),
            lastName: driverInfo.lastName.trim(),
            address: driverInfo.address.trim(),
            ssn: driverInfo.ssn.trim(),
        }

        setDrivers((prev) => [...prev, newDriver])
        setSelectedDriverId(newDriver.id)
        setShowAddDriver(false)
        alert("Driver saved successfully!")
    }

    const handleDeleteDriver = (driverId: string) => {
        if (confirm("Are you sure you want to delete this driver?")) {
            setDrivers((prev) => prev.filter((d) => d.id !== driverId))
            if (selectedDriverId === driverId) {
                setSelectedDriverId("")
                setDriverInfo({
                    firstName: "",
                    lastName: "",
                    address: "",
                    ssn: "",
                    payPeriodStart: "",
                    payPeriodEnd: "",
                })
            }
        }
    }

    const handleDriverInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDriverInfo((prev) => ({ ...prev, [name]: value }))
    }

    const handleRoutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRoutes((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
    }

    const handleRouteRatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRouteRates((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
    }

    const handleIncentivesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setIncentives((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
    }

    const handleIncentiveRatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setIncentiveRates((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
    }

    const handleStatDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStatDelivery((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
    }

    const handleStatRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setStatRate((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
    }

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value)
    }

    const handlePrint = () => {
        window.print()
    }

    const handleExportCSV = () => {
        console.log("Export CSV functionality will be added later")
    }

    const handleGeneratePDF = async () => {
        if (!driverInfo.firstName || !driverInfo.lastName) {
            alert("Please enter driver information before generating PDF")
            return
        }

        try {
            const paystubData = {
                routes,
                routeRates,
                customRoutes,
                incentives,
                incentiveRates,
                customIncentives,
                statDelivery,
                statRate,
                customStatDeliveries,
                routesTotal: totalRoutesAmount,
                incentivesTotal: totalIncentivesAmount,
                statDeliveryTotal: totalStatAmount,
                grandTotal,
                notes,
            }

            await generatePaystubPDF(driverInfo, paystubData, pdfOptions)
        } catch (error) {
            console.error("PDF generation error:", error)
            alert("Failed to generate PDF. Please try again.")
        }
    }

    // Calculate totals
    const routesTotal = routes.fourHourRoutes * routeRates.fourHourRate + routes.sixHourRoutes * routeRates.sixHourRate
    const customRoutesTotal = customRoutes.reduce((total, item) => total + item.quantity * item.rate, 0)
    const totalRoutesAmount = routesTotal + customRoutesTotal

    const incentivesTotal =
        incentives.pickUp * incentiveRates.pickUpRate +
        incentives.gas * incentiveRates.gasRate +
        incentives.rushHourDelivery * incentiveRates.rushHourRate +
        incentives.lateNightDelivery * incentiveRates.lateNightRate +
        incentives.highQuantityDelivery * incentiveRates.highQuantityRate
    const customIncentivesTotal = customIncentives.reduce((total, item) => total + item.quantity * item.rate, 0)
    const totalIncentivesAmount = incentivesTotal + customIncentivesTotal

    const statDeliveryTotal = statDelivery.miles * statRate.mileRate
    const customStatDeliveryTotal = customStatDeliveries.reduce((total, item) => total + item.quantity * item.rate, 0)
    const totalStatAmount = statDeliveryTotal + customStatDeliveryTotal

    const grandTotal = totalRoutesAmount + totalIncentivesAmount + totalStatAmount

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", textAlign: "center" }}>
                MDSE Driver Paystub Generator
            </h1>

            <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "1rem" }}>
                <Card className="print-hidden">
                    <CardContent style={{ padding: "0.75rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {/* Driver Selection */}
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>Select Driver</h2>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowAddDriver(!showAddDriver)}
                                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                                    >
                                        <Plus size={12} />
                                        {showAddDriver ? "Cancel" : "Add New"}
                                    </Button>
                                </div>

                                {drivers.length > 0 && (
                                    <div>
                                        <Label htmlFor="driverSelect" style={{ fontSize: "0.75rem" }}>
                                            Choose Existing Driver
                                        </Label>
                                        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                                            <Select
                                                id="driverSelect"
                                                value={selectedDriverId}
                                                onChange={(e) => handleDriverSelect(e.target.value)}
                                                style={{ flex: 1, fontSize: "0.75rem", padding: "0.25rem" }}
                                            >
                                                <option value="">-- Select a driver --</option>
                                                {drivers.map((driver) => (
                                                    <option key={driver.id} value={driver.id}>
                                                        {driver.firstName} {driver.lastName}
                                                    </option>
                                                ))}
                                            </Select>
                                            {selectedDriverId && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleDeleteDriver(selectedDriverId)}
                                                    style={{ padding: "0.25rem", color: "#dc2626" }}
                                                >
                                                    <Trash2 size={12} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Driver Information */}
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>Driver Information</h2>
                                    {(driverInfo.firstName || driverInfo.lastName) && (
                                        <Button
                                            variant="outline"
                                            onClick={handleSaveDriver}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                                        >
                                            <Save size={12} />
                                            Save
                                        </Button>
                                    )}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                    <div>
                                        <Label htmlFor="firstName" style={{ fontSize: "0.75rem" }}>
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={driverInfo.firstName}
                                            onChange={handleDriverInfoChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName" style={{ fontSize: "0.75rem" }}>
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={driverInfo.lastName}
                                            onChange={handleDriverInfoChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="ssn" style={{ fontSize: "0.75rem" }}>
                                            SSN (Last 4)
                                        </Label>
                                        <Input
                                            id="ssn"
                                            name="ssn"
                                            value={driverInfo.ssn}
                                            onChange={handleDriverInfoChange}
                                            maxLength={4}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div></div>
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <Label htmlFor="address" style={{ fontSize: "0.75rem" }}>
                                            Address
                                        </Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={driverInfo.address}
                                            onChange={handleDriverInfoChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="payPeriodStart" style={{ fontSize: "0.75rem" }}>
                                            Pay Period Start
                                        </Label>
                                        <Input
                                            id="payPeriodStart"
                                            name="payPeriodStart"
                                            type="date"
                                            value={driverInfo.payPeriodStart}
                                            onChange={handleDriverInfoChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="payPeriodEnd" style={{ fontSize: "0.75rem" }}>
                                            Pay Period End
                                        </Label>
                                        <Input
                                            id="payPeriodEnd"
                                            name="payPeriodEnd"
                                            type="date"
                                            value={driverInfo.payPeriodEnd}
                                            onChange={handleDriverInfoChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Routes */}
                            <div>
                                <h2 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Routes</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                    <div>
                                        <Label htmlFor="fourHourRoutes" style={{ fontSize: "0.75rem" }}>
                                            4-Hour Routes
                                        </Label>
                                        <Input
                                            id="fourHourRoutes"
                                            name="fourHourRoutes"
                                            type="number"
                                            value={routes.fourHourRoutes || ""}
                                            onChange={handleRoutesChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="fourHourRate" style={{ fontSize: "0.75rem" }}>
                                            4-Hour Rate ($)
                                        </Label>
                                        <Input
                                            id="fourHourRate"
                                            name="fourHourRate"
                                            type="number"
                                            step="0.01"
                                            value={routeRates.fourHourRate || ""}
                                            onChange={handleRouteRatesChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="sixHourRoutes" style={{ fontSize: "0.75rem" }}>
                                            6-Hour Routes
                                        </Label>
                                        <Input
                                            id="sixHourRoutes"
                                            name="sixHourRoutes"
                                            type="number"
                                            value={routes.sixHourRoutes || ""}
                                            onChange={handleRoutesChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="sixHourRate" style={{ fontSize: "0.75rem" }}>
                                            6-Hour Rate ($)
                                        </Label>
                                        <Input
                                            id="sixHourRate"
                                            name="sixHourRate"
                                            type="number"
                                            step="0.01"
                                            value={routeRates.sixHourRate || ""}
                                            onChange={handleRouteRatesChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Basic Incentives */}
                            <div>
                                <h2 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Incentives</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                    <div>
                                        <Label htmlFor="pickUp" style={{ fontSize: "0.75rem" }}>
                                            Pick Up
                                        </Label>
                                        <Input
                                            id="pickUp"
                                            name="pickUp"
                                            type="number"
                                            value={incentives.pickUp || ""}
                                            onChange={handleIncentivesChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="pickUpRate" style={{ fontSize: "0.75rem" }}>
                                            Pick Up Rate ($)
                                        </Label>
                                        <Input
                                            id="pickUpRate"
                                            name="pickUpRate"
                                            type="number"
                                            step="0.01"
                                            value={incentiveRates.pickUpRate || ""}
                                            onChange={handleIncentiveRatesChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gas" style={{ fontSize: "0.75rem" }}>
                                            Gas
                                        </Label>
                                        <Input
                                            id="gas"
                                            name="gas"
                                            type="number"
                                            value={incentives.gas || ""}
                                            onChange={handleIncentivesChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gasRate" style={{ fontSize: "0.75rem" }}>
                                            Gas Rate ($)
                                        </Label>
                                        <Input
                                            id="gasRate"
                                            name="gasRate"
                                            type="number"
                                            step="0.01"
                                            value={incentiveRates.gasRate || ""}
                                            onChange={handleIncentiveRatesChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* STAT Delivery */}
                            <div>
                                <h2 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>STAT Deliveries</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                    <div>
                                        <Label htmlFor="miles" style={{ fontSize: "0.75rem" }}>
                                            Miles
                                        </Label>
                                        <Input
                                            id="miles"
                                            name="miles"
                                            type="number"
                                            step="0.1"
                                            value={statDelivery.miles || ""}
                                            onChange={handleStatDeliveryChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="mileRate" style={{ fontSize: "0.75rem" }}>
                                            Mile Rate ($)
                                        </Label>
                                        <Input
                                            id="mileRate"
                                            name="mileRate"
                                            type="number"
                                            step="0.01"
                                            value={statRate.mileRate || ""}
                                            onChange={handleStatRateChange}
                                            style={{ fontSize: "0.75rem", padding: "0.25rem" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <h2 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Notes</h2>
                                <textarea
                                    value={notes}
                                    onChange={handleNotesChange}
                                    rows={2}
                                    style={{
                                        width: "100%",
                                        padding: "0.25rem",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "0.375rem",
                                        fontSize: "0.75rem",
                                        resize: "vertical",
                                    }}
                                />
                            </div>

                            {/* Actions */}
                            <div>
                                <h2 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Actions</h2>

                                {/* PDF Options */}
                                <div
                                    style={{
                                        padding: "0.5rem",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "0.375rem",
                                        backgroundColor: "#f9fafb",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <h3 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>PDF Options</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                        <Checkbox
                                            label="Include check printing space"
                                            checked={pdfOptions.includeCheckSpace}
                                            onChange={(e) => setPdfOptions((prev) => ({ ...prev, includeCheckSpace: e.target.checked }))}
                                        />
                                        {pdfOptions.includeCheckSpace && (
                                            <div style={{ marginLeft: "1rem" }}>
                                                <Label htmlFor="checkSpaceHeight" style={{ fontSize: "0.75rem" }}>
                                                    Height (inches)
                                                </Label>
                                                <Input
                                                    id="checkSpaceHeight"
                                                    type="number"
                                                    min="1"
                                                    max="4"
                                                    step="0.5"
                                                    value={pdfOptions.checkSpaceHeight}
                                                    onChange={(e) =>
                                                        setPdfOptions((prev) => ({
                                                            ...prev,
                                                            checkSpaceHeight: Number.parseFloat(e.target.value) || 2,
                                                        }))
                                                    }
                                                    style={{ width: "80px", fontSize: "0.75rem", padding: "0.25rem" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <Button onClick={handleGeneratePDF} style={{ fontSize: "0.75rem", padding: "0.5rem" }}>
                                        <Printer size={14} />
                                        Generate PDF
                                    </Button>
                                    <Button variant="outline" onClick={handlePrint} style={{ fontSize: "0.75rem", padding: "0.5rem" }}>
                                        <Printer size={14} />
                                        Print Preview
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleExportCSV}
                                        style={{ fontSize: "0.75rem", padding: "0.5rem" }}
                                    >
                                        <FileSpreadsheet size={14} />
                                        Export CSV
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div style={{ width: "8.5in", maxWidth: "100%", margin: "0 auto" }}>
                    <PaystubPreview
                        driverInfo={driverInfo}
                        routes={routes}
                        routeRates={routeRates}
                        customRoutes={customRoutes}
                        incentives={incentives}
                        incentiveRates={incentiveRates}
                        customIncentives={customIncentives}
                        statDelivery={statDelivery}
                        statRate={statRate}
                        customStatDeliveries={customStatDeliveries}
                        routesTotal={totalRoutesAmount}
                        incentivesTotal={totalIncentivesAmount}
                        statDeliveryTotal={totalStatAmount}
                        grandTotal={grandTotal}
                        notes={notes}
                    />
                </div>
            </div>
        </div>
    )
}
