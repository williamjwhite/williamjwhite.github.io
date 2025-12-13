import * as React from "react";

/**
 * Local LinkedIn icon component.
 * - Uses `currentColor` so it inherits text color
 * - No dependency on lucide brand icons
 *
 * NOTE: This path is a simple LinkedIn-style mark. If you require the official LinkedIn logo,
 * you should source an approved SVG and ensure it complies with LinkedIn’s brand guidelines.
 */
export type LinkedinIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export function LinkedinIcon({ size = 20, ...props }: LinkedinIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 10.5h3v10H3v-10Zm6 0h2.9v1.4h.1c.4-.8 1.5-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.8v5.4h-3v-4.8c0-1.1 0-2.6-1.6-2.6-1.6 0-1.8 1.2-1.8 2.5v4.9H9v-10Z" />
    </svg>
  );
}
