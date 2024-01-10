import {
  STATUS_ERROR,
  STATUS_SUCCESS,
  STATUS_UNAUTHENTICATED,
} from "@/lib/contants";
import { NextResponse } from "next/server";

export class ApiResponse {
  status: string;
  message: any | null;
  data?: any | null;
  httpStatus?: number;

  constructor(
    status: string,
    httpStatus: number,
    message: any | null = null,
    data: any | null = null
  ) {
    this.status = status;
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
  }

  toJson() {
    return NextResponse.json(
      {
        status: this.status,
        ...(this.message !== null && { message: this.message }),
        ...(this.data !== null && { data: this.data }),
      },
      {
        status: this.httpStatus,
      }
    );
  }

  static error(
    message: any,
    httpStatus: number = 500,
    data: any | null = null
  ) {
    const response = new ApiResponse(STATUS_ERROR, httpStatus, message, data);
    return response.toJson();
  }

  static success(
    message: any,
    httpStatus: number = 200,
    data: any | null = null
  ) {
    const response = new ApiResponse(STATUS_SUCCESS, httpStatus, message, data);
    return response.toJson();
  }

  static unAuthenticated() {
    const response = new ApiResponse(STATUS_UNAUTHENTICATED, 401);
    return response.toJson();
  }
}
