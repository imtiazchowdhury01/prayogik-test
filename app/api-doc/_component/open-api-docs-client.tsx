"use client";

import { OpenAPIV1 } from "@/lib/utils/openai/ts-rest";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function OpenApiDocsClient() {
  return <SwaggerUI spec={OpenAPIV1} displayOperationId={true} />;
}
