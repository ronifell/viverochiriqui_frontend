import {
  Apple,
  Cherry,
  Flower2,
  Leaf,
  PackageOpen,
  Sprout,
  Sun,
  Tag,
  TreeDeciduous,
  TreePine,
} from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  flower: Flower2,
  leaf: Leaf,
  sun: Sun,
  tree: TreeDeciduous,
  pine: TreePine,
  apple: Apple,
  succulent: Sprout,
  cactus: Cherry,
  pot: PackageOpen,
  soil: PackageOpen,
  tag: Tag,
};

export function getCategoryIcon(icon?: string | null) {
  return (icon && ICONS[icon]) || Leaf;
}

export function CategoryIcon({
  icon,
  className,
}: {
  icon?: string | null;
  className?: string;
}) {
  const Icon = getCategoryIcon(icon);
  return <Icon className={className} />;
}
