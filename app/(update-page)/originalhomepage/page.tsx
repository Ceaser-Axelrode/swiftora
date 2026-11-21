'use client';

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-4 pb-16 pt-24 text-white">
      {/* GIF Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/maintenance.gif"
          alt=""
          aria-hidden="true"
          className="h-auto w-full max-w-2xl mix-blend-screen"
        />
      </div>

      {/* Content */}
      <div className="z-10 px-2 text-center">
        <h1 className="mb-6 text-3xl font-bold tracking-wide sm:text-4xl md:text-6xl">
          Swiftora Solutions Project Update
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-300 md:text-xl">
          We are currently improving and refining this application experience.
          Please check back shortly as updates are being prepared.
        </p>

        <div className="mt-10 text-sm text-gray-500">
          © 2026 Swiftora Solutions
        </div>
      </div>
    </main>
  );
}
