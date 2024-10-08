// import { signInWithGithub } from "@/lib/server/oauth";
import { createAdminClient, getLoggedInUser } from "@/app/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/app/lib/server/const";
import Link from "next/link";

async function signInWithEmail(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // console.table({ email, password });

  if (!email || !password ) {
    throw new Error("All fields are required.");
  }

  const { account } = await createAdminClient();
  const session = await account.createEmailPasswordSession(email, password);

  cookies().set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  console.log("logged in", session);

  redirect("/account");
}

export default async function SignInPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-2xl mt-10">
      <h1 className="heading-level-2 text-center font-semibold text-3xl">
        Demo sign in
      </h1>
      <div className="u-margin-block-start-24">
        <form className="form common-section" action={signInWithEmail}>
          <ul
            className="form-list"
            style={{ "--form-list-gap": "1.5rem" } as React.CSSProperties}
          >
            <li className="form-item">
              <p>
                This is a demo project for{" "}
                <Link className="text-indigo-400" href="https://appwrite.io">Appwrite</Link> server side
                rendering. View the source code on the{" "}
                <Link
                  className="text-indigo-400"
                  href="https://github.com/appwrite/demos-for-svelte"
                >
                  GitHub repository
                </Link>
                .
              </p>
            </li>
            <li className="form-item">
              <label className="label is-required" htmlFor="email">
                Email
              </label>
              <div className="input-text-wrapper">
                <input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="outline outline-1 rounded-lg p-1"
                  autoComplete="off"
                />
              </div>
            </li>
            <li className="form-item">
              <label className="label is-required" htmlFor="password">
                Password
              </label>
              <div
                className="input-text-wrapper"
                style={{ "--amount-of-buttons": "1" } as React.CSSProperties}
              >
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  minLength={8}
                  type="password"
                  className="outline outline-1 rounded-lg p-1"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="show-password-button"
                  aria-label="show password"
                >
                  <span aria-hidden="true" className="icon-eye" />
                </button>
              </div>
            </li>
            <li className="form-item">
              <button className="button is-full-width bg-indigo-700 text-white p-2 rounded-xl my-3" type="submit">
                Sign in
              </button>
            </li>
            <span className="with-separators eyebrow-heading-3">or</span>
            <li className="form-item"></li>
          </ul>
        </form>
        {/* <form action={signInWithGithub}>
          <button className="button is-github is-full-width" type="submit">
            <span className="icon-github" aria-hidden="true" />
            <span className="text">Sign up with GitHub</span>
          </button>
        </form> */}
      </div>
      <ul className="inline-links is-center is-with-sep u-margin-block-start-32">
        <li className="inline-links-item">
          <span className="text">
            Don&#39;t have an account?{" "}
            <Link className="text-indigo-400" href="/signup">
              Sign up
            </Link>
          </span>
        </li>
      </ul>
    </div>
  );
}