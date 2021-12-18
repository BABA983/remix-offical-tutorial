// catchcall

import { LoaderFunction } from "remix";

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params);
  return null;
};
export default function Test$Route() {
  return <div>catch rest route</div>;
}
