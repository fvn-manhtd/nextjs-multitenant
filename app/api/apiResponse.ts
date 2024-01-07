import { NextResponse } from "next/server";

export class ApiResponse {
  status: string;
  message: any | null;
  data: any | null;

  constructor(
    status: string,
    message: any | null = null,
    data: any | null = null
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  toJson() {
    return NextResponse.json({
      status: this.status,
      ...(this.message !== null && { message: this.message }),
      ...(this.data !== null && { data: this.data }),
    });
  }

  static error(message: any, data: any | null = null) {
    const response = new ApiResponse("error", message, data);
    return response.toJson();
  }

  static success(data: any) {
    const response = new ApiResponse("success", null, data);
    return response.toJson();
  }

  static unAuthenticated() {
    const response = new ApiResponse("unauthenticated");
    return response.toJson();
  }
}
