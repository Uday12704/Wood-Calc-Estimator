import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import type {
  SavedRoundSizeEstimate,
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
    fontSize: 9
  },

  pricingLabel: {
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
    fontSize: 9
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

interface RoundSizeEstimatePdfProps {
  estimate: SavedRoundSizeEstimate;
}

export function RoundSizeMeasurePdf({
  estimate,
}: RoundSizeEstimatePdfProps) {

  const business = getBusinessSettings(estimate.accountId);
  const printSettings = getPrintSettings(estimate.accountId);

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
              LOG NO
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
                    styles.center,
                  ]}
                >
                  {item.length}
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.girth,
                    styles.center,
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
            ROUND SIZE MEASUREMENT
            ================================= */}

        <View style={styles.pricingSection}>

          <View style={styles.pricingRow}>

            <Text style={styles.pricingLabel}>
              Total CBM
            </Text>

            <Text>
              {estimate.totals.totalCbm.toFixed(
                3,
              )} CBM
            </Text>

          </View>
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
        
        <View style={styles.footer}>

          {/* =================================
              TERMS & CONDITIONS
              ================================= */}
              
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
        </View>
      </Page>

    </Document>
  );
}