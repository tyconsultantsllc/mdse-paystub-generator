import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface DriverInfo {
    firstName: string
    lastName: string
    address: string
    ssn: string
    payPeriodStart: string
    payPeriodEnd: string
}

interface PDFOptions {
    includeCheckSpace: boolean
    checkSpaceHeight: number // in inches
}

export async function generatePaystubPDF(
    driverInfo: DriverInfo,
    paystubData: any,
    options: PDFOptions = { includeCheckSpace: false, checkSpaceHeight: 2 },
): Promise<void> {
    try {
        // Create a temporary container for the PDF content
        const tempContainer = document.createElement("div")
        tempContainer.style.position = "absolute"
        tempContainer.style.left = "-9999px"
        tempContainer.style.top = "0"
        tempContainer.style.width = "8.5in"
        tempContainer.style.backgroundColor = "white"
        tempContainer.style.padding = "0.3in"
        tempContainer.style.fontFamily = "Arial, sans-serif"
        tempContainer.style.fontSize = "10px"
        tempContainer.style.lineHeight = "1.2"

        // Generate the HTML content for the PDF
        tempContainer.innerHTML = generatePaystubHTML(driverInfo, paystubData)

        document.body.appendChild(tempContainer)

        // Convert HTML to canvas
        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
        })

        document.body.removeChild(tempContainer)

        // Create PDF
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: "letter",
        })

        const imgWidth = 8.5
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Add the paystub content
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight)

        // Add check space if requested
        if (options.includeCheckSpace) {
            const checkSpaceY = imgHeight + 0.1 // Minimal spacing

            // Add a line separator
            pdf.setLineWidth(0.01)
            pdf.line(0.3, checkSpaceY, 8.2, checkSpaceY)

            // Add check space label
            pdf.setFontSize(8)
            pdf.text("CHECK PRINTING SPACE", 0.3, checkSpaceY + 0.15)

            // Add a border for the check space
            pdf.setLineWidth(0.005)
            pdf.rect(0.3, checkSpaceY + 0.2, 7.9, options.checkSpaceHeight)
        }

        // Generate filename
        const fullName = `${driverInfo.firstName}_${driverInfo.lastName}`.replace(/\s+/g, "_")
        const payPeriodEnd = driverInfo.payPeriodEnd
            ? new Date(driverInfo.payPeriodEnd).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0]
        const filename = `paystub_${fullName}_${payPeriodEnd}.pdf`

        // Save the PDF
        pdf.save(filename)
    } catch (error) {
        console.error("Error generating PDF:", error)
        throw new Error("Failed to generate PDF. Please try again.")
    }
}

