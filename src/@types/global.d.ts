export {};

interface StandardFields {
  id: number;
  create_time: number;
  update_time: number;
}

declare global {
  declare namespace AppDocs {
    export interface DeviceModel extends StandardFields {
      name: string;
      disabled: boolean;
    }

    export interface Device extends StandardFields {
      name: string;
      model: string;
      price: number;
      status: number;
    }
  }

  declare namespace AppStandardRequest {
    export interface Params {
      sort?: string;
      page?: number;
      page_size?: number;
      [index: string]: any;
    }
  }

  declare namespace AppStandardResponse {
    export interface List<T = any> {
      resources: T[];
      metadata: {
        page: number;
        page_size: number;
        total_size: number;
      };
    }

    export interface Action<T = any> {
      success: boolean;
      data: T;
      message: string;
    }
  }
}
