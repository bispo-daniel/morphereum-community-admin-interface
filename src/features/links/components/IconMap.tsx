import { DynamicIcon } from "@/components";

const IconMap = ({
  icon,
  size,
}: {
  icon: string;
  size: number;
}): JSX.Element => {
  return <DynamicIcon iconName={icon} size={size} />;
};

export default IconMap;
