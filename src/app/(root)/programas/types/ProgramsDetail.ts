export interface ProgramIntern {
  name: string;
  description: string;
  type: string;
  title: string;
  subtitle: string;
  content: string;
  headerTitle: string;
  contentTitle: string;
  youtubeVideoId: string;
  imageUrl: string;
  action: Action;
  cards: Cards[];
}
export interface Action {
  variant: string;
  content: string;
  path?: string | null | undefined;
  isDownload: boolean;
}
export interface Cards {
  background: string;
  description: string;
  infos: Infos[];
  headerText: string;
  isSoon: boolean;
  title: string;
  steps: Steps[];
}

interface Steps {
  label: string;
  value: string;
  partnersImages: string[];
}

interface Infos {
  label: string;
  labelDescription: string;
  value: string;
  checked: boolean;
}
