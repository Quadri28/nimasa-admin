import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "14%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#f3f3f3",
  },
  tableCol: {
    width: "14%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
  },
});

const MemberLedgerPDF = ({ currentRecord }) => {
  if (!currentRecord || currentRecord.length === 0) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  const account = currentRecord[0]; // Assuming only one record per page

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Account Details Section */}
        <View style={styles.section}>
          <Text style={styles.header}>{account.branchAddress}</Text>
          <Text style={styles.header}>Account Details</Text>
          <Text>Account Name: {account.accountName.trim()}</Text>
          <Text>Account Number: {account.accountNumber}</Text>
        </View>

        {/* Summary Details Section */}
        <View style={styles.section}>
          <Text style={styles.header}>Summary Details</Text>
          <Text>Branch: {account.branchName}</Text>
          <Text>Opening Balance: {account.openingBalance || 0}</Text>
          <Text>Closing Balance: {account.closingBalance || 0}</Text>
          <Text>Product Name: {account.productName || "N/A"}</Text>
        </View>

        {/* Transaction Table */}
        <View style={styles.section}>
          <Text style={styles.header}>Transactions</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Date</Text>
              <Text style={styles.tableColHeader}>Transaction Details</Text>
              <Text style={styles.tableColHeader}>Reference</Text>
              <Text style={styles.tableColHeader}>Value Date</Text>
              <Text style={styles.tableColHeader}>Dr</Text>
              <Text style={styles.tableColHeader}>Cr</Text>
              <Text style={styles.tableColHeader}>Balance</Text>
            </View>

            {/* Table Rows */}
            {account.memberLedgers.map((ledger, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{ledger.date || ""}</Text>
                <Text style={styles.tableCol}>{ledger.transactionDetail || ""}</Text>
                <Text style={styles.tableCol}>{ledger.reference || ""}</Text>
                <Text style={styles.tableCol}>{ledger.valueDate || ""}</Text>
                <Text style={styles.tableCol}>{ledger.dr || 0}</Text>
                <Text style={styles.tableCol}>{ledger.cr || 0}</Text>
                <Text style={styles.tableCol}>{ledger.balance || 0}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default MemberLedgerPDF;