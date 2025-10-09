// @ts-nocheck
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Building,
  Briefcase,
  Globe,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateForDisplay } from "@/lib/utils/formatDateForDisplay";
import { SendAttendeeMailButton } from "@/components/common/send-attendee-mail-button";
import { sendMailToAttendee } from "@/lib/utils/sendMailToAttendees";
import { EventType } from "@prisma/client";

interface AttendeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendee: {
    user: {
      id?: string;
      name?: string;
      email?: string;
      phoneNumber?: string;
      avatar?: string;
      bio?: string;
      location?: string;
      company?: string;
      jobTitle?: string;
      website?: string;
      facebook?: string;
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      createdAt?: string;
    };
    event?: {
      title?: string;
      type?: string;
      price?: number;
    };
    registeredAt?: string;
    purchase?: boolean;
    isApproved?: boolean;
  } | null;
}

export const AttendeeProfileModal: React.FC<AttendeeProfileModalProps> = ({
  isOpen,
  onClose,
  attendee,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!attendee?.user) return null;
  const { user, event, registeredAt, purchase, isApproved } = attendee;
  
  // Updated logic: check isApproved status and payment conditions
  const isDisabled =
    !isApproved ||
    event?.type === EventType.EOI ||
    (event?.type === "PAID" && (purchase || !event?.price || event.price <= 0));

  const handleSendMailClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirmation(false);
    await sendMailToAttendee(attendee);
  };

  const handleCancelSend = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || "User avatar"}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold uppercase">
                    {user.name || "Unknown User"}
                  </h2>
                  {user.jobTitle && user.company && (
                    <p className="text-sm text-gray-600">
                      {user.jobTitle} at {user.company}
                    </p>
                  )}
                  {/* Email and Phone below name */}
                  <div className="flex flex-col gap-1 mt-1 font-normal space-y-1">
                    {user.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    )}
                    {user.phoneNumber && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {user.phoneNumber}
                        </span>
                      </div>
                    )}
                    {/* Social Links moved here */}
                    {(user.facebook ||
                      user.linkedin ||
                      user.twitter ||
                      user.instagram) && (
                      <div className="flex items-center gap-3 mt-2">
                        {user.facebook && (
                          <Link
                            href={user.facebook}
                            target="_blank"
                            className="hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src="/icon/social/Facebook.svg"
                              width={20}
                              height={20}
                              alt="Facebook"
                              className="object-cover"
                            />
                          </Link>
                        )}
                        {user.linkedin && (
                          <Link
                            href={user.linkedin}
                            target="_blank"
                            className="hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src="/icon/social/linkedin.svg"
                              width={20}
                              height={20}
                              alt="LinkedIn"
                              className="object-cover"
                            />
                          </Link>
                        )}
                        {user.twitter && (
                          <Link
                            href={user.twitter}
                            target="_blank"
                            className="hover:opacity-80 transition-opacity"
                          >
                            <span className="text-sm text-sky-500 hover:text-sky-700">
                              Twitter
                            </span>
                          </Link>
                        )}
                        {user.instagram && (
                          <Link
                            href={user.instagram}
                            target="_blank"
                            className="hover:opacity-80 transition-opacity"
                          >
                            <span className="text-sm text-pink-600 hover:text-pink-800">
                              Instagram
                            </span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Send Mail Button - Now enabled for FREE events */}
              {user.email && (
                <div className="mt-4 -mr-1">
                  <SendAttendeeMailButton
                    onClick={handleSendMailClick}
                    iconOnly={true}
                    disabled={isDisabled}
                    hasPaidRows={purchase && event?.type === "PAID"}
                  />
                </div>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {/* Attendee profile and registration details */}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Additional Information - removed email and phone from here since they're now in header */}
            {(user.location || user.website) && (
              <>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <Link
                          href={user.website}
                          target="_blank"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Website
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Professional Information */}
            {(user.company || user.jobTitle) && (
              <>
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{user.company}</span>
                      </div>
                    )}
                    {user.jobTitle && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{user.jobTitle}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Bio */}
            {user.bio && (
              <>
                <div>
                  <h3 className="text-lg font-medium mb-3">About</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              </>
            )}
            <Separator />
            {/* Registration Details */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Registration Details
              </h3>
              <div className="space-y-3">
                {event?.title && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Event:
                    </span>
                    <p className="text-sm mt-1">{event.title}</p>
                  </div>
                )}
                {event?.type && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Event Type:
                    </span>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            event.type === "FREE"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : ""
                          }
                          ${
                            event.type === "PAID"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : ""
                          }
                          ${
                            event.type === "EOI"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : ""
                          }
                        `}
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                )}
                {registeredAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Registered On:
                    </span>
                    <p className="text-sm mt-1">
                      {formatDateForDisplay(registeredAt)}
                    </p>
                  </div>
                )}
                {/* Approval Status */}
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Approval Status:
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={
                        isApproved
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-orange-100 text-orange-700 border-orange-200"
                      }
                    >
                      {isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
                {/* Only show payment status for PAID events */}
                {event?.type === "PAID" && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Payment Status:
                    </span>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={
                          purchase
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {purchase ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </div>
                )}
                {user.createdAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      User Since:
                    </span>
                    <p className="text-sm mt-1">
                      {formatDateForDisplay(user.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Send Email</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send an email to{" "}
              {user.name || "this attendee"}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSend}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSend}>
              Yes, Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
