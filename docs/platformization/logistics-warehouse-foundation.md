# Logistics & Warehouse Foundation

## 1. Advanced Procurement & B2B Hub
- **RFQ Workflows**: Support for B2B bulk buyers initiating Requests For Quotations.
- **Purchase Orders**: Institutionalizing large-scale sourcing directly from Fish Landing Centers to Central Warehouses.
- **Contracts**: System handles pricing lock-ins and vendor performance scoring based on defect rates and delivery speed.

## 2. Logistics Ecosystem
The platform delegates physical transit but controls the data ecosystem.
- **Delivery Partners**: Architecture supports multiple 3PLs dynamically routing based on load and region.
- **Cold Chain Tracking**: IoT integration placeholders exist to record temperature anomalies during transit against an Order ID.
- **Delivery Zones**: Polygons mapping specific PIN codes. Sellers attach to specific Delivery Zones.

## 3. Warehouse Operations
- **Network Topology**: Supports Central Warehouses feeding Regional Warehouses feeding Distribution Centers.
- **Stock Movements**: Inventory Transfers track stock in-transit between facilities.
- **Batch & Lot Tracking**: Essential for perishables. Every inbound receipt generates a specific `Lot ID` with an associated expiry date, enabling precise FIFO (First In, First Out) inventory deduction and targeted product recalls if contamination is detected.
