export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string; desc: string }[] = [
    { value: 'L', label: 'منخفض (L)', desc: '~7% استعادة – أصغر حجم' },
    { value: 'M', label: 'متوسط (M)', desc: '~15% استعادة – الافتراضي' },
    { value: 'Q', label: 'عالي (Q)', desc: '~25% استعادة – موصى للطباعة' },
    { value: 'H', label: 'أقصى (H)', desc: '~30% استعادة – أعلى حماية' },
];
