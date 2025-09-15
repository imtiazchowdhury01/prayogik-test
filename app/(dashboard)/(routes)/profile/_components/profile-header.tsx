//@ts-nocheck
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Facebook,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import UserAvatar from "./avatar";

const ProfileHeader = ({ userData }: any) => {
  console.log("userData result:", userData);

  return (
    <Card className="mb-6 border-border/50 shadow-sm bg-white">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative">
              <UserAvatar />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance capitalize">
                    {userData.name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      {userData.phoneNumber}
                    </span>
                  </div>
                  {userData?.teacherProfile?.yearsOfExperience ? (
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm sm:text-base">
                        {userData?.teacherProfile.yearsOfExperience
                          ? userData?.teacherProfile.yearsOfExperience
                          : "No"}{" "}
                        experience
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Connect:
                  </span>
                  <div className="flex items-center gap-2">
                    {userData.linkedin && (
                      <a
                        href={userData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-brand/10 text-brand hover:bg-brand/5 hover:text-brand-foreground transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {userData.facebook && (
                      <a
                        href={userData.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-brand/10 text-brand hover:bg-brand/5 hover:text-brand-foreground transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {userData.twitter && (
                      <a
                        href={userData.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-brand/10 text-brand hover:bg-brand/5 hover:text-brand-foreground transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {userData.youtube && (
                      <a
                        href={userData.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-brand/10 text-brand hover:bg-brand/5 hover:text-brand-foreground transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                    {userData.website && (
                      <a
                        href={userData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-brand/10 text-brand hover:bg-brand/10 hover:text-brand-foreground transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground leading-relaxed text-pretty first-letter:capitalize">
                {userData.bio}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {userData?.teacherProfile?.subjectSpecializations.map((area) => (
                <Badge
                  key={area}
                  variant="secondary"
                  className="bg-brand text-white hover:bg-brand border-brand/20 rounded"
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
