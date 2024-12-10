export type ExtractFilterProps = {
  typeFilter?: string;
  onChangeTypeFilter: (value: string) => void;
  toggleFilterModal: () => void;
};

export type ExtractDateFilterProps = {
  toggleFilterModal: () => void;
  onToggleLoading: (value: boolean) => void;
  isLoadingFilter?: boolean;
  startDateFilter?: string;
  endDateFilter?: string;
  onApplyStartDateFilter: (value?: string) => void;
  onApplyEndDateFilter: (value?: string) => void;
};
