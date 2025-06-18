import React, { useState } from "react";
import { medicalSupplies } from "~/mock/mock";
import EnhancedTabs from "~/libs/components/management/EnhancedTabs";
import { Assignment, LocalPharmacy, CheckCircle } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Container,
} from "@mui/material";
import MedicalSupplyCRUD from "./MedicalSupplyCRUD";
import DispenseSupplies from "./DispenseSupplies";
import SupplyLogs from "./SupplyLogs";
import { FileText, FileTextIcon } from "lucide-react";

function InventoryMedicalSupplies() {
  const [tabValue, setTabValue] = useState(0);
  const [supplyRecords, setSupplyRecords] = useState(medicalSupplies || []);
  const [dispenseLogs, setDispenseLogs] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [lastSavedRecord, setLastSavedRecord] = useState(null);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      {" "}
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Quản lý Vật tư Y tế trong kho
      </Typography>
      <EnhancedTabs
        tabs={[
          {
            label: "Kho Thuốc",
            icon: <LocalPharmacy />,
            content: "Quản lý kho thuốc và dược phẩm",
          },
          { label: "Cấp Phát", icon: <Assignment /> },
          {
            label: "Nhật Ký",
            icon: <FileText />,
            content: "Theo dõi lịch sử cấp phát thuốc",
          },
        ]}
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        variant="medical"
        size="medium"
        fullWidth={false}
      />
      {tabValue === 0 && (
        <MedicalSupplyCRUD
          supplyRecords={supplyRecords}
          setSupplyRecords={setSupplyRecords}
          dispenseLogs={dispenseLogs}
          setDispenseLogs={setDispenseLogs}
          showConfirmationDialog={showConfirmationDialog}
          setShowConfirmationDialog={setShowConfirmationDialog}
          lastSavedRecord={lastSavedRecord}
          setLastSavedRecord={setLastSavedRecord}
        />
      )}
      {/* Dispense Medication Tab */}
      {tabValue === 1 && (
        <DispenseSupplies
          supplyRecords={supplyRecords}
          setSupplyRecords={setSupplyRecords}
          setDispenseLogs={setDispenseLogs}
          dispenseLogs={dispenseLogs}
          setShowConfirmationDialog={setShowConfirmationDialog}
          setLastSavedRecord={setLastSavedRecord}
        />
      )}
      {/* Medication Log Tab */}
      {tabValue === 2 && (
        <SupplyLogs
          dispenseLogs={dispenseLogs}
          setDispenseLogs={setDispenseLogs}
          supplyRecords={supplyRecords}
        />
      )}
      <Dialog
        open={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            maxWidth: "400px",
            padding: "24px",
            textAlign: "center",
          },
          "& .MuiDialog-container": {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            paddingBottom: "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <CheckCircle size={60} className="text-green-500" />
          </Box>
          <Typography
            variant="h5"
            component="h3"
            sx={{ fontWeight: "bold", color: "#1a202c" }}
          >
            Ghi nhận Thành công!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "8px !important" }}>
          <Typography variant="body1" sx={{ color: "#4a5568" }}>
            Vật tư{" "}
            <Typography variant="body1" sx={{ fontWeight: "700" }}>
              {lastSavedRecord?.supplyName}
            </Typography>{" "}
            đã được thêm vào kho.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", gap: "16px", paddingTop: "24px" }}
        >
          <Button
            onClick={() => setShowConfirmationDialog(false)}
            variant="outlined"
            sx={{
              borderColor: "#cbd5e0",
              color: "#4a5568",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "12px 24px",
              "&:hover": { backgroundColor: "#f7fafc", borderColor: "#a0aec0" },
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              textTransform: "none",
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default InventoryMedicalSupplies;
