import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import type {
  SavedCustomEstimate,
} from "../types";
import { getBusinessSettings, getPrintSettings } from "@/features/settings/services/settings-storage";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: "Helvetica",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  companyInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  companyLogo: {
    width: 55,
    height: 55,
    marginRight: 10,
    objectFit: "contain",
  },

  headerText: {
    fontSize: 8,
    marginTop: 2,
  },

  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },

  companySubtitle: {
    marginTop: 3,
    fontSize: 8,
    color: "#666",
  },

  estimateHeader: {
    textAlign: "right",
  },

  estimateTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },

  billTo: {
    marginTop: 12,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
  },

  billName: {
    fontSize: 10,
    fontWeight: "bold",
  },

  billDetails: {
    marginTop: 3,
    color: "#555",
  },

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#432818",
    color: "#fff",
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  tableRowAlternate: {
    backgroundColor: "#fcf6ee",
  },

  cell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },

  cellCenter: {
    textAlign: "center",
  },

  cellRight: {
    textAlign: "right",
  },

  number: {
    width: "5%",
  },

  description: {
    width: "40%",
  },

  qty: {
    width: "10%",
  },

  unit: {
    width: "10%",
  },

  rate: {
    width: "15%",
  },

  amount: {
    width: "20%",
  },

  bottomSection: {
    flexDirection: "row",
    marginTop: 18,
    gap: 20,
  },

  chargesSection: {
    width: "55%",
  },

  summarySection: {
    width: "45%",
  },

  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    fontSize: 9
  },

  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingTop: 6,
    paddingBottom: 3,
    borderTopWidth: 1,
    borderTopColor: "#222",
    fontSize: 12,
    fontWeight: "bold",
  },

  otherChargesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 6,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  terms: {
    width: "57%",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  termsTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 5,
  },

  term: {
    marginBottom: 3,
    color: "#555",
  },

  notes: {
    width: "43%",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});

interface CustomEstimatePdfProps {
  estimate: SavedCustomEstimate;
}

