import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <p className="text-2xl font-semibold text-slate-500">404</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              Page not found
            </h1>
            <p className="mt-3 text-slate-600">
              The page you’re looking for doesn’t exist (or was moved).
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-xl bg-[#FFE95C] px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:opacity-90 transition"
              >
                Go to login
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            <div className="aspect-[4/3] w-full bg-slate-100">
              <img
                src="https://img.freepik.com/free-vector/404-error-page-found_24908-59520.jpg?t=st=1768839954~exp=1768843554~hmac=d76ecac5c1eedca33472956d69631396847b8be4598de6be0bf9828e2d0ba72e"
                alt="404 illustration"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* FOOTER HINT */}
        <div className="mt-10 text-xs text-slate-500">
          If you think this is a mistake, try going back to the dashboard or login page.
        </div>
      </div>
    </div>
  );
}
