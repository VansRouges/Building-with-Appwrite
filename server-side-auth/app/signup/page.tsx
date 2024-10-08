// src/app/signup/page.tsx
import { getLoggedInUser } from "@/app/lib/server/appwrite";
import { ID } from "node-appwrite";
import { createAdminClient } from "@/app/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function signUpWithEmail(formData: FormData) {
  "use server";

  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const name = formData.get("name") as string | null;

  if (!email || !password || !name) {
    throw new Error("All fields are required.");
  }

  const { account } = await createAdminClient();

  await account.create(ID.unique(), email, password, name);
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

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

  return (
    <div className="u-max-width-500 u-width-full-line">
      <h1 className="heading-level-2 u-margin-block-start-auto">
        Demo sign up
      </h1>
      <div className="u-margin-block-start-24">
        <form className="form common-section" action={signUpWithEmail}>
          <ul
            className="form-list"
            style={{ "--form-list-gap": "1.5rem;" } as React.CSSProperties}
          >
            <li className="form-item">
              <p>
                This is a demo project for{" "}
                <a href="https://appwrite.io">Appwrite</a> server side
                rendering. View the source code on the{" "}
                <a
                  className="link"
                  href="https://github.com/appwrite/demos-for-svelte"
                >
                  GitHub repository
                </a>
                .
              </p>
            </li>
            <li className="form-item">
              <label className="label is-required" htmlFor="name">
                Name
              </label>
              <div className="input-text-wrapper">
                <input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  autoComplete="off"
                  type="text"
                  className="input-text"
                />
              </div>
            </li>
            <li className="form-item">
              <label className="label is-required" htmlFor="email">
                Email
              </label>
              <div className="input-text-wrapper">
                <input
                  id="email"
                  name="email"
                  placeholder="Your email"
                  type="email"
                  className="input-text"
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
                  placeholder="Your password"
                  minLength={8}
                  type="password"
                  className="input-text"
                  autoComplete="off"
                />
                {/* <button
                  type="button"
                  className="show-password-button"
                  aria-label="show password"
                >
                  <span aria-hidden="false" className="icon-eye" />
                </button> */}
              </div>
            </li>
            <li className="form-item">
              <button className="button is-full-width" type="submit">
                {" "}
                Sign up
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
            Already got an account?{" "}
            <a className="link" href="/signin">
              Sign in
            </a>
          </span>
        </li>
      </ul>
    </div>
  );
}