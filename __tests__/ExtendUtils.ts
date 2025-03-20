import { ExtendUtils } from "../src/ExtendUtils";

test("Tests for applyMixins", () => {
  class a {
    m() {
      return 1;
    }
  }
  class b {
    m(id: number) {
      return id;
    }
  }
  class c {
    m2() {
      return "hello";
    }
  }

  interface a extends b, c {}
  ExtendUtils.applyMixins(a, [b, c]);
  const item = new a();
  expect(item.m()).toBe(1);
  expect(item.m2()).toBe("hello");
});

test("Tests for applyMixins with override", () => {
  class a {
    m() {
      return 0;
    }
    get id() {
      return 1;
    }
  }
  class b {
    m(id: number) {
      return id;
    }
    get id() {
      return 2;
    }
  }

  interface a extends b {
    m(id: number): number;
  }
  ExtendUtils.applyMixins(a, [b], true);
  const item = new a();
  expect(item.id).toBe(2);
  // As the method is overridden, the return value should be undefined
  expect(item.m()).toBe(undefined);
  expect(item.m(3)).toBe(3);
});

test("Tests for delayedExecutor", () => {
  // Arrange
  const f = vi.fn();

  const e = ExtendUtils.delayedExecutor(f, 50);

  e.call(1, false, "a");
  expect(e.isRunning()).toBeTruthy();

  e.call(2, true, "b");

  expect(f).toHaveBeenCalledTimes(0);
  e.clear();
  expect(e.isRunning()).toBeFalsy();
});

test("Tests for promiseHandler", async () => {
  // Arrange
  const p = (id: number) => {
    return new Promise((resolve, reject) => {
      if (id > 0) resolve(id);
      else reject(new Error(`Id ${id} Error`));
    });
  };

  const handler1 = await ExtendUtils.promiseHandler(p(12));
  expect(handler1[0]).toBe(12);

  const handler2 = await ExtendUtils.promiseHandler(p(-1));
  expect(handler2[1]).toHaveProperty("message", "Id -1 Error");
});
