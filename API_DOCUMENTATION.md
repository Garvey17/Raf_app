# Models & API Routes - Complete Documentation

Complete reference for all 7 models with schemas, endpoints, and workflows.

---

# Models Overview

| Model | Auto-Number Format | Key Features |
|-------|-------------------|--------------|
| **Customer** | - | Active/inactive status (90-day window) |
| **Order** | `ORD-YYYYMMDD-XXXX` | 6 status states, auto-updates customer |
| **Payment** | `PAY-{orderNumber}` | Staff verification tracking |
| **Dispatch** | - | Driver assignment workflow |
| **Delivery** | `DEL-{orderNumber}` | Auto-updates driver deliveries |
| **Staff** | `STF-YYYYMMDD-XXX` | Role-based access, 8 roles |
| **Driver** | `DRV-YYYYMMDD-XXX` | Auto-tracked delivery count |

---

# 1. User/Customer Model
[UserModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/UserModel.js)

**Fields:** name, email, phone, location, verificationStatus, status (virtual)  
**Endpoints:** `GET/PATCH /api/customers`, `PATCH /api/customers/[id]/verify`

---

# 2. Order Model
[OrderModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/OrderModel.js)

**Fields:** orderNumber (auto), customerName, items[], status, address, deliveryDate  
**Endpoints:** `GET/POST /api/orders`, `PATCH /api/orders/[id]/status`

---

# 3. Payment Model
[PaymentModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/PaymentModel.js)

**Fields:** paymentNumber (auto), customerName, paymentMethod, verificationStatus, verifiedBy  
**Endpoints:** `GET/POST /api/payments`, `PATCH /api/payments/[id]/verify`

---

# 4. Dispatch Model
[DispatchModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/DispatchModel.js)

**Fields:** orderNumber, destination, dispatchStatus, driver, assignedBy  
**Key:** `GET /api/dispatches/approved-orders`, `PATCH /api/dispatches/[id]/assign-driver`

---

# 5. Delivery Model
[DeliveryModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/DeliveryModel.js)

**Fields:** deliveryNumber (auto), driver, deliveryStatus, receivedBy, deliveredAt  
**Key:** `GET /api/deliveries/dispatched-orders`, `PATCH /api/deliveries/[id]/confirm`

---

# 6. Staff Model
[StaffModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/StaffModel.js)

**Fields:** staffNumber (auto), name, email, role, department, status, dateJoined  
**Roles:** admin, transport_officer, warehouse_manager, sales_representative, customer_service, accountant, driver, other  
**Departments:** administration, logistics, warehouse, sales, customer_service, finance, operations, other

**Endpoints:**
- `GET /api/staff?status=active&role=transport_officer`
- `POST /api/staff/create`
- `PATCH /api/staff/[id]/status`
- `PATCH /api/staff/[id]/password`

---

# 7. Driver Model
[DriverModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/DriverModel.js)

| Field | Description |
|-------|-------------|
| `driverNumber` | **Auto:** `DRV-YYYYMMDD-XXX` |
| `name`, `email`, `phone` | Driver details |
| `role` | Always "driver" |
| `department` | Always "logistics" |
| `vehicleAssigned` | Vehicle number/ID |
| `totalDeliveries` | **Auto-updated** on delivery confirmation |
| `dateJoined` | Date driver joined |
| `status` | `"active"`, `"inactive"`, `"on_leave"`, `"suspended"` |
| `licenseNumber`, `licenseExpiry` | License info |
| `lastDeliveryDate` | **Auto-updated** on delivery |
| `rating` | 0-5 rating |

## Driver API Endpoints

### Get All Drivers
```
GET /api/drivers?status=active&vehicleAssigned=assigned
```

**Filter options:**
- `status` - active/inactive/on_leave/suspended
- `vehicleAssigned` - "assigned"/"unassigned" or specific vehicle number
- `search` - Search by name, email, phone, or driver number

