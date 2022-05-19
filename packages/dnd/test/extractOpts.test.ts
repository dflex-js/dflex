import { InteractivityEvent } from "../src/types";
import { extractOpts } from "../src/utils/extractOpts";

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

  it("Returns the default options with self restrictions/allowLeavingFromLeft+right", () => {
    const opts = extractOpts({
      restrictions: {
        self: {
          allowLeavingFromTop: true,
          allowLeavingFromBottom: true,
          allowLeavingFromLeft: false,
          allowLeavingFromRight: false,
        },
      },
    });

    expect(opts).toMatchSnapshot();

    expect(opts.restrictions.self.allowLeavingFromLeft).toEqual(false);
    expect(opts.restrictions.self.allowLeavingFromRight).toEqual(false);
  });

  it("Returns the default options with input restrictions/allowLeavingFromBottom", () => {
    const opts = extractOpts({
      restrictions: {
        container: {
          allowLeavingFromBottom: false,
        },
      },
    });

    expect(opts).toMatchSnapshot();

    expect(opts.restrictions.container.allowLeavingFromBottom).toEqual(false);
  });

  it("Returns the default options with input restrictions/threshold/scroll", () => {
    const opts = extractOpts({
      containersTransition: {
        enable: false,
      },
      restrictions: {
        container: {
          allowLeavingFromBottom: false,
        },
        self: {
          allowLeavingFromTop: false,
        },
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

    expect(opts.restrictions.container.allowLeavingFromBottom).toEqual(false);
    expect(opts.restrictions.self.allowLeavingFromTop).toEqual(false);

    expect(opts.containersTransition).toMatchInlineSnapshot(`
      Object {
        "enable": false,
        "margin": 10,
      }
    `);

    expect(opts.threshold.horizontal).toEqual(9000);
    expect(opts.scroll.threshold.horizontal).toEqual(9000);
  });

  it("All three events handlers are defined", () => {
    const opts = extractOpts({});

    expect(opts.events.onDragLeave).toBeDefined();
    expect(opts.events.onDragOver).toBeDefined();
    expect(opts.events.onStateChange).toBeDefined();
  });

  it("Returns the correct event handler function", () => {
    function onDragLeave(e: InteractivityEvent) {
      // eslint-disable-next-line no-console
      console.log(e);
    }

    const opts = extractOpts({
      events: {
        onDragLeave,
      },
    });

    expect(opts).toMatchSnapshot();
  });
});
