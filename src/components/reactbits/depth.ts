export type DepthLevel = 'surface' | 'overlay' | 'elevated';

export const depthBackgroundClasses: Record<DepthLevel, string> = {
  surface: 'bg-depth-surface text-foreground',
  overlay: 'bg-depth-overlay text-foreground',
  elevated: 'bg-depth-elevated text-foreground',
};

export const depthCardClasses: Record<DepthLevel, string> = {
  surface: 'bg-depth-surface border border-depth-surface/60 shadow-sm',
  overlay: 'bg-depth-overlay border border-depth-overlay/60 shadow-md',
  elevated: 'bg-depth-elevated border border-depth-elevated/50 shadow-lg',
};
