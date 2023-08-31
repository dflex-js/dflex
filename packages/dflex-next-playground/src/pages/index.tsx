import React from "react";
import Link from "next/link";

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
      className="group rounded-lg border  px-5 py-4 transition-colors border-gray-300 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
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
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24`}
    >
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <ClickableBox
          desc="All list items has the same height and width"
          title="Symmetric list"
          link="list/symmetric"
        />
      </div>
    </main>
  );
}
