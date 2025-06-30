export type menuProps = {
    visible: boolean;
    onClose: () => void;
    onMapSelect: () => void;
    onLogsSelect: () => void;
    onToggleTheme: () => void;
    theme: "light" | "dark";
};