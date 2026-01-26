import { useMemo, useState } from "react";

/**
 * Chato SDK Docs Page (React + Tailwind)
 * - Drop into your frontend as /docs (route it however you like)
 * - Includes code tabs (Groovy / Kotlin DSL)
 * - Updated for JitPack installation + new artifact coordinates
 */

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700">
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <div className="text-xs font-semibold tracking-wider text-zinc-500">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h1>
      {desc ? (
        <p className="mt-4 text-base sm:text-lg text-zinc-600">{desc}</p>
      ) : null}
    </div>
  );
}

function TocLink({ href, children }) {
  return (
    <a
      href={href}
      className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
    >
      {children}
    </a>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 900);
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={onCopy}
      className={classNames(
        "rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold",
        "text-zinc-700 hover:bg-zinc-100"
      )}
      type="button"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ code }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950">
      <div className="absolute right-3 top-3">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-5 text-[12.5px] leading-relaxed text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CodeTabs({ tabs, defaultKey }) {
  const keys = useMemo(() => tabs.map((t) => t.key), [tabs]);
  const [active, setActive] = useState(defaultKey ?? keys[0]);

  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-3 py-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={classNames(
                "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition",
                active === t.key
                  ? "bg-white border border-zinc-200 text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab.badge ? <Badge>{activeTab.badge}</Badge> : null}
      </div>

      <div className="p-4">
        <CodeBlock code={activeTab.code} />
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="font-semibold text-zinc-900">{title}</div>
      <div className="mt-2 text-sm text-zinc-600">{children}</div>
    </div>
  );
}

export default function ChatoDocsPage() {
  // ✅ Updated JitPack version
  const sdkVersion = "v0.1.1";
  const minSdk = 21;

  // === CODE SNIPPETS (based on your sample-app screenshot) ===
  const kotlinInitAttachDetach = `class MainActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    Chato.init(
      context = applicationContext,
      apiKey = "YOUR_API_KEY"
    )
  }

  override fun onResume() {
    super.onResume()
    Chato.attach(this)
  }

  override fun onPause() {
    super.onPause()
    Chato.detach()
  }
}`;

  // Java placeholder (keep as tab but you can remove if you don't want it)
  const javaInitAttachDetach = `public class MainActivity extends AppCompatActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Chato.init(
      /* context = */ getApplicationContext(),
      /* apiKey  = */ "YOUR_API_KEY"
    );
  }

  @Override
  protected void onResume() {
    super.onResume();
    Chato.attach(this);
  }

  @Override
  protected void onPause() {
    super.onPause();
    Chato.detach();
  }
}`;

  // ✅ JitPack repo (settings.gradle / settings.gradle.kts)
  const jitpackRepoGradleGroovy = `dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
  }
}`;

  const jitpackRepoGradleKts = `dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    mavenCentral()
    maven(url = "https://jitpack.io")
  }
}`;

  // ✅ JitPack dependency (module build.gradle / build.gradle.kts)
  const jitpackDepGradleGroovy = `dependencies {
  implementation 'com.github.RoeiKat:chato-sdk:${sdkVersion}'
}`;

  const jitpackDepGradleKts = `dependencies {
  implementation("com.github.RoeiKat:chato-sdk:${sdkVersion}")
}`;

  const manifestInternet = `<uses-permission android:name="android.permission.INTERNET" />`;

  const dashboardSteps = `1) Sign in to Chato dashboard
2) Create an App
3) Copy the API Key
4) Paste it into Chato.init(...)`;

  return (
    <div className="min-h-screen bg-[#F6FAF9] text-zinc-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-[#F6FAF9]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 font-semibold text-xl">
            <img
              src="/logo.png"
              alt="Chato"
              className="h-8 w-8 rounded-xl object-contain -mr-1"
              draggable={false}
            />
            Chato Docs
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Back
            </a>
            <a
              href="/auth"
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:brightness-95"
            >
              Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <SectionTitle
          eyebrow="ANDROID SDK"
          title="Chato SDK Documentation"
          desc="Plug-and-play in-app support chat for Android. Add the bubble, open the popup, and answer users from the web dashboard — in real time."
        />

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2">
          <Badge>Min SDK: {minSdk}+</Badge>
          <Badge>Latest: {sdkVersion}</Badge>
          <Badge>Realtime messaging</Badge>
          <Badge>Remote theming</Badge>
          <Badge>Pre-chat flow</Badge>
        </div>
      </section>

      {/* Layout */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* Sidebar / TOC */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold tracking-wider text-zinc-500">
                ON THIS PAGE
              </div>
              <div className="mt-3 space-y-1">
                <TocLink href="#overview">Overview</TocLink>
                <TocLink href="#requirements">Requirements</TocLink>
                <TocLink href="#install">Installation</TocLink>
                <TocLink href="#get-started">Get started</TocLink>
                <TocLink href="#lifecycle">Attach / detach</TocLink>
                <TocLink href="#customization">Customization</TocLink>
                <TocLink href="#prechat">Pre-chat flow</TocLink>
                <TocLink href="#realtime">Real-time messaging</TocLink>
                <TocLink href="#faq">FAQ</TocLink>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold tracking-wider text-zinc-500">
                QUICK LINKS
              </div>
              <div className="mt-3 space-y-2">
                <a
                  href="/auth"
                  className="block rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:brightness-95"
                >
                  Open dashboard
                </a>
                <a
                  href="#install"
                  className="block rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  Jump to install
                </a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="space-y-14">
            {/* OVERVIEW */}
            <div id="overview" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
                <p className="mt-3 text-zinc-600">
                  Chato adds a floating chat bubble to your Android app. When users tap it,
                  a chat popup opens and messages sync in real time with your support agents
                  on the web dashboard.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InfoCard title="Plug & play">
                    Initialize with your API key and attach it to your Activity.
                  </InfoCard>
                  <InfoCard title="Remote theming">
                    Customize colors, icon, title, and pre-chat questions from the dashboard.
                  </InfoCard>
                  <InfoCard title="Realtime">
                    No polling. Messages appear instantly between the app and dashboard.
                  </InfoCard>
                </div>
              </div>
            </div>

            {/* REQUIREMENTS */}
            <div id="requirements" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">Requirements</h2>
                <ul className="mt-4 space-y-2 text-zinc-700">
                  <li>• Android minSdk: <b>{minSdk}+</b></li>
                  <li>• Internet permission enabled</li>
                  <li>• A Chato account + API key (from the dashboard)</li>
                </ul>
              </div>
            </div>

            {/* INSTALL */}
            <div id="install" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>

                <div className="mt-6 space-y-7">
                  <div>
                    <div className="font-semibold text-zinc-900">
                      1) Add the JitPack repository (root settings.gradle)
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      Add JitPack to your <code className="rounded bg-zinc-100 px-1.5 py-0.5">settings.gradle</code>{" "}
                      (or <code className="rounded bg-zinc-100 px-1.5 py-0.5">settings.gradle.kts</code>) inside{" "}
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5">dependencyResolutionManagement</code>.
                    </p>
                    <div className="mt-3">
                      <CodeTabs
                        defaultKey="groovy"
                        tabs={[
                          {
                            key: "groovy",
                            label: "Gradle (Groovy)",
                            badge: "settings.gradle",
                            code: jitpackRepoGradleGroovy,
                          },
                          {
                            key: "kts",
                            label: "Gradle (Kotlin DSL)",
                            badge: "settings.gradle.kts",
                            code: jitpackRepoGradleKts,
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-zinc-900">
                      2) Add the dependency (module build.gradle)
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      Current release:{" "}
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5">{sdkVersion}</code>
                    </p>
                    <div className="mt-3">
                      <CodeTabs
                        defaultKey="kts"
                        tabs={[
                          {
                            key: "kts",
                            label: "Gradle (Kotlin DSL)",
                            badge: "app/build.gradle.kts",
                            code: jitpackDepGradleKts,
                          },
                          {
                            key: "groovy",
                            label: "Gradle (Groovy)",
                            badge: "app/build.gradle",
                            code: jitpackDepGradleGroovy,
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-zinc-900">
                      3) Ensure internet permission
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      Add this in your{" "}
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5">AndroidManifest.xml</code>.
                    </p>
                    <div className="mt-3">
                      <CodeTabs
                        defaultKey="manifest"
                        tabs={[
                          {
                            key: "manifest",
                            label: "Manifest",
                            badge: "AndroidManifest.xml",
                            code: manifestInternet,
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GET STARTED */}
            <div id="get-started" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">Get started</h2>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <div className="font-semibold text-zinc-900">
                      1) Create an app + API key
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      Each API key represents one application. Copy it from your Chato dashboard.
                    </p>

                    <div className="mt-4">
                      <CodeTabs
                        defaultKey="steps"
                        tabs={[
                          {
                            key: "steps",
                            label: "Steps",
                            badge: "Dashboard",
                            code: dashboardSteps,
                          },
                        ]}
                      />
                    </div>

                    <div className="mt-6 font-semibold text-zinc-900">
                      2) Initialize the SDK
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      Initialize once (usually in <b>onCreate</b>). Then attach/detach the UI to your Activity lifecycle.
                    </p>
                  </div>

                  <div>
                    <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-zinc-900">
                          Sample
                        </div>
                        <Badge>Kotlin</Badge>
                      </div>
                      <img
                        src="/screenshots/sdk_screenshot1.png"
                        alt="Sample-app integration snippet"
                        className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <CodeTabs
                    defaultKey="kotlin"
                    tabs={[
                      {
                        key: "kotlin",
                        label: "Kotlin",
                        badge: "MainActivity.kt",
                        code: kotlinInitAttachDetach,
                      },
                      {
                        key: "java",
                        label: "Java",
                        badge: "MainActivity.java",
                        code: javaInitAttachDetach,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* LIFECYCLE */}
            <div id="lifecycle" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">Attach / detach</h2>
                <p className="mt-3 text-zinc-600">
                  Chato shows UI (bubble + popup) by attaching to your Activity. For a smooth experience,
                  attach in <b>onResume</b> and detach in <b>onPause</b>.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard title="Why attach?">
                    Keeps the bubble consistent per-screen and prevents overlay leaks between activities.
                  </InfoCard>
                  <InfoCard title="Why detach?">
                    Ensures Chato cleans up overlays when your Activity is not active.
                  </InfoCard>
                </div>
              </div>
            </div>

            {/* CUSTOMIZATION */}
            <div id="customization" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">Customization</h2>
                <p className="mt-3 text-zinc-600">
                  Chato is configured remotely from the dashboard - no app update required.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard title="Primary color">
                    Used for message bubbles and the send button.
                  </InfoCard>
                  <InfoCard title="Bubble background">
                    Controls only the floating launcher bubble.
                  </InfoCard>
                  <InfoCard title="Chat title">
                    Defaults to <b>Support</b> when empty.
                  </InfoCard>
                  <InfoCard title="Bubble icon (SVG)">
                    Upload your own SVG icon for the bubble (optional).
                  </InfoCard>
                </div>
              </div>
            </div>

            {/* PRECHAT */}
            <div id="prechat" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">Pre-chat flow</h2>
                <p className="mt-3 text-zinc-600">
                  Before the chat starts, you can ask for the user’s name/email and show a final message
                  (FAQ / “thanks for waiting”).
                </p>

                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-sm font-semibold text-zinc-900">
                    Recommended defaults
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                    <li>• q1: Ask for the customer name</li>
                    <li>• q2: Ask for email for follow-up if they leave</li>
                    <li>• q3: Final FAQ / waiting message</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* REALTIME */}
            <div id="realtime" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">Real-time messaging</h2>
                <p className="mt-3 text-zinc-600">
                  Messages sync instantly between your Android users and your support agents on the web dashboard.
                  There’s no polling required on your side.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InfoCard title="App → Dashboard">
                    User messages appear immediately for the agent.
                  </InfoCard>
                  <InfoCard title="Dashboard → App">
                    Agent replies appear instantly in the user’s chat.
                  </InfoCard>
                  <InfoCard title="Persistent sessions">
                    Conversations can continue across app restarts (based on SDK session handling).
                  </InfoCard>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div id="faq" className="scroll-mt-28">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>

                <div className="mt-6 space-y-4">
                  <InfoCard title="Do I need my own backend?">
                    No, Chato provides the backend and real-time messaging infrastructure.
                  </InfoCard>
                  <InfoCard title="Can I disable pre-chat questions?">
                    Yes, leave them empty in your dashboard configuration.
                  </InfoCard>
                  <InfoCard title="Is the UI customizable?">
                    Yes, Colors, Bubble icon, Title, And Pre-chat are configurable remotely.
                  </InfoCard>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="text-center text-sm text-zinc-500">
              © {new Date().getFullYear()} Chato - SDK Docs
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
