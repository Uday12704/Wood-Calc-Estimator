import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import type {
  DeliveryChecklist,
  DeliveryEstimate,
} from "../types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: "Helvetica",
  },

  /* ==============================
     HEADER
     ============================== */

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

  documentHeader: {
    textAlign: "right",
  },

  documentTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },

  headerText: {
    marginTop: 3,
  },

  /* ==============================
     DELIVERED TO
     ============================== */

  deliveredTo: {
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

  partyName: {
    fontSize: 10,
    fontWeight: "bold",
  },

  detailRow: {
    flexDirection: "row",
    marginTop: 5,
  },

  detailColumn: {
    width: "50%",
  },

  detailLabel: {
    color: "#666",
  },

  detailValue: {
    marginTop: 2,
    fontWeight: "bold",
  },

  /* ==============================
     TABLE
     ============================== */

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  tableTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginVertical: 5,
    marginLeft: 2,
    textTransform: "uppercase",
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
    width: "7%",
  },

  description: {
    width: "30%",
  },

  size: {
    width: "15%",
  },

  length: {
    width: "15%",
  },

  qty: {
    width: "13%",
  },

  deliveryStatus: {
    width: "20%",
  },

  /* ==============================
     ROUND SIZE
     ============================== */

  roundWoodType: {
    width: "25%",
  },

  roundLogNo: {
    width: "15%",
  },

  roundLength: {
    width: "15%",
  },

  roundGirth: {
    width: "15%",
  },

  roundStatus: {
    width: "23%",
  },

  /* ==============================
     CUSTOM
     ============================== */

  customDescription: {
    width: "58%",
  },

  customQty: {
    width: "15%",
  },

  customStatus: {
    width: "20%",
  },

  /* ==============================
     ADDITIONAL ITEMS
     ============================== */

  additionalTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },

  additionalDescription: {
    width: "53%",
  },

  additionalQty: {
    width: "15%"
  },

  additionalStatus: {
    width: "25%",
  },

  /* ==============================
     STATUS
     ============================== */

  deliveredStatus: {
    fontWeight: "bold",
  },

  pendingStatus: {
    fontWeight: "bold",
  },

  /* ==============================
     COMPLETION
     ============================== */

  completionBox: {
    marginTop: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  completionTitle: {
    fontSize: 9,
    fontWeight: "bold",
  },

  completionText: {
    marginTop: 4,
    color: "#555",
  },
});

interface DeliveryChecklistPdfProps {
  estimate: DeliveryEstimate;
  checklist: DeliveryChecklist;
}

