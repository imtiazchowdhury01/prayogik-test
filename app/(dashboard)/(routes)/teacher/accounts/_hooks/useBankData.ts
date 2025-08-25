//@ts-nocheck 
import { useState, useEffect } from "react";

export const useBankData = () => {
  const [bankData, setBankData] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBankData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/data/bank_data_minified.json");
      const data = await response.json();
      setBankData(data);

      // Extract unique districts
      const districts = new Set();
      data.forEach((bank) => {
        bank.districts.forEach((district) => {
          districts.add(district.district_name);
        });
      });
      setAvailableDistricts([...districts].sort());
    } catch (error) {
      console.error("Error loading bank data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBanksForDistrict = (districtName) => {
    return bankData.filter((bank) =>
      bank.districts.some((district) => district.district_name === districtName)
    );
  };

  const getBranchesForBankAndDistrict = (bankSlug, districtName) => {
    const bank = bankData.find((b) => b.slug === bankSlug);
    if (!bank) return [];

    const district = bank.districts.find(
      (d) => d.district_name === districtName
    );
    return district ? district.branches : [];
  };

  const getBankBySlug = (slug) => {
    return bankData.find((bank) => bank.slug === slug);
  };

  useEffect(() => {
    loadBankData();
  }, []);

  return {
    bankData,
    availableDistricts,
    loading,
    getBanksForDistrict,
    getBranchesForBankAndDistrict,
    getBankBySlug,
  };
};
