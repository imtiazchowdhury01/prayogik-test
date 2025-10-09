"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  calculateMaxCreditsUsed,
  CREDIT_VALUE,
} from "@/lib/utils/wallet/walletUtils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { getWalletBalanceAction } from "@/services/wallet";
import { Plus } from "lucide-react";

// ✅ Define Props Interface
interface ApplyCreditProps {
  originalPrice: number;
  form?: {
    setValue: (name: string, value: number) => void;
  };
  formFieldName?: string;
  selectedCredits?: number | string;
  setSelectedCredits?: React.Dispatch<React.SetStateAction<number | string>>;
  userId: string;
  setWalletId?: React.Dispatch<React.SetStateAction<string>>;
}

const ApplyCredit: React.FC<ApplyCreditProps> = ({
  originalPrice = 0,
  form,
  formFieldName,
  setSelectedCredits,
  userId,
  setWalletId,
}) => {
  // Redeem code section states
  const [creditsToRedeem, setCreditsToRedeem] = React.useState <any>("");
  const [showRedeemSection, setShowRedeemSection] = React.useState(false);
  const [isRedemptionApplied, setIsRedemptionApplied] = React.useState(false);
  const [availableCredits, setAvailableCredits] = React.useState<number>(0);

  // Fetch available credits for the user
  React.useEffect(() => {
    // Fetch available credits for the user from API or props
    const fetchData = async () => {
      // Simulating an API call to get wallet balance
      // TODO: Fetch from actual API
      const userWallet: any = await getWalletBalanceAction(userId);
      // console.log("userWallet", userWallet?.data);
      setAvailableCredits(
        userWallet?.success === true ? userWallet?.data?.availableCredits : 0
      );
      if (userWallet && typeof setWalletId === "function") {
        setWalletId(userWallet?.data?.id || "");
      }
    };
    fetchData();
  }, [userId]);
  // console.log("availableCredits", availableCredits);
  // Calculate max redeemable credits based on 80% of course price from .env
  const CREDIT_REDEMPTION_PERCENTAGE =
    Number(process.env.NEXT_PUBLIC_MAX_CREDIT_REDEMPTION_PERCENTAGE) || 80;

  // Calculate max redeemable credits based on original price and available credits
  const maxRedeemableCredits = calculateMaxCreditsUsed(
    originalPrice,
    availableCredits
  );

  /*
   * Handlers for redeem code section
   * Handler to apply credits
   */
  const handleApplyCredits = () => {
    const credits = parseInt(creditsToRedeem) || 0;
    // console.log("credits", credits);
    if (credits > 0 && credits <= maxRedeemableCredits) {
      setIsRedemptionApplied(true);
      // ✅ Update selected credits if setter is provided
      if (setSelectedCredits && typeof setSelectedCredits === "function") {
        setSelectedCredits(credits);
      }
      // ✅ Update form value if form and field name exist
      if (form && formFieldName) {
        const newPrice = Number(originalPrice) - credits / Number(CREDIT_VALUE);
        form.setValue(formFieldName, newPrice);
      }
    }
  };

  /*
   * Handler to remove applied credits
   * Reset the state and form value
   */
  const handleRemoveCredits = () => {
    setIsRedemptionApplied(false);
    setCreditsToRedeem("");

    // ✅ Update selected credits if setter is provided
    if (setSelectedCredits && typeof setSelectedCredits === "function") {
      setSelectedCredits(0);
    }
    // ✅ Update form value if form and field name exist
    if (form && formFieldName) {
      form.setValue(formFieldName, Number(originalPrice));
    }
  };

  // const discount =
  //   isRedemptionApplied && selectedCredits
  //     ? parseInt(creditsToRedeem) || 0 / Number(CREDIT_VALUE)
  //     : 0;

  return (
    <div className="rounded-lg overflow-hidden">
      <label className="flex items-center gap-3 pb-1 cursor-pointer">
        <Checkbox
          checked={showRedeemSection}
          onCheckedChange={(checked: any) => {
            setShowRedeemSection(checked);
            if (!checked) {
              handleRemoveCredits();
            }
          }}
          className="w-4 h-4 text-primary-500 border-primary-500 rounded focus:ring-primary-700 data-[state=checked]:bg-primary-500"
        />

        <div className="flex-1">
          <Label
            // htmlFor={pricingOptions.subscription.type}
            className="flex items-center gap-2 cursor-pointer font-semibold text-[18px]"
          >
            ওয়ালেট পেমেন্ট
          </Label>
        </div>
      </label>

      {showRedeemSection && (
        <div className="bg-white border-gray-200 space-y-3 mt-1">
          {availableCredits ? (
            <>
              {!isRedemptionApplied ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm flex gap-1">
                      <span>ক্রেডিট নির্বাচন করুন:</span>
                      <span className="font-semibold text-primary-500">
                        {convertNumberToBangla(availableCredits || 0)} ক্রেডিট
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 border px-2.5 py-0.5 rounded-md">
                        <input
                          type="range"
                          min="0"
                          max={maxRedeemableCredits}
                          step="1"
                          value={creditsToRedeem || 0}
                          onChange={(e) => setCreditsToRedeem(e.target.value)}
                          style={{
                            background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${
                              ((creditsToRedeem || 0) / maxRedeemableCredits) *
                              100
                            }%, #e5e7eb ${
                              ((creditsToRedeem || 0) / maxRedeemableCredits) *
                              100
                            }%, #e5e7eb 100%)`,
                          }}
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs">
                          <span>{convertNumberToBangla(0)}</span>
                          <span>
                            {convertNumberToBangla(creditsToRedeem || 0)}
                          </span>
                        </div>
                      </div>
                      <div className="">
                        <Button
                          onClick={handleApplyCredits}
                          disabled={
                            !creditsToRedeem || parseInt(creditsToRedeem) <= 0
                          }
                          variant={"outline"}
                          className="w-fit py-6"
                          // className="w-full py-2 bg-primary hover:bg-primary-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-md disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                          <span>যোগ করুন</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-primary-50 border border-primary-100 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-900">
                        {convertNumberToBangla(creditsToRedeem)} ক্রেডিট ব্যবহৃত
                      </p>
                      {/* <p className="text-xs text-primary">
                        ছাড়: ৳ {convertNumberToBangla(discount)}
                      </p> */}
                    </div>
                    <Button
                      onClick={handleRemoveCredits}
                      className="px-3 py-1 h-fit bg-white hover:bg-red-50 text-red-600 border border-red-300 rounded text-xs"
                    >
                      বাতিল
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-xs bg-gray-50 rounded p-2">
                {convertNumberToBangla(originalPrice)} টাকা থেকে সর্বোচ্চ{" "}
                {convertNumberToBangla(CREDIT_REDEMPTION_PERCENTAGE)}% ক্রেডিট
                থেকে ব্যবহার করতে পারবেন
              </p>
            </>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default ApplyCredit;
