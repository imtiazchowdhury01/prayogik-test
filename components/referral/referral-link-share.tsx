"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Mail, Loader2 } from "lucide-react";
import { getReferralLink } from "@/lib/utils/referral-utils";
import toast from "react-hot-toast";

interface ReferralLinkShareProps {
  referralCode: string;
}

export function ReferralLinkShare({ referralCode }: ReferralLinkShareProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const referralLink = getReferralLink(referralCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const handleSendInvitation = async () => {
    // Validate email
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/referrals/send-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          referralCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      toast.success(`Invitation email has been sent to ${email}`);

      setEmail(""); // Clear the email input
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send invitation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with friends and earn rewards when they sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="w-full">
              <Input
                value={referralLink}
                readOnly
                className="font-mono text-sm focus:outline-none focus:border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              title="Copy Referral Link"
              onClick={handleCopy}
              variant="outline"
              size="icon"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Invitation</CardTitle>
          <CardDescription>
            Invite someone to join using your referral code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="email">Email Address</Label>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Button
                onClick={handleSendInvitation}
                disabled={loading}
                variant="primary"
                className="flex items-center whitespace-nowrap px-4"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
