export interface EventsResponse {
  totalSize: number;

  done: boolean;

  records: Event[];
}

export interface Event {
  attributes: {
    type: string;
    url: string;
  };
  Id: string;
  IsDeleted: boolean;
  Name: string;
  Type: string;
  Status: string;
  StartDate: string;
  EndDate: string;
  Description?: string;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
}
