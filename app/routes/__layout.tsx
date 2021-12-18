import { Outlet } from "remix";

export default function LayoutRoute() {
  return (
    <div>
      __Layout <br />
      <Outlet />
    </div>
  );
}
