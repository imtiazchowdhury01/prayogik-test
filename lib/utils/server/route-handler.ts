/* eslint-disable @typescript-eslint/no-explicit-any */

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import jwt from "jsonwebtoken";

export class RouteHandler {
  private routes: Map<
    string,
    {
      schema: z.ZodSchema<any>;
      handler: (
        req: NextRequest,
        body: any,
        variables: any,
        user?: any
      ) => Promise<unknown>;
      requiredRoles?: string[];
    }
  > = new Map();

  // Add a route with validation and handler, including optional role protection
  addRoute<T>(
    schema: z.ZodSchema<T>,
    handler: (
      req: NextRequest,
      body: T,
      variables?: any,
      user?: any
    ) => Promise<unknown>,
    method: string = "POST",
    requiredRoles?: string[] // Pass requiredRoles for authorization (array of roles)
  ) {
    this.routes.set(method.toUpperCase(), {
      schema,
      handler,
      requiredRoles,
    });
  }

  // Middleware to check authentication and authorization
  private async authenticate(req: NextRequest, requiredRoles?: string[]) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    console.log({ token });

    if (!token) {
      throw new Error("Unauthorized");
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = token.role as string;
      if (!userRole || !requiredRoles.includes(userRole)) {
        throw new Error("Forbidden");
      }
    }

    return token;
  }

  // Handle the incoming request with validation, authentication, and authorization
  async handle(req: NextRequest, variables?: any) {
    const method = req.method.toUpperCase();
    const routeConfig = this.routes.get(method);

    if (!routeConfig) {
      return NextResponse.json(
        { msg: `Method ${method} Not Allowed` },
        { status: 405 }
      );
    }

    try {
      // Await params if they exist
      const resolvedVariables = variables ? await variables : {};

      // Check authentication
      const user =
        routeConfig.requiredRoles &&
        (await this.authenticate(req, routeConfig.requiredRoles));

      // Parse and validate the request body using Zod if the method is POST or PUT
      let parsedBody: any = {};
      if (method === "POST" || method === "PUT") {
        const body = await req.json();
        parsedBody = routeConfig.schema.parse(body); // This will throw an error if validation fails
      }

      // Call the route's handler if validation and authentication are successful
      const response = await routeConfig.handler(
        req,
        parsedBody,
        resolvedVariables,
        user
      );

      const status = (response as any)?.status || 200;

      // Return the response from the handler
      return NextResponse.json(response, { status });
    } catch (error: any) {
      // Handle validation or other errors
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(
          (err) => `${err.path.join(".")} - ${err.message}`
        );
        return NextResponse.json(
          { msg: "Validation Error", errors: errorMessages },
          { status: 400 }
        );
      }

      if (error.message === "Unauthorized") {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
      }

      if (error.message === "Forbidden") {
        return NextResponse.json({ msg: "Forbidden" }, { status: 403 });
      }

      console.error("Error:", error);
      return NextResponse.json(
        { msg: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
