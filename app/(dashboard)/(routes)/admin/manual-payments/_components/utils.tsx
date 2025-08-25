import { Badge } from "@/components/ui/badge";
import {
  bkashManualPaymentStatus,
  BkashManualPaymentType,
} from "@prisma/client";

export function getBkashManualPaymentStatusBadge(status: string) {
  switch (status) {
    case bkashManualPaymentStatus.FAILED:
      return <Badge className="bg-slate-500 hover:bg-slate-600">FAILED</Badge>;
    case bkashManualPaymentStatus.PENDING:
      return <Badge className="bg-amber-500 hover:bg-amber-600">PENDING</Badge>;
    case bkashManualPaymentStatus.SUCCESS:
      return <Badge className="bg-green-500 hover:bg-green-600">SUCCESS</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export function getBkashPaymentTypeBadge(type: string) {
  switch (type) {
    case BkashManualPaymentType.REGULAR:
      return (
        <Badge
          variant="default"
          className="border-gray-500 text-gray-500 text-sm bg-white font-semibold px-2.5 py-0 hover:bg-white"
        >
          REGULAR
        </Badge>
      );
    case BkashManualPaymentType.OFFER:
      return (
        <Badge
          variant="default"
          className="border-[#F59E0B] text-[#F59E0B] text-sm bg-white font-semibold px-2.5 py-0 hover:bg-white"
        >
          OFFER
        </Badge>
      );
    case BkashManualPaymentType.SUBSCRIPTION:
      return (
        <Badge
          variant="default"
          className="border-red-500 border text-red-500 bg-white text-sm font-semibold px-2.5 py-0 hover:bg-white"
        >
          SUBSCRIPTION
        </Badge>
      );
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
}
