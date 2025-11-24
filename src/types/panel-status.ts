export interface PanelStatus {
  icon: string;
  type: "success" | "info" | "warning" | "danger";
  locked: boolean;
  environment: string;
  title: string;
  content: string;
}