export function DeliveryChecklistPdf({
  estimate,
  checklist,
}: DeliveryChecklistPdfProps) {
  const deliveryStats = getDeliveryStats(checklist);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ==============================
            COMPANY HEADER
            ============================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>
              PRAGATHI TIMBER
            </Text>

            <Text style={styles.companySubtitle}>
              Wood Estimation & Sales
            </Text>
          </View>

          <View style={styles.documentHeader}>
            <Text style={styles.documentTitle}>
              DELIVERY CHECKLIST
            </Text>

            <Text style={styles.headerText}>
              Estimate NO. {estimate.estimateNumber}
            </Text>

            <Text style={styles.headerText}>
              DATE: {estimate.date}
            </Text>

            <Text style={styles.headerText}>
              STATUS:{" "}
              {deliveryStats.isDelivered
                ? "Delivered"
                : "Pending"}
            </Text>
          </View>
        </View>

        {/* ==============================
            DELIVERED TO
            ============================== */}

        <View style={styles.deliveredTo}>
          <Text style={styles.sectionTitle}>
            DELIVERED TO
          </Text>

          <View style={styles.detailRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.partyName}>
                {estimate.partyName || "—"}
              </Text>
            </View>

            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>
                Type
              </Text>

              <Text style={styles.detailValue}>
                {estimate.type}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>
                Contact
              </Text>

              <Text style={styles.detailValue}>
                {estimate.contactNumber || "—"}
              </Text>
            </View>

            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>
                Reference
              </Text>

              <Text style={styles.detailValue}>
                {estimate.reference || "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* ==============================
            CUT SIZE
            ============================== */}

        {estimate.type === "CUT_SIZE" && (
          <>
            <View style={styles.table}>
              <Text style={styles.tableTitle}>
                WOOD ITEMS
              </Text>

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
                    styles.description,
                  ]}
                >
                  DESCRIPTION
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.size,
                    styles.center,
                  ]}
                >
                  SIZE (IN)
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.length,
                    styles.center,
                  ]}
                >
                  LENGTH (FT)
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.qty,
                    styles.center,
                  ]}
                >
                  QTY
                </Text>

                <Text
                  style={[
                    styles.cell,
                    styles.deliveryStatus,
                    styles.center,
                  ]}
                >
                  DELIVERY STATUS
                </Text>
              </View>

              {/* TABLE ROWS */}

              {estimate.items.map(
                (item, index) => {
                  const status =
                    checklist.items.find(
                      (deliveryItem) =>
                        deliveryItem.itemId ===
                        item.id,
                    );

                  const delivered =
                    status?.delivered ?? false;

                  return (
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
                          styles.description,
                        ]}
                      >
                        {item.woodType || "—"}
                      </Text>

                      <Text
                        style={[
                          styles.cell,
                          styles.size,
                          styles.center,
                        ]}
                      >
                        {item.breadth} x{" "}
                        {item.height}
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
                          styles.qty,
                          styles.center,
                        ]}
                      >
                        {item.quantity}
                      </Text>

                      <Text
                        style={[
                          styles.cell,
                          styles.deliveryStatus,
                          styles.center,
                          delivered
                            ? styles.deliveredStatus
                            : styles.pendingStatus,
                        ]}
                      >
                        {delivered
                          ? "Delivered"
                          : "Pending"}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>

            {/* ==============================
                ADDITIONAL ITEMS
                ============================== */}

            {estimate.additionalItemsEnabled &&
              estimate.additionalItems.length > 0 && (
                <View style={styles.additionalTable}>
                  <Text style={styles.tableTitle}>
                    ADDITIONAL ITEMS
                  </Text>

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
                        styles.additionalDescription,
                      ]}
                    >
                      DESCRIPTION
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        styles.additionalQty,
                        styles.center,
                      ]}
                    >
                      QTY
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        styles.additionalStatus,
                        styles.center,
                      ]}
                    >
                      DELIVERY STATUS
                    </Text>
                  </View>

                  {estimate.additionalItems.map(
                    (item, index) => {
                      const status =
                        checklist.additionalItems.find(
                          (deliveryItem) =>
                            deliveryItem.itemId ===
                            item.id,
                        );

                      const delivered =
                        status?.delivered ?? false;

                      return (
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
                              styles.additionalDescription,
                            ]}
                          >
                            {item.description || "—"}
                          </Text>

                          <Text
                            style={[
                              styles.cell,
                              styles.additionalQty,
                              styles.center,
                            ]}
                          >
                            {item.quantity}
                          </Text>

                          <Text
                            style={[
                              styles.cell,
                              styles.additionalStatus,
                              styles.center,
                              delivered
                                ? styles.deliveredStatus
                                : styles.pendingStatus,
                            ]}
                          >
                            {delivered
                              ? "Delivered"
                              : "Pending"}
                          </Text>
                        </View>
                      );
                    },
                  )}
                </View>
              )}
          </>
        )}

        {/* ==============================
            ROUND SIZE
            ============================== */}

        {estimate.type === "ROUND_SIZE" && (
          <View style={styles.table}>
            <Text style={styles.tableTitle}>
              ROUND SIZE ITEMS
            </Text>

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
                  styles.roundWoodType,
                ]}
              >
                WOOD TYPE
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.roundLogNo,
                  styles.center,
                ]}
              >
                LOG NO.
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.roundLength,
                  styles.center,
                ]}
              >
                LENGTH (M)
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.roundGirth,
                  styles.center,
                ]}
              >
                GIRTH (CM)
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.roundStatus,
                  styles.center,
                ]}
              >
                DELIVERY STATUS
              </Text>
            </View>

            {estimate.items.map(
              (item, index) => {
                const status =
                  checklist.items.find(
                    (deliveryItem) =>
                      deliveryItem.itemId ===
                      item.id,
                  );

                const delivered =
                  status?.delivered ?? false;

                return (
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
                        styles.roundWoodType,
                      ]}
                    >
                      {item.woodType || "—"}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        styles.roundLogNo,
                        styles.center,
                      ]}
                    >
                      {item.logNo || "—"}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        styles.roundLength,
                        styles.center,
                      ]}
                    >
                      {item.length}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        styles.roundGirth,
                        styles.center,
                      ]}
                    >
                      {item.girth}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        styles.roundStatus,
                        styles.center,
                        delivered
                          ? styles.deliveredStatus
                          : styles.pendingStatus,
                      ]}
                    >
                      {delivered
                        ? "Delivered"
                        : "Pending"}
                    </Text>
                  </View>
                );
              },
            )}
          </View>
        )}

        {/* ==============================
            CUSTOM
            ============================== */}

        {estimate.type === "CUSTOM" && (
          <View style={styles.table}>
            <Text style={styles.tableTitle}>
              ITEMS
            </Text>

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
                  styles.customDescription,
                ]}
              >
                DESCRIPTION
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.customQty,
                  styles.center,
                ]}
              >
                QTY
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.customStatus,
                  styles.center,
                ]}
              >
                DELIVERY STATUS
              </Text>
            </View>

            {estimate.items.map(
              (item, index) => {
                const status =
                  checklist.items.find(
                    (deliveryItem) =>
                      deliveryItem.itemId ===
                      item.id,
                  );

                const delivered =
                  status?.delivered ?? false;

                return (
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
                        styles.customDescription,
                      ]}
                    >
                      {item.description || "—"}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        styles.customQty,
                        styles.center,
                      ]}
                    >
                      {item.quantity}
                    </Text>

                    <Text
                      style={[
                        styles.cell,
                        styles.customStatus,
                        styles.center,
                        delivered
                          ? styles.deliveredStatus
                          : styles.pendingStatus,
                      ]}
                    >
                      {delivered
                        ? "Delivered"
                        : "Pending"}
                    </Text>
                  </View>
                );
              },
            )}
          </View>
        )}

        {/* ==============================
            DELIVERY SUMMARY
            ============================== */}

        <View style={styles.completionBox}>
          <Text style={styles.completionTitle}>
            DELIVERY STATUS
          </Text>

          <Text style={styles.completionText}>
            {deliveryStats.deliveredItems} of{" "}
            {deliveryStats.totalItems} items delivered
            {"  "}({deliveryStats.percentage}%)
          </Text>

          <Text style={styles.completionText}>
            Overall Status:{" "}
            {deliveryStats.isDelivered
              ? "Delivered"
              : "Pending"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/* =================================
   DELIVERY STATS
   ================================= */

function getDeliveryStats(
  checklist: DeliveryChecklist,
) {
  const allItems = [
    ...checklist.items,
    ...checklist.additionalItems,
  ];

  const totalItems = allItems.length;

  const deliveredItems = allItems.filter(
    (item) => item.delivered,
  ).length;

  const percentage =
    totalItems === 0
      ? 0
      : Math.round(
          (deliveredItems / totalItems) * 100,
        );

  return {
    deliveredItems,
    totalItems,
    percentage,
    isDelivered:
      totalItems > 0 &&
      deliveredItems === totalItems,
  };
}