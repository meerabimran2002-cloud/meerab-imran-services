import {
  Code2, Smartphone, PenTool, Youtube, Image, ImagePlus, Video,
  Terminal, Linkedin, FileText, Smile, Layers, Sparkles,
} from "lucide-react";

const map = {
  Code2, Smartphone, PenTool, Youtube, Image, ImagePlus, Video,
  Terminal, Linkedin, FileText, Smile, Layers, Sparkles,
} as const;

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (map as Record<string, typeof Sparkles>)[name] ?? Sparkles;
  return <Icon className={className} />;
}