export function CustomEstimatePdf({
  estimate,
}: CustomEstimatePdfProps) {

    const business = getBusinessSettings(estimate.accountId);
    const printSettings = getPrintSettings(estimate.accountId);
  
  return (
    <Document>

      <Page
        size="A4"
        style={styles.page}
      >

        {/* ==============================
            HEADER
            ============================== */}

        <View style={styles.header}>

          <View style={styles.companyInfo}>
            {business.logo && (
              <Image
                src={business.logo}
                style={styles.companyLogo}
              />
            )}

            <View>
              <Text
                style={[
                  styles.companyName,
                  {
                    fontFamily: printSettings.businessNameFont,
                  },
                ]}
              >
                {business.businessName || " "}
              </Text>

              <Text style={styles.companySubtitle}>
                Wood Estimation & Sales
              </Text>

              {business.address && (
                <Text style={styles.headerText}>
                  {business.address}
                </Text>
              )}

              {business.phone && (
                <Text style={styles.headerText}>
                  Phone: {business.phone}
                </Text>
              )}

              {business.gstin && (
                <Text style={styles.headerText}>
                  GSTIN: {business.gstin}
                </Text>
              )}
            </View>

          </View>

          <View style={styles.estimateHeader}>

            <Text style={styles.estimateTitle}>
              ESTIMATE
            </Text>

            <Text style={styles.headerText}>
              NO. {estimate.estimateNumber}
            </Text>

            <Text style={styles.headerText}>
              DATE: {estimate.date}
            </Text>

            <Text style={styles.headerText}>
              STATUS: {" "}
              {estimate.status ===
              "CONFIRMED"
                ? "Confirmed"
                : "On Hold"}
            </Text>

          </View>

        </View>


        {/* ==============================
            ESTIMATE TO
            ============================== */}

        <View style={styles.billTo}>

          <Text style={styles.sectionTitle}>
            ESTIMATE TO
          </Text>

          <Text style={styles.billName}>
            {estimate.partyName || "—"}
          </Text>

          {estimate.contactNumber && (
            <Text style={styles.billDetails}>
              Contact:{" "}
              {estimate.contactNumber}
            </Text>
          )}

          {estimate.reference && (
            <Text style={styles.billDetails}>
              Reference:{" "}
              {estimate.reference}
            </Text>
          )}

        </View>


        {/* ==============================
            ITEMS TABLE
            ============================== */}

        <View style={styles.table}>

          {/* HEADER */}

          <View style={styles.tableHeader}>

            <Text
              style={[
                styles.cell,
                styles.number,
                styles.cellCenter,
              ]}
            >
              #
            </Text>

            <Text
              style={[
                styles.cell,
                styles.description,
                styles.cellCenter,
              ]}
            >
              DESCRIPTION
            </Text>

            <Text
              style={[
                styles.cell,
                styles.qty,
                styles.cellCenter,
              ]}
            >
              QTY
            </Text>
            
            <Text
              style={[
                styles.cell,
                styles.unit,
                styles.cellCenter,
              ]}
            >
              UNIT
            </Text>

            <Text
              style={[
                styles.cell,
                styles.rate,
                styles.cellCenter,
              ]}
            >
              RATE
            </Text>

            <Text
              style={[
                styles.cell,
                styles.amount,
                styles.cellCenter,
              ]}
            >
              AMOUNT
            </Text>

          </View>


          {/* ROWS */}

          {estimate.items.map(
            (item, index) => {

              return (
                <View
                  key={item.id}
                  wrap={false}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 ? styles.tableRowAlternate : {},
                  ]}
                >

                  <Text
                    style={[
                      styles.cell,
                      styles.number,
                      styles.cellCenter,
                    ]}
                  >
                    {index + 1}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.description,
                    ]}
                  >
                    {item.description || "—"}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.qty,
                      styles.cellCenter,
                    ]}
                  >
                    {item.quantity}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.unit,
                      styles.cellCenter,
                    ]}
                  >
                    {item.unit}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.rate,
                      styles.cellRight,
                    ]}
                  >
                    {Number(
                      item.pricePerUnit,
                    ).toFixed(2)}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      styles.amount,
                      styles.cellRight,
                    ]}
                  >
                    {item.lineTotal.toFixed(2)}
                  </Text>

                </View>
              );
            },
          )}

        </View>


        {/* ==============================
            OTHER CHARGES + SUMMARY
            ============================== */}

        <View style={styles.bottomSection}>

          {/* OTHER CHARGES */}

          <View style={styles.chargesSection}>

            <Text style={styles.otherChargesTitle}>
              OTHER CHARGES
            </Text>

            {estimate.otherCharges.length ===
            0 ? (
              <Text>
                No other charges.
              </Text>
            ) : (
              estimate.otherCharges.map(
                (charge) => (
                  <View
                    key={charge.id}
                    style={styles.chargeRow}
                  >
                    <Text>
                      {charge.name ||
                        "Other Charge"}
                    </Text>

                    <Text>
                      Rs.{" "}
                      {Number(
                        charge.amount,
                      ).toFixed(2)}
                    </Text>
                  </View>
                ),
              )
            )}

          </View>


          {/* SUMMARY */}

          <View style={styles.summarySection}>

            <View style={styles.summaryRow}>
              <Text>
                Subtotal
              </Text>

              <Text>
                Rs.{" "}
                {estimate.totals.subtotal.toFixed(
                  2,
                )}
              </Text>
            </View>


            {estimate.gstEnabled && (
              <View style={styles.summaryRow}>

                <Text>
                  GST ({estimate.gstRate}%)
                </Text>

                <Text>
                  Rs.{" "}
                  {estimate.totals.gstAmount.toFixed(
                    2,
                  )}
                </Text>

              </View>
            )}


            <View style={styles.summaryRow}>

              <Text>
                Other Charges
              </Text>

              <Text>
                Rs.{" "}
                {estimate.totals.totalOtherCharges.toFixed(
                  2,
                )}
              </Text>

            </View>


            <View style={styles.summaryRow}>

              <Text>
                Discount
              </Text>

              <Text>
                - Rs.{" "}
                {estimate.totals.discountAmount.toFixed(
                  2,
                )}
              </Text>

            </View>


            <View style={styles.grandTotal}>

              <Text>
                GRAND TOTAL
              </Text>

              <Text>
                Rs.{" "}
                {estimate.totals.grandTotal.toFixed(
                  2,
                )}
              </Text>

            </View>


            <View style={styles.summaryRow}>

              <Text>
                Advance Paid
              </Text>

              <Text>
                Rs.{" "}
                {estimate.totals.advancePaid.toFixed(
                  2,
                )}
              </Text>

            </View>


            <View style={styles.summaryRow}>

              <Text>
                Balance Due
              </Text>

              <Text>
                Rs.{" "}
                {estimate.totals.balanceDue.toFixed(
                  2,
                )}
              </Text>

            </View>

          </View>

        </View>

        <View style={styles.footer}>
          {/* ==============================
              TERMS
              ============================== */}

          {printSettings.termsAndConditions.trim() && (
            <View style={styles.terms}>
              <Text style={styles.termsTitle}>
                TERMS & CONDITIONS
              </Text>

              <Text style={styles.term}>
                {printSettings.termsAndConditions}
              </Text>
            </View>
          )}

          {/* ==============================
              NOTES
              ============================== */}

          {estimate.notes && (
            <View style={styles.notes}>

              <Text style={styles.termsTitle}>
                NOTES
              </Text>

              <Text>
                {estimate.notes}
              </Text>

            </View>
          )}
        </View>
      </Page>

    </Document>
  );
}