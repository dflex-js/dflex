import React from "react";
import Link from "next/link";

function replaceSlashWithUnderscore(inputString: string): string {
  return inputString.replace(/\//g, "_");
}

function ClickableBox({
  link,
  title,
  desc,
}: {
  link: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={link}
      id={replaceSlashWithUnderscore(link)}
      className="group rounded-lg border px-5 py-4 transition-colors border-gray-300 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    >
      <h2 className={`mb-3 text-2xl font-semibold`}>
        {title}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{desc} </p>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div
        className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 md:grid-cols-2 lg:grid-cols-4 lg:text-left gap-3"
        id="main-page-content"
      >
        <ClickableBox
          desc="List items have the same height and width"
          title="Symmetric list"
          link="list/symmetric"
        />
        <ClickableBox
          desc="List items have  different height or width"
          title="Asymmetric list"
          link="list/asymmetric"
        />
        <ClickableBox
          desc="List items transformed without committing to the DOM"
          title="Transformation only list"
          link="list/transformation"
        />
        <ClickableBox
          desc="Unscrollable list positioned within a scrollable page."
          title="Scrollable page with fixed list"
          link="list/scrollable-page-content"
        />
      </div>
    </main>
  );
}
