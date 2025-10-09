import { EventRegistration, User } from "@prisma/client";

export interface UserWithProfile {
  id: string;
  email: string;
  studentProfile: {
    id: string;
    subscription?: {
      subscriptionPlan: any;
    } | null;
  };
  isNewUser: boolean;
  temporaryPassword: string | undefined;
  username: string | undefined;
  eventRegistrations: EventRegistration[]
}

