/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { extractOpts } from "../../src/utils/extractOpts";

describe("extractOpts", () => {
  it("Returns default options when empty object is passed", () => {
    const opts = extractOpts({});

    expect(opts).toMatchSnapshot();
  });

  it("Returns the default options with input scroll/threshold", () => {
    const opts = extractOpts({ scroll: { threshold: { horizontal: 1000 } } });

    expect(opts).toMatchSnapshot();

    expect(opts.scroll.threshold.horizontal).toEqual(1000);
  });

  it("Returns the default options with input scroll/threshold/enable", () => {
    const opts = extractOpts({
      scroll: { enable: false, threshold: { horizontal: 1000 } },
    });

    expect(opts).toMatchSnapshot();

    expect(opts.scroll.threshold.horizontal).toEqual(1000);
    expect(opts.scroll.enable).toEqual(false);
  });

  it("Returns the default options with input restrictions/allowLeavingFromBottom", () => {
    const opts = extractOpts({
      restrictions: {
        allowLeavingFromBottom: false,
      },
    });

    expect(opts).toMatchSnapshot();

    expect(opts.restrictions.allowLeavingFromBottom).toEqual(false);
  });
});

it("Returns the default options with input restrictions/threshold/scroll", () => {
  const opts = extractOpts({
    restrictions: {
      allowLeavingFromBottom: false,
    },
    threshold: {
      horizontal: 9000,
    },
    scroll: {
      threshold: {
        horizontal: 9000,
      },
    },
  });

  expect(opts).toMatchSnapshot();

  expect(opts.restrictions.allowLeavingFromBottom).toEqual(false);
  expect(opts.threshold.horizontal).toEqual(9000);
  expect(opts.scroll.threshold.horizontal).toEqual(9000);
});