function generatePaystubHTML(driverInfo: DriverInfo, paystubData: any): string {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    const formatDate = (dateString: string): string => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    }

    const fullName = `${driverInfo.firstName} ${driverInfo.lastName}`.trim()
    const payPeriod =
        driverInfo.payPeriodStart && driverInfo.payPeriodEnd
            ? `${formatDate(driverInfo.payPeriodStart)} - ${formatDate(driverInfo.payPeriodEnd)}`
            : "Not specified"

    return `
    <div style="max-width: 100%; margin: 0 auto; font-size: 10px; line-height: 1.2;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
        <div style="text-align: center; margin-bottom: 8px;">
          <div style="width: 300px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
            <img src="/images/mdscripts-logo.png" alt="MDSCRIPTS express" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 9px;">
          <div>
            <p style="margin: 2px 0;"><strong>Name:</strong> ${fullName || "_______________"}</p>
            <p style="margin: 2px 0;"><strong>Address:</strong> ${driverInfo.address || "_______________"}</p>
            <p style="margin: 2px 0;"><strong>SSN (Last 4):</strong> ${driverInfo.ssn ? `XXX-XX-${driverInfo.ssn}` : "XXX-XX-____"}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 2px 0;"><strong>Pay Period:</strong> ${payPeriod}</p>
            <p style="margin: 2px 0;"><strong>Payment Date:</strong> ${formatDate(driverInfo.payPeriodEnd) || "_______________"}</p>
          </div>
        </div>
      </div>

      <!-- Routes Section -->
      <div style="margin-bottom: 12px;">
        <h2 style="font-size: 11px; font-weight: bold; margin-bottom: 4px; border-bottom: 1px solid #d1d5db; padding-bottom: 2px;">
          ROUTES COMPLETED
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
          <thead>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <th style="text-align: left; padding: 3px; font-weight: 600; background-color: #f9fafb;">Route Type</th>
              <th style="text-align: center; padding: 3px; font-weight: 600; background-color: #f9fafb;">Qty</th>
              <th style="text-align: center; padding: 3px; font-weight: 600; background-color: #f9fafb;">Rate</th>
              <th style="text-align: right; padding: 3px; font-weight: 600; background-color: #f9fafb;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 3px;">4-Hour Routes</td>
              <td style="text-align: center; padding: 3px;">${paystubData.routes.fourHourRoutes}</td>
              <td style="text-align: center; padding: 3px;">${formatCurrency(paystubData.routeRates.fourHourRate)}</td>
              <td style="text-align: right; padding: 3px;">${formatCurrency(paystubData.routes.fourHourRoutes * paystubData.routeRates.fourHourRate)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 3px;">6-Hour Routes</td>
              <td style="text-align: center; padding: 3px;">${paystubData.routes.sixHourRoutes}</td>
              <td style="text-align: center; padding: 3px;">${formatCurrency(paystubData.routeRates.sixHourRate)}</td>
              <td style="text-align: right; padding: 3px;">${formatCurrency(paystubData.routes.sixHourRoutes * paystubData.routeRates.sixHourRate)}</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f9fafb;">
              <td colspan="3" style="text-align: right; padding: 3px;">Routes Subtotal:</td>
              <td style="text-align: right; padding: 3px;">${formatCurrency(paystubData.routesTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Incentives Section -->
      <div style="margin-bottom: 12px;">
        <h2 style="font-size: 11px; font-weight: bold; margin-bottom: 4px; border-bottom: 1px solid #d1d5db; padding-bottom: 2px;">
          INCENTIVES & BONUSES
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
          <thead>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <th style="text-align: left; padding: 3px; font-weight: 600; background-color: #f9fafb;">Incentive Type</th>
              <th style="text-align: center; padding: 3px; font-weight: 600; background-color: #f9fafb;">Qty</th>
              <th style="text-align: center; padding: 3px; font-weight: 600; background-color: #f9fafb;">Rate</th>
              <th style="text-align: right; padding: 3px; font-weight: 600; background-color: #f9fafb;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 3px;">Pick Up</td>
              <td style="text-align: center; padding: 3px;">${paystubData.incentives.pickUp}</td>
              <td style="text-align: center; padding: 3px;">${formatCurrency(paystubData.incentiveRates.pickUpRate)}</td>
              <td style="text-align: right; padding: 3px;">${formatCurrency(paystubData.incentives.pickUp * paystubData.incentiveRates.pickUpRate)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 3px;">Gas</td>
              <td style="text-align: center; padding: 3px;">${paystubData.incentives.gas}</td>
              <td style="text-align: center; padding: 3px;">${formatCurrency(paystubData.incentiveRates.gasRate)}</td>
              <td style="text-align: right; padding: 3px;">${formatCurrency(paystubData.incentives.gas * paystubData.incentiveRates.gasRate)}</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f9fafb;">
              <td colspan="3" style="text-align: right; padding: 3px;">Incentives Subtotal:</td>
              <td style="text-align: right; padding: 3px;">${formatCurrency(paystubData.incentivesTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- STAT Deliveries Section -->
      <div style="margin-bottom: 12px;">
        <h2 style="font-size: 11px; font-weight: bold; margin-bottom: 4px; border-bottom: 1px solid #d1d5db; padding-bottom: 2px;">
          STAT DELIVERIES
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px;">
          <thead>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <th style="text-align: left; padding: 3px; font-weight: 600; background-color: #f9fafb;">Type</th>
              <th style="text-align: center; padding: 3px; font-weight: 600; background-color: #f9fafb;">Qty</th>
              <th style="text-align: center; padding: 3px; font-weight: 600; background-color: #f9fafb;">Rate</th>
              <th style="text-align: right; padding: 3px; font-weight: 600; background-color: #f9fafb;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 3px;">STAT Delivery Mileage</td>
              <td style="text-align: center; padding: 3px;">${paystubData.statDelivery.miles}</td>
              <td style="text-align: center; padding: 3px;">${formatCurrency(paystubData.statRate.mileRate)}</td>
              <td style="text-align: right; padding: 3px;">${formatCurrency(paystubData.statDelivery.miles * paystubData.statRate.mileRate)}</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f9fafb;">
              <td colspan="3" style="text-align: right; padding: 3px;">STAT Delivery Subtotal:</td>
              <td style="text-align: right; padding: 3px;">${formatCurrency(paystubData.statDeliveryTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grand Total -->
      <div style="border-top: 2px solid #000; padding-top: 8px; margin-bottom: 12px;">
        <table style="width: 100%;">
          <tbody>
            <tr style="font-weight: bold; font-size: 14px;">
              <td style="text-align: right; padding: 4px;">TOTAL PAYMENT:</td>
              <td style="text-align: right; padding: 4px; width: 25%;">${formatCurrency(paystubData.grandTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notes -->
      ${paystubData.notes
            ? `
        <div style="font-size: 8px; margin-top: 8px; border-top: 1px solid #d1d5db; padding-top: 8px;">
          ${paystubData.notes
                .split("\n")
                .map((line: string) => `<p style="margin: 2px 0;">${line}</p>`)
                .join("")}
        </div>
      `
            : ""
        }
    </div>
  `
}
