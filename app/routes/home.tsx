import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Country Quiz" },
    {
      name: "description",
      content: "Pon a prueba tu conocimiento sobre los países del mundo.",
    },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-indigo-900">
      <h1 className="text-4xl font-bold text-white">Country Quiz 🌍</h1>
    </main>
  );
}
