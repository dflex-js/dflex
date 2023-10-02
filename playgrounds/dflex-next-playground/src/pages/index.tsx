import React from "react";
import { ClickableBox } from "../components";

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
          desc="Unscrollable list positioned within a scrollable page"
          title="Scrollable page with fixed list"
          link="list/scrollable-page-content"
        />
        <ClickableBox
          desc="Direct navigation from one list to another"
          title="From list to another"
          link="from-to"
        />
      </div>
    </main>
  );
}
