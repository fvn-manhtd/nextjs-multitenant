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
    return {
      status: this.status,
      ...(this.message !== null && { message: this.message }),
      ...(this.data !== null && { data: this.data }),
    };
  }
}
