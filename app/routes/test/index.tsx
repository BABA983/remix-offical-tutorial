import { Outlet } from "remix";

export default function TestIndexRoute() {
  return (
    <div>
      Test remix.config.js define nested routes <br />
      <Outlet />
    </div>
  );
}
