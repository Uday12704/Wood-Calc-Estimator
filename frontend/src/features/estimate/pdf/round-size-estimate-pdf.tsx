import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import type {
  SavedRoundSizeEstimate,
} from "../types";

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

  companyName: {
    fontSize: 18,
    fontWeight: "bold",
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

  headerText: {
    marginTop: 3,
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
    backgroundColor: "#21140c",
    color: "#fff",
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  cell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },

  center: {
    textAlign: "center",
  },

  right: {
    textAlign: "right",
  },

  number: {
    width: "5%",
  },

  woodType: {
    width: "25%",
  },

  logNo: {
    width: "15%",
  },

  length: {
    width: "15%",
  },

  girth: {
    width: "15%",
  },

  cbm: {
    width: "13%",
  },

  cft: {
    width: "12%",
  },

  pricingSection: {
    marginTop: 14,
    marginBottom: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },

  pricingLabel: {
    fontWeight: "bold",
  },

  bottomSection: {
    flexDirection: "row",
    marginTop: 10,
    gap: 20,
  },

  chargesSection: {
    width: "55%",
  },

  summarySection: {
    width: "45%",
  },

  chargeTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 6,
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
  },

  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#222",
    fontSize: 10,
    fontWeight: "bold",
  },

  measurementSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  measurementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    color: "#555",
  },

  terms: {
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
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});

interface RoundSizeEstimatePdfProps {
  estimate: SavedRoundSizeEstimate;
}

export function RoundSizeEstimatePdf({
  estimate,
}: RoundSizeEstimatePdfProps) {
  return (
    <Document>

      <Page
        size="A4"
        style={styles.page}
      >

        {/* =================================
            COMPANY HEADER
            ================================= */}

        <View style={styles.header}>

          <View>

            <Text style={styles.companyName}>
              PRAGATHI TIMBER
            </Text>

            <Text style={styles.companySubtitle}>
              Wood Estimation & Sales
            </Text>

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
              STATUS:{" "}
              {estimate.status === "CONFIRMED"
                ? "Confirmed"
                : "On Hold"}
            </Text>

          </View>

        </View>


        {/* =================================
            ESTIMATE TO
            ================================= */}

        <View style={styles.billTo}>

          <Text style={styles.sectionTitle}>
            ESTIMATE TO
          </Text>

          <Text style={styles.billName}>
            {estimate.partyName || "—"}
          </Text>

          {estimate.contactNumber && (
            <Text style={styles.billDetails}>
              Contact: {estimate.contactNumber}
            </Text>
          )}

          {estimate.reference && (
            <Text style={styles.billDetails}>
              Reference: {estimate.reference}
            </Text>
          )}

        </View>


        {/* =================================
            ROUND SIZE ITEMS TABLE
            ================================= */}

        <View style={styles.table}>

          {/* TABLE HEADER */}

          <View style={styles.tableHeader}>

            <Text
              style={[
                styles.cell,
                styles.number,
                styles.center,
              ]}
            >
              #
            </Text>

            <Text
              style={[
                styles.cell,
                styles.woodType,
              ]}
            >
              WOOD TYPE
            </Text>

            <Text
              style={[
                styles.cell,
                styles.logNo,
                styles.center,
              ]}
            >
              LOG NO.
            </Text>

            <Text
              style={[
                styles.cell,
                styles.length,
                styles.right,
              ]}
            >
              LENGTH (M)
            </Text>

            <Text
              style={[
                styles.cell,
                styles.girth,
                styles.right,
              ]}
            >
              GIRTH (CM)
            </Text>

            <Text
              style={[
                styles.cell,
                styles.cbm,
                styles.right,
              ]}
            >
              CBM
            </Text>

            {estimate.cftEnabled && (
              <Text
                style={[
                  styles.cell,
                  styles.cft,
                  styles.right,
                ]}
              >
                CFT
              </Text>
            )}

          </View>


          {/* TABLE ROWS */}

          {estimate.items.map(
            (item, index) => (
              <View
                key={item.id}
                style={styles.tableRow}
                wrap={false}
              >

                <Text
                  style={[
                    styles.cell,
                    styles.number,
                    styles.center,
                  ]}
                >
                  {index + 1}
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.woodType,
                  ]}
                >
                  {item.woodType || "—"}
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.logNo,
                    styles.center,
                  ]}
                >
                  {item.logNo || "—"}
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.length,
                    styles.right,
                  ]}
                >
                  {item.length}
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.girth,
                    styles.right,
                  ]}
                >
                  {item.girth}
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.cbm,
                    styles.right,
                  ]}
                >
                  {item.cbm.toFixed(3)}
                </Text>

                {estimate.cftEnabled && (
                  <Text
                    style={[
                      styles.cell,
                      styles.cft,
                      styles.right,
                    ]}
                  >
                    {item.cft.toFixed(2)}
                  </Text>
                )}

              </View>
            ),
          )}

        </View>


        {/* =================================
            ROUND SIZE PRICING
            ================================= */}

        <View style={styles.pricingSection}>

          <View style={styles.pricingRow}>

            <Text style={styles.pricingLabel}>
              Total CBM
            </Text>

            <Text>
              {estimate.totals.totalCbm.toFixed(
                3,
              )}
            </Text>

          </View>

          <View style={styles.pricingRow}>

            <Text style={styles.pricingLabel}>
              Price / CBM
            </Text>

            <Text>
              Rs.{" "}
              {Number(
                estimate.pricePerCbm,
              ).toFixed(2)}
            </Text>

          </View>

          <View style={styles.pricingRow}>

            <Text style={styles.pricingLabel}>
              Subtotal
            </Text>

            <Text>
              Rs.{" "}
              {estimate.totals.subtotal.toFixed(
                2,
              )}
            </Text>

          </View>

        </View>


        {/* =================================
            OTHER CHARGES + SUMMARY
            ================================= */}

        <View style={styles.bottomSection}>

          {/* OTHER CHARGES */}

          <View style={styles.chargesSection}>

            <Text style={styles.chargeTitle}>
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


            {/* ROUND SIZE MEASUREMENTS */}

            <View
              style={
                styles.measurementSection
              }
            >

              <View
                style={
                  styles.measurementRow
                }
              >

                <Text>
                  Avg Girth
                </Text>

                <Text>
                  {estimate.totals.avgGirth.toFixed(
                    2,
                  )}{" "}
                  cm
                </Text>

              </View>


              <View
                style={
                  styles.measurementRow
                }
              >

                <Text>
                  Total CBM
                </Text>

                <Text>
                  {estimate.totals.totalCbm.toFixed(
                    3,
                  )}{" "}
                  CBM
                </Text>

              </View>


              {estimate.cftEnabled && (
                <View
                  style={
                    styles.measurementRow
                  }
                >

                  <Text>
                    Total CFT
                  </Text>

                  <Text>
                    {estimate.totals.totalCft.toFixed(
                      2,
                    )}{" "}
                    CFT
                  </Text>

                </View>
              )}

            </View>

          </View>

        </View>


        {/* =================================
            TERMS
            ================================= */}

        <View style={styles.terms}>

          <Text style={styles.termsTitle}>
            TERMS
          </Text>

          <Text style={styles.term}>
            1. Goods once sold will not be
            taken back.
          </Text>

          <Text style={styles.term}>
            2. Payment due on delivery unless
            otherwise agreed.
          </Text>

          <Text style={styles.term}>
            3. Subject to local jurisdiction.
          </Text>

        </View>


        {/* =================================
            NOTES
            ================================= */}

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

      </Page>

    </Document>
  );
}