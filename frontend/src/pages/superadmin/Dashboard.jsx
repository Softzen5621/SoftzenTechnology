export default function Dashboard() {

  return (

    <div
      className="
        min-h-screen
        bg-slate-950
        text-white
        p-10
      "
    >

      {/* HEADER */}
      <div
        className="
          flex
          justify-between
          items-center
          mb-10
        "
      >

        <div>

          <h1
            className="
              text-5xl
              font-black
            "
          >
            👑 Super Admin
          </h1>

          <p
            className="
              text-slate-400
              mt-2
            "
          >
            SaaS ERP Platform Control
          </p>

        </div>

        <div
          className="
            bg-green-500/10
            border
            border-green-500/20
            px-5
            py-3
            rounded-2xl
            text-green-400
          "
        >
          Platform Live
        </div>

      </div>

      {/* CARDS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-8
          "
        >

          <h2
            className="
              text-5xl
              font-black
            "
          >
            0
          </h2>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            Total Schools
          </p>

        </div>

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-8
          "
        >

          <h2
            className="
              text-5xl
              font-black
              text-cyan-400
            "
          >
            0
          </h2>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            Active Users
          </p>

        </div>

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-8
          "
        >

          <h2
            className="
              text-5xl
              font-black
              text-green-400
            "
          >
            ₹0
          </h2>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            Monthly Revenue
          </p>

        </div>

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-8
          "
        >

          <h2
            className="
              text-5xl
              font-black
              text-purple-400
            "
          >
            AI
          </h2>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            ERP Engine
          </p>

        </div>

      </div>

      {/* COMING */}
      <div
        className="
          mt-10
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-10
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            mb-4
          "
        >
          🚀 Platform Controls
        </h2>

        <p
          className="
            text-slate-400
          "
        >
          School creation,
          subscription management,
          analytics,
          billing,
          security,
          audit logs,
          AI controls,
          and enterprise SaaS tools
          will appear here.
        </p>

      </div>

    </div>
  );
}