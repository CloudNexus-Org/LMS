export default function AuthBrandPanel({ title, description }) {
  return (
    <div
      className="
        relative isolate
        flex flex-col
        overflow-hidden
        p-8 sm:p-10 lg:p-12
        text-center
        min-h-[420px] lg:min-h-[560px]
      "
      style={{
        background:
          "radial-gradient(120% 80% at 50% 60%, rgba(99,102,241,0.10) 0%, rgba(99,102,241,0.05) 35%, #f5f7ff 70%, #eef2ff 100%)",
      }}
    >
      {/* AMBIENT GLOWS */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute
          -left-20 -top-20
          h-72 w-72
          rounded-full
          blur-3xl
        "
        style={{ background: "rgba(99,102,241,0.18)" }}
      />
      <div
        aria-hidden
        className="
          pointer-events-none absolute
          -bottom-24 -right-24
          h-80 w-80
          rounded-full
          blur-3xl
        "
        style={{ background: "rgba(99,102,241,0.14)" }}
      />

      {/* SUBTLE GRID */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* LOGO */}
      <div className="relative z-10 flex items-center justify-start gap-2">
        <span
          className="flex h-3 w-3 rounded-full"
          style={{
            background: "#6366f1",
            boxShadow: "0 0 12px rgba(99,102,241,0.7)",
          }}
        />
        <span className="text-[15px] font-extrabold tracking-tight text-slate-900">
          Cloud Nexus
        </span>
      </div>

      {/* ORB ILLUSTRATION */}
      <div className="relative z-10 my-auto flex items-center justify-center py-10">
        <div className="relative flex items-center justify-center">
          {/* outer glow halo */}
          <div
            aria-hidden
            className="absolute h-[280px] w-[280px] rounded-full blur-2xl auth-orb-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.30) 0%, rgba(99,102,241,0.10) 35%, transparent 70%)",
            }}
          />

          {/* outer ring */}
          <div
            aria-hidden
            className="
              relative
              h-[200px] w-[200px]
              rounded-full
              flex items-center justify-center
            "
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 60%, transparent 100%)",
              border: "1px solid rgba(99,102,241,0.18)",
              boxShadow:
                "inset 0 0 40px rgba(99,102,241,0.10), 0 24px 60px -10px rgba(99,102,241,0.30)",
            }}
          >
            {/* mid ring (white halo) */}
            <div
              aria-hidden
              className="
                relative
                h-[120px] w-[120px]
                rounded-full
                flex items-center justify-center
                auth-orb-float
              "
              style={{
                background:
                  "radial-gradient(circle at 50% 35%, #ffffff 0%, #ffffff 60%, #eef2ff 100%)",
                boxShadow:
                  "0 20px 50px -10px rgba(99,102,241,0.45), inset 0 0 30px rgba(99,102,241,0.10)",
              }}
            >
              {/* inner blue orb */}
              <div
                aria-hidden
                className="h-[64px] w-[64px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #818cf8 0%, #6366f1 45%, #4338ca 100%)",
                  boxShadow:
                    "0 8px 24px rgba(99,102,241,0.65), inset 0 -6px 14px rgba(0,0,0,0.25), inset 0 4px 10px rgba(255,255,255,0.35)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM TEXT */}
      <div className="relative z-10 mt-auto">
        <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-slate-900 md:text-[28px]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-[300px] text-[13px] leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