### Create Driver
```
POST /api/drivers/create
Body: {
  "name": "John Driver",
  "email": "john@company.com",
  "phone": "+1234567890",
  "vehicleAssigned": "TRK-001",
  "licenseNumber": "DL123456",
  "licenseExpiry": "2026-12-31",
  "password": "password123"
}
```

**Auto-generates:** Driver number based on join date

### Get Driver Details
```
GET /api/drivers/[id]
```

### Update Driver
```
PATCH /api/drivers/[id]
Body: {
  "vehicleAssigned": "TRK-002",
  "status": "active",
  "rating": 4.5
}
```

**Protected:** `driverNumber`, `totalDeliveries` (auto-updated)

### Update Driver Status
```
PATCH /api/drivers/[id]/status
Body: { "status": "on_leave" }
```

### Get Driver Deliveries
```
GET /api/drivers/[id]/deliveries
```

Returns driver's delivery history and total count.

---

# Complete Workflow

## Order → Dispatch → Delivery → Driver Update

1. **Order Created** → `POST /api/orders/create` → `"pending"`
2. **Order Approved** → `PATCH /api/orders/[id]/status` → `"approved"`
3. **Dispatch Created** → `POST /api/dispatches/create` → `"ready_for_dispatch"`
4. **Driver Assigned** → `PATCH /api/dispatches/[id]/assign-driver` → `"dispatched"`
5. **Delivery Created** → `POST /api/deliveries/create` → `"in_transit"`
6. **Delivery Confirmed** → `PATCH /api/deliveries/[id]/confirm` → `"delivered"`
   - ✅ Updates Order → `"delivered"`
   - ✅ Updates Dispatch → `"delivered"`
   - ✅ **Increments Driver totalDeliveries**
   - ✅ **Updates Driver lastDeliveryDate**

---

# Testing Examples

## Driver Tests
```bash
# Create driver
curl -X POST http://localhost:3000/api/drivers/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Driver",
    "email": "john@company.com",
    "phone": "+1234567890",
    "vehicleAssigned": "TRK-001",
    "licenseNumber": "DL123456"
  }'

# Get active drivers
curl http://localhost:3000/api/drivers?status=active

# Get drivers with vehicles assigned
curl http://localhost:3000/api/drivers?vehicleAssigned=assigned

# Get driver deliveries
curl http://localhost:3000/api/drivers/[ID]/deliveries

# Update driver status
curl -X PATCH http://localhost:3000/api/drivers/[ID]/status \
  -H "Content-Type: application/json" \
  -d '{"status": "on_leave"}'
```

---

# Summary

## Models (7)
1. [UserModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/UserModel.js)
2. [OrderModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/OrderModel.js)
3. [PaymentModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/PaymentModel.js)
4. [DispatchModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/DispatchModel.js)
5. [DeliveryModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/DeliveryModel.js)
6. [StaffModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/StaffModel.js)
7. [DriverModel.js](file:///c:/Users/USER/Downloads/AI-EXP/m-commerce/src/lib/models/DriverModel.js)

## API Routes (39 total)
Customer (3) • Order (4) • Payment (4) • Dispatch (7) • Delivery (7) • Staff (5) • Driver (5) • Auth (2)

## Auto-Numbers
- Order: `ORD-20251127-0001`
- Payment: `PAY-ORD-20251127-0001`
- Delivery: `DEL-ORD-20251127-0001`
- Staff: `STF-20251127-001`
- Driver: `DRV-20251127-001`

---

# Key Features

✅ **Auto-tracking:** Driver deliveries increment automatically  
✅ **Cascading updates:** Delivery confirmation updates order, dispatch, and driver  
✅ **Role-based:** Staff with 8 roles, drivers with dedicated tracking  
✅ **Vehicle management:** Track vehicle assignments per driver  
✅ **Performance metrics:** Driver ratings and delivery counts  
✅ **License tracking:** Monitor driver license expiry
