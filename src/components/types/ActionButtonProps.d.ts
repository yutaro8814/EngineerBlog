export interface ActionButtonProps{
    onClick: () => void;
    label: string;
    disabled?: boolean;
    colorScheme?: "primary"|"danger"|"secondary"|"success"|"warning"|"info";  // ← 色だけ切り替えられる
    className?: string; // 追加: カスタムクラス名
};