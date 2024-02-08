import { FC } from "react";

export const PermissionDeniedMessage: FC = () => (
    <div className="text-red-600 font-bold">
      Permission to access webcam was denied. Please give webcam permission and reload the page.
    </div>
);
