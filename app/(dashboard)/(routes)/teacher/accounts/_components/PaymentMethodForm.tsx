//@ts-nocheck
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { RequiredLabelText } from "./requiredLabelText";
import toast from "react-hot-toast";
import { useBankData } from "../_hooks/useBankData";
import { BankSelector } from "./BankSelector";

export const PaymentMethodForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    branch: "",
    routingNo: "",
    accName: "",
    type: "bank",
    bankName: "",
    active: true,
  });

  const [bankSelection, setBankSelection] = useState({
    selectedDistrict: "",
    selectedBank: "",
    selectedBranch: "",
    availableBanks: [],
    availableBranches: [],
  });

  const [comboboxState, setComboboxState] = useState({
    districtOpen: false,
    bankOpen: false,
    branchOpen: false,
  });

  const {
    availableDistricts,
    getBanksForDistrict,
    getBranchesForBankAndDistrict,
    getBankBySlug,
  } = useBankData();

  const handleDistrictSelect = (districtName) => {
    const banksInDistrict = getBanksForDistrict(districtName);

    setBankSelection({
      selectedDistrict: districtName,
      selectedBank: "",
      selectedBranch: "",
      availableBanks: banksInDistrict,
      availableBranches: [],
    });

    setFormData((prev) => ({
      ...prev,
      bankName: "",
      branch: "",
      routingNo: "",
    }));

    setComboboxState((prev) => ({ ...prev, districtOpen: false }));
  };

  const handleBankSelect = (bankSlug) => {
    const bank = getBankBySlug(bankSlug);
    if (!bank) return;

    const branches = getBranchesForBankAndDistrict(
      bankSlug,
      bankSelection.selectedDistrict
    );

    setBankSelection((prev) => ({
      ...prev,
      selectedBank: bankSlug,
      selectedBranch: "",
      availableBranches: branches,
    }));

    setFormData((prev) => ({
      ...prev,
      bankName: bank.name,
      branch: "",
      routingNo: "",
    }));

    setComboboxState((prev) => ({ ...prev, bankOpen: false }));
  };

  const handleBranchSelect = (branchSlug) => {
    const branchData = bankSelection.availableBranches.find(
      (b) => b.branch_slug === branchSlug
    );

    if (branchData) {
      setBankSelection((prev) => ({
        ...prev,
        selectedBranch: branchSlug,
      }));

      setFormData((prev) => ({
        ...prev,
        branch: branchData.branch_name,
        routingNo: branchData.routing_number,
      }));

      setComboboxState((prev) => ({ ...prev, branchOpen: false }));
    }
  };

  const handleSubmit = async () => {
    const { accountNumber, type, bankName, branch, accName } = formData;

    // Client-side validation
    if (!accountNumber || !type || !bankName || !branch || !accName) {
      toast.error("Please fill in all required fields!");
      return;
    }

    // Additional validation
    if (accountNumber.length < 10) {
      toast.error("Account number must be at least 10 digits");
      return;
    }

    if (accName.length < 2) {
      toast.error("Account name must be at least 2 characters");
      return;
    }

    try {
      const success = await onSubmit(formData);
      if (success) {
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting payment method");
    }
  };

  const resetForm = () => {
    setFormData({
      accountNumber: "",
      branch: "",
      routingNo: "",
      accName: "",
      type: "bank",
      bankName: "",
      active: true,
    });

    setBankSelection({
      selectedDistrict: "",
      selectedBank: "",
      selectedBranch: "",
      availableBanks: [],
      availableBranches: [],
    });

    setComboboxState({
      districtOpen: false,
      bankOpen: false,
      branchOpen: false,
    });
  };

  return (
    <div>
      {/* Account Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          <RequiredLabelText text="Account Name" className="m-0" />
        </label>
        <Input
          type="text"
          value={formData.accName}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[A-Za-z\s]*$/.test(value)) {
              setFormData((prev) => ({ ...prev, accName: value }));
            }
          }}
          placeholder="Enter Account Name"
          className="mt-1"
        />
      </div>

      {/* Account Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          <RequiredLabelText text="Account Number" className="m-0" />
        </label>
        <Input
          type="number"
          value={formData.accountNumber}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))
          }
          placeholder="Enter Account Number"
          className="mt-1"
        />
      </div>

      {/* Bank Selector */}
      <BankSelector
        districts={availableDistricts}
        banks={bankSelection.availableBanks}
        branches={bankSelection.availableBranches}
        selectedDistrict={bankSelection.selectedDistrict}
        selectedBank={bankSelection.selectedBank}
        selectedBranch={bankSelection.selectedBranch}
        onDistrictSelect={handleDistrictSelect}
        onBankSelect={handleBankSelect}
        onBranchSelect={handleBranchSelect}
        districtOpen={comboboxState.districtOpen}
        bankOpen={comboboxState.bankOpen}
        branchOpen={comboboxState.branchOpen}
        setDistrictOpen={(open) =>
          setComboboxState((prev) => ({ ...prev, districtOpen: open }))
        }
        setBankOpen={(open) =>
          setComboboxState((prev) => ({ ...prev, bankOpen: open }))
        }
        setBranchOpen={(open) =>
          setComboboxState((prev) => ({ ...prev, branchOpen: open }))
        }
      />

      {/* Routing Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          <RequiredLabelText text="Routing No." className="m-0" />
        </label>
        <Input
          type="text"
          value={formData.routingNo}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, routingNo: e.target.value }))
          }
          placeholder="Enter routing number or select branch to auto-fill"
          className="mt-1"
        />
      </div>

      {/* Active Checkbox */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={() =>
              setFormData((prev) => ({ ...prev, active: !prev.active }))
            }
            className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm">
            Select this option if you want to receive payment on this account
          </span>
        </label>
      </div>

      <Button
        onClick={handleSubmit}
        className={`w-full mt-4 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Save"}
      </Button>
    </div>
  );
};
