export const loader = () => {
  return new Response("hahaha", { headers: { "Content-Type": "text/plain" } });
};
