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
  desc?: string;
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
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{desc}</p>
    </Link>
  );
}

export default ClickableBox;
