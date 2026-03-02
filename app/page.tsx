"use client";

export default function Home() {
  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    console.log(document.documentElement.classList.value);
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <button
        onClick={toggleTheme}
        className="rounded-lg border px-4 py-2"
      >
        Toggle theme
      </button>

      <div className="text-5xl font-bold bg-primary text-primary-foreground transition-colors duration-300 px-4 py-2 rounded-lg">
        aschalew muleta
      </div>
    </div>
  );
}
